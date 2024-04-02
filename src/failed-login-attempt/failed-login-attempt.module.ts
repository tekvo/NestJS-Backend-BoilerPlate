import { Module } from '@nestjs/common';
import { FailedLoginAttemptService } from './failed-login-attempt.service';
import { FailedLoginAttemptController } from './failed-login-attempt.controller';

@Module({
  controllers: [FailedLoginAttemptController],
  providers: [FailedLoginAttemptService],
  exports: [FailedLoginAttemptService],
})
export class FailedLoginAttemptModule {}
