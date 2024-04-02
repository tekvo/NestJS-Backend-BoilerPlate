import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionModule } from 'src/session/session.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google-auth.strategy';
import { FailedLoginAttemptModule } from 'src/failed-login-attempt/failed-login-attempt.module';

@Module({
  imports: [SessionModule, FailedLoginAttemptModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, GoogleStrategy],
})
export class AuthModule {}
