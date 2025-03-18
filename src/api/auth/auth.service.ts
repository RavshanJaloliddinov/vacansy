import { Injectable, NotFoundException, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { config } from "src/config";
import { RegisterDto } from "./dto/register.dto";
import { BcryptEncryption } from "src/infrastructure/bcrypt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { OrganizationEntity, UserEntity } from "src/core/entity";
import { ResetPasswordWithTokenDto, UpdatePasswordDto } from "./dto/update-password.dto";
import { CustomMailerService } from "src/infrastructure/mail/mail.service";
import { RedisCacheService } from "src/infrastructure/redis/redis.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisCacheService,
        private readonly customMailerService: CustomMailerService,
        @InjectRepository(OrganizationEntity)
        private readonly organizationRepository: Repository<OrganizationEntity>
    ) { }

    // **1️⃣ Foydalanuvchini ro‘yxatdan o‘tkazish**
    // async register(registerDto: RegisterDto) {
    //     const { email, password, name } = registerDto;

    //     const existingUser = await this.userRepository.findOne({ where: { email, is_deleted: false } });
    //     if (existingUser) {
    //         throw new ConflictException("Email already registered.");
    //     }

    //     // OTP generatsiya qilish
    //     const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //     // OTPni Redisda saqlash (10 daqiqaga)
    //     await this.redisService.set(`register_otp:${email}`, otp, 600);

    //     // Emailga yuborish
    //     await this.customMailerService.sendOtpEmail(email, otp);

    //     return { message: "OTP sent to your email. Please verify to complete registration." };
    // }

    // **1️⃣ Ro‘yxatdan o‘tish (OTP yuborish)**
    async register(registerDto: RegisterDto) {
        const { email, password, conifirmPassword, name } = registerDto;
        console.log(registerDto)
        if (password !== conifirmPassword) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        const existingUser = await this.userRepository.findOne({ where: { email, is_deleted: false } });
        if (existingUser) {
            throw new ConflictException("Email already registered.");
        }

        // Redisda mavjud ma'lumotni tekshirish
        const existingOtpData = await this.redisService.get(`register_otp:${email}`);
        if (existingOtpData) {
            // Eski ma'lumotni o‘chirish
            await this.redisService.deleteByText(`register_otp:${email}`);
        }

        // OTP yaratish
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Redis-ga foydalanuvchi ma'lumotlari bilan OTP saqlash (10 daqiqa)
        console.log(registerDto)
        await this.redisService.set(`register_otp:${email}`, JSON.stringify({ name, email, password, otp }), 600);

        // OTP-ni email orqali yuborish
        await this.customMailerService.sendOtpEmail(email, otp);

        return { message: "OTP sent to email. Please verify." };
    }


    // **2️⃣ OTP tasdiqlash va ro‘yxatdan o‘tkazish**
    async verifyOtp(email: string, otp: string) {
        // Redisdan saqlangan ma'lumotlarni olish
        const data = await this.redisService.get(`register_otp:${email}`);

        if (!data) {
            throw new UnauthorizedException("OTP has expired or is invalid.");
        }

        const { name, password, otp: savedOtp } = JSON.parse(data);

        // if (!password) {
        //     throw new BadRequestException("Password is missing in OTP verification.");
        // }

        if (savedOtp !== otp) {
            throw new UnauthorizedException("Invalid OTP.");
        }

        // Foydalanuvchini bazaga qo‘shish
        const hashedPassword = await BcryptEncryption.encrypt(password);
        const user = this.userRepository.create({ email, password: hashedPassword, name });
        await this.userRepository.save(user);

        // Redis-dan OTPni o‘chirish
        await this.redisService.deleteByText(`register_otp:${email}`);

        return this.generateTokens(user.id, user.email, user.role);
    }



    // **2️⃣ Login qilish**
    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email, is_deleted: false } });
        if (!user) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        const isPasswordValid = await BcryptEncryption.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        return this.generateTokens(user.id, user.email, user.role);
    }

    async loginOrganization(email: string, password: string) {
        const organization = await this.organizationRepository.findOne({ where: { email, is_deleted: false } })

        if (!organization) {
            throw new NotFoundException('Invalid password or email')
        }
        const isPasswordValid = await BcryptEncryption.compare(password, organization.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password.");
        }
        return this.generateTokens(organization.id, organization.email, 'organization')
    }

    // **3️⃣ Parolni yangilash**
    async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
        const { currentPassword, newPassword } = updatePasswordDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new UnauthorizedException("User not found.");
        }

        const isPasswordValid = await BcryptEncryption.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Current password is incorrect.");
        }

        // Generate and save the new password securely
        const hashedNewPassword = await BcryptEncryption.encrypt(newPassword);
        user.password = hashedNewPassword;
        await this.userRepository.save(user);

        return { message: "Password updated successfully." };
    }

    // **4️⃣ Parolni tiklash – Email yuborish**
    async forgotPassword(email: string) {
        const user = await this.userRepository.findOne({ where: { email, is_deleted: false } });
        if (!user) {
            throw new NotFoundException("User with this email not found.");
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP in Redis with 10-minute TTL
        await this.redisService.set(`reset_otp:${email}`, otp, 600); // 10 minutes

        // Generate a temporary reset token for password update (valid for 10 minutes)
        const resetToken = this.jwtService.sign({ email }, {
            secret: config.ACCESS_TOKEN_SECRET_KEY,
            expiresIn: '10m',
        });

        // Send OTP via email
        await this.customMailerService.sendPasswordResetEmail(email, otp);

        return {
            message: "OTP sent to email.",
            resetToken, // Send the resetToken to the user
        };
    }

    // **5️⃣ Parolni tiklash – Yangi parol o‘rnatish (OTP orqali)**
    async resetPassword(resetToken: string, otp: string) {
        try {
            // Verify the reset token
            const payload = this.jwtService.verify(resetToken, {
                secret: config.ACCESS_TOKEN_SECRET_KEY,
            });
            // Validate OTP
            const savedOtp = await this.redisService.get(`reset_otp:${payload.email}`);

            if (!savedOtp) {
                throw new UnauthorizedException("OTP has expired or is invalid.");
            }

            if (savedOtp !== otp) {
                throw new UnauthorizedException("Invalid OTP.");
            }

            // Find the user by email
            const user = await this.userRepository.findOne({ where: { email: payload.email, is_deleted: false } });
            if (!user) {
                throw new NotFoundException("User not found.");
            }

            // Generate a new password reset token (valid for a short period of time)
            const newPasswordToken = this.jwtService.sign({ email: payload.email, password: user.password }, {
                secret: config.ACCESS_TOKEN_SECRET_KEY,
                expiresIn: '10m', // This token will be used to verify the new password
            });

            return {
                message: "OTP verified successfully. Now, you can update your password.",
                newPasswordToken, // Send the new password token to the user
            };
        } catch (error) {
            throw new UnauthorizedException("Invalid reset token.");
        }
    }

    // **6️⃣ Parolni yangilash**
    async updatePasswordWithToken(resetPasswordDto: ResetPasswordWithTokenDto) {
        try {
            // Verify the new password token
            console.log(resetPasswordDto.resetToken)
            const payload = this.jwtService.verify(resetPasswordDto.resetToken, {
                secret: config.ACCESS_TOKEN_SECRET_KEY,
            });


            // Find the user by email
            const user = await this.userRepository.findOne({ where: { email: payload.email, is_deleted: false, password: payload.password } });
            if (!user) {
                throw new NotFoundException("User not found.");
            }

            // Encrypt the new password
            user.password = await BcryptEncryption.encrypt(resetPasswordDto.newPassword);
            await this.userRepository.save(user);

            // Delete OTP from Redis after use (Optional)
            await this.redisService.deleteByText(`reset_otp:${payload.email}`);

            return { message: "Password updated successfully." };
        } catch (error) {
            throw new UnauthorizedException("Invalid password update token.");
        }
    }

    async refreshToken(refreshToken: string) {
        try {
            // Verify refresh token
            const payload = this.jwtService.verify(refreshToken, {
                secret: config.REFRESH_TOKEN_SECRET_KEY,
            });

            // Check if the refresh token exists in Redis
            const savedToken = await this.redisService.get(`refresh_token:${payload.id}`);
            if (!savedToken || savedToken !== refreshToken) {
                throw new UnauthorizedException("Invalid refresh token.");
            }

            // Find the user by ID
            const user = await this.userRepository.findOne({ where: { id: payload.id, is_deleted: false } });
            if (!user) {
                throw new UnauthorizedException("User not found.");
            }

            // Generate new access and refresh tokens
            const tokens = await this.generateTokens(user.id, user.email, user.role);

            // Save the new refresh token in Redis
            await this.redisService.set(`refresh_token:${user.id}`, tokens.refreshToken, 604800); // 7 days

            return tokens;
        } catch (error) {
            throw new UnauthorizedException("Invalid refresh token.");
        }
    }

    // **7️⃣ Access va refresh token yaratish**
    private async generateTokens(userId: string, email: string, role: string) {
        const payload = { id: userId, email, role };

        const accessToken = this.jwtService.sign(payload, {
            secret: config.ACCESS_TOKEN_SECRET_KEY,
            expiresIn: config.ACCESS_TOKEN_EXPIRED_TIME,
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: config.REFRESH_TOKEN_SECRET_KEY,
            expiresIn: config.REFRESH_TOKEN_EXPIRED_TIME,
        });

        // Save the refresh token in Redis with a 7-day TTL
        await this.redisService.set(`refresh_token:${userId}`, refreshToken, 604800); // 7 days

        return {
            accessToken,
            refreshToken,
        };
    }
}
