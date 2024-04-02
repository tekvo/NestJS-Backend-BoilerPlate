import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '../common/service/session.service';
import { STATUS_MSG } from '../constant/status-message.constants';
import { authMiddlewareSkipUrl } from '../constant/skip-url.constant';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  async use(req: any, _res: any, next: () => void) {
    // Allow access to certain routes without authentication
    req.timestamp = new Date();

    // Define a list of URLs that do not require authentication
    if (authMiddlewareSkipUrl.includes(req.baseUrl)) {
      return next();
    }

    // Check if authorization token is  not present in headers
    if (!req.headers.authorization) {
      throw new UnauthorizedException(STATUS_MSG.ERROR.UNAUTHORIZED);
    }

    // Extract token from headers
    const token = req.headers.authorization.split(' ')[1];

    // Find session associated with token
    const session = await this.sessionService.findToken(token);

    // Check if session exists
    if (!session) {
      throw new UnauthorizedException(STATUS_MSG.ERROR.UNAUTHORIZED);
    }

    // Proceed to next middleware
    return next();
  }
}
