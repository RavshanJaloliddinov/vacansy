import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ForgotPasswordDto, ResetPasswordDto, ResetPasswordWithTokenDto, UpdatePasswordDto } from "./dto/update-password.dto";
import { JwtAuthGuard } from "./users/AuthGuard";
import { Public } from "src/common/decorator/public";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // **1️⃣ Foydalanuvchini ro‘yxatdan o‘tkazish**
    @Post("register")
    @Public()
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: "User registered successfully." })
    @ApiResponse({ status: 400, description: "Bad Request." })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // **2️⃣ Login qilish**
    @Post("login")
    @Public()
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: "Login successful." })
    @ApiResponse({ status: 401, description: "Unauthorized." })
    async login(@Body() { email, password }: LoginDto) {
        return this.authService.login(email, password);
    }

    @Post("login-organization")
    @Public()
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: "Login successful." })
    @ApiResponse({ status: 401, description: "Unauthorized." })
    async loginOrganization(@Body() { email, password }: LoginDto) {
        return this.authService.loginOrganization(email, password);
    }

    // **3️⃣ Refresh token orqali yangi access token olish**
    @Post("refresh")
    @Public()
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 200, description: "Access token refreshed successfully." })
    @ApiResponse({ status: 401, description: "Invalid refresh token." })
    async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
        return this.authService.refreshToken(refreshToken);
    }
    // **6️⃣ Parolni yangilash**
    @Put("update-password")
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard) // Token orqali foydalanuvchini aniqlash
    @ApiBody({ type: UpdatePasswordDto })
    @ApiResponse({ status: 200, description: "Password updated successfully." })
    @ApiResponse({ status: 401, description: "Current password is incorrect." })
    async updatePassword(@Req() req, @Body() updatePasswordDto: UpdatePasswordDto) {
        const userId = req.user.id;  // Token orqali foydalanuvchi ID'sini olish
        return this.authService.updatePassword(userId, updatePasswordDto);
    }
    // **4️⃣ Parolni tiklash uchun OTP yuborish**
    @Post("forgot-password")
    @Public()
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({ status: 200, description: "OTP sent to email." })
    @ApiResponse({ status: 404, description: "User not found." })
    async forgotPassword(@Body() { email }: ForgotPasswordDto) {
        return this.authService.forgotPassword(email);
    }

    // **5️⃣ OTP orqali parolni tiklash**
    @Put("reset-password")
    @Public()
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({ status: 200, description: "Password reset successfully." })
    @ApiResponse({ status: 401, description: "Invalid OTP." })
    @ApiResponse({ status: 400, description: "Invalid or expired reset token." })
    async resetPassword(@Body() { otp, resetToken }: ResetPasswordDto) {
        return this.authService.resetPassword(resetToken, otp);
    }



    @Put("update-password-with-token")
    @Public()
    @ApiBody({
        description: "Update password using the reset token",
        type: ResetPasswordWithTokenDto,
    })
    @ApiResponse({ status: 200, description: "Password updated successfully." })
    @ApiResponse({ status: 401, description: "Invalid password update token." })
    async updatePasswordWithToken(@Body() resetPasswordDto: ResetPasswordWithTokenDto) {
        return this.authService.updatePasswordWithToken(resetPasswordDto);
    }
}
