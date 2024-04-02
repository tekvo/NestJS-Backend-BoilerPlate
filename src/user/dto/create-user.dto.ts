import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) for sending a forgot password email.
 *
 * @class
 */
export class SendMailForgotPasswordDto {
  @ApiProperty({
    type: String,
    example: 'test@gmail.com',
    description: 'This email is used for sending the reset password mail',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}

/**
 *
 * @this is only for comments.
 * @dto LoginDto
 * @description This Dto for login user.
 *
 */
export class LoginDto {
  @ApiProperty({
    type: String,
    example: 'email@email.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'Macc@##1234',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({
    type: String,
    example: 'token',
    description: 'captcha token',
  })
  @IsNotEmpty()
  @IsString()
  captchaToken: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) for changing the user's password.
 *
 * @class
 */
export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    example: 'Macc@##1234',
    description: 'This is the current password',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    type: String,
    example: 'Mvinod@1234',
    description:
      'A strong password between 8 and 20 characters that includes at least one uppercase letter, one lowercase letter, and one number or special character.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

/**
 * Data Transfer Object (DTO) for resetting the user's forgotten password.
 *
 * @class
 */
export class ForgotPasswordDto {
  @ApiProperty({
    type: String,
    example: 'Mvinod@1234',
    description:
      'A strong password between 8 and 20 characters that includes at least one uppercase letter, one lowercase letter, and one number or special character.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}
