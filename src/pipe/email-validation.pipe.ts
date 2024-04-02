import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../constant/enum';
import { STATUS_MSG } from '../constant/status-message.constants';
import { isValidEmail } from 'src/utils/utils';

@Injectable()
export class EmailValidationPipe implements PipeTransform<string, string> {
  constructor(private configService: ConfigService) {} // Inject ConfigService

  transform(value: any): string {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === Environment.Production;
    if (isProduction) {
      const validateEmail = isValidEmail(value.email);
      if (!validateEmail) {
        console.log('Invalid email address');
        throw new BadRequestException(STATUS_MSG.ERROR.INVALID_EMAIL);
      }
    }
    return value;
  }
}
