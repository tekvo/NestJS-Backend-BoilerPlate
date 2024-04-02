import { PartialType } from '@nestjs/swagger';
import { CreateFailedLoginAttemptDto } from './create-failed-login-attempt.dto';

export class UpdateFailedLoginAttemptDto extends PartialType(CreateFailedLoginAttemptDto) {}
