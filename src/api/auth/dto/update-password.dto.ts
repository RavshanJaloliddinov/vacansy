import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    currentPassword: string;

    @IsString()
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    newPassword: string;
}


export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}


export class ResetPasswordDto {
    @IsString()
    otp: string;  // OTP kodini kiritish

    @IsString()
    @MinLength(6)
    newPassword: string;  // Yangi parol

    @IsEmail()
    email: string;  // Foydalanuvchi emaili
}
