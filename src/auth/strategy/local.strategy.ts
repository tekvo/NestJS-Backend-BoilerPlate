import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { STATUS_MSG } from '../../constant/status-message.constants';
import { Provider } from '../../constant/enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, Provider.Local) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      captchaTokenField: 'captchaToken',
    });
  }

  /**
   * @param {string} username - The username of the user attempting to login.
   * @param {string} password - The password of the user attempting to login.
   * @returns {Promise<any>} - Returns a promise that resolves to the user object if the login is successful.
   * @throws {UnauthorizedException} - Throws an UnauthorizedException if no user is found with the provided credentials.
   *
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException(STATUS_MSG.ERROR.CREATE_ACCOUNT);
    }

    return user;
  }
}
