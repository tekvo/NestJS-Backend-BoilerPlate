/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Header,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { EmailValidationPipe } from 'src/pipe/email-validation.pipe';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { GoogleOauthGuard } from 'src/guard/google-auth.guard';
import {
  LoginDto,
  SendMailForgotPasswordDto,
} from 'src/user/dto/create-user.dto';

@ApiTags('auth')
@ApiHeader({ name: 'selectuserworkspacesetid', required: false })
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '**New user signup**',
    description: 'New user signup',
  })
  @UsePipes(EmailValidationPipe)
  @Public()
  @Post('/admin/signup')
  async signup(@Body() signupRequest: any): Promise<any> {
    return this.authService.signup(signupRequest);
  }

  @ApiOperation({
    summary: '**user login**',
    description: 'user login',
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req: any,
    @Body() loginRequest: LoginDto,
  ): Promise<string> {
    return this.authService.login(req);
  }

  @ApiOperation({
    summary: '**log out user.**',
    description: 'log out user.',
  })
  @ApiBearerAuth('access-token')
  @Header('Authorization', 'Bearer')
  @Post('logout')
  async logout(@Req() req: any): Promise<any> {
    return this.authService.logout(req);
  }

  @ApiOperation({
    summary: '**Logout from all device**',
    description: 'Logout from all device',
  })
  @Public()
  @ApiBearerAuth('access-token')
  @Header('Authorization', 'Bearer')
  @Post('logout/all/devices')
  async logOutFromAllDevices(@Req() req: any): Promise<any> {
    return this.authService.logoutFromAllDevices(req);
  }

  @ApiOperation({
    summary: '**user change password**',
    description: 'user change password',
  })
  @ApiBearerAuth('access-token')
  @Post('reset-password')
  async resetPassword(
    @Req() req: any,
    @Body() changePassword: any,
  ): Promise<any> {
    return this.authService.resetPassword(req, changePassword);
  }

  @ApiOperation({
    summary: '**Update forgot password**',
    description: 'Update forgot password',
  })
  @ApiBearerAuth('access-token')
  @Header('Authorization', 'Bearer')
  @Post('/update-password')
  async updatePassword(
    @Req() req: any,
    @Body() forgotPassword: any,
  ): Promise<any> {
    return this.authService.updatePassword(req, forgotPassword);
  }

  @ApiOperation({
    summary: '**Send mail for if forgot password**',
    description: 'Send mail for if forgot password',
  })
  @Public()
  @Post('send-mail/forgot-password')
  async sendForgotPasswordMail(
    @Body() sendmail: SendMailForgotPasswordDto,
  ): Promise<any> {
    return this.authService.sendForgotPasswordMail(sendmail);
  }

  @ApiOperation({
    summary: '**verify Email**',
    description: 'verify Email',
  })
  @Public()
  @ApiBearerAuth('access-token')
  @Header('Authorization', 'Bearer')
  @Patch('/email/verify')
  async verifyEmail(@Req() req: any): Promise<UpdateResult> {
    return this.authService.verifyEmail(req);
  }

  @ApiOperation({
    summary: '**User reactivate account**',
    description: 'User reactivate account',
  })
  @Public()
  @ApiBearerAuth('access-token')
  @Header('Authorization', 'Bearer')
  @Patch('user/reactivate/account')
  async reactivateAccount(@Req() req: any): Promise<UpdateResult> {
    return this.authService.reactivateAccount(req);
  }

  @ApiOperation({
    summary: '**log out user.**',
    description: 'log out user.',
  })
  @ApiBearerAuth('access-token')
  @Header('Authorization', 'Bearer')
  @Post('new/session')
  async createNewSession(@Req() req: any): Promise<string> {
    return this.authService.createNewSession(req);
  }

  @Get('auth/google')
  @Public()
  @UseGuards(GoogleOauthGuard)
  googleLogin(): void {
    console.log('googleLogin');
  }

  @UseGuards(GoogleOauthGuard)
  @Public()
  @Get('auth/google/callback')
  async googleAuthRedirect(@Req() req: any): Promise<any> {
    return this.authService.googleCallback(req);
  }
}
