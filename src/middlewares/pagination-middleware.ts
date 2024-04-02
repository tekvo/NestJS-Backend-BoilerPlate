import { Injectable, NestMiddleware } from "@nestjs/common";

/**
 * This middleware sets up pagination parameters for the incoming request. It parses the "limit" and "page" query parameters, and sets them to default values if they are not present in the request
 * It also sets the "routePath" property of the request object to the current route's path. This middleware does not modify the response or terminate the request.
 */
@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    req.query.limit = req?.query.limit || 10;
    req.query.page = req?.query.page || 1;
    // req.query.routePath = req.route?.path;
    next();
  }
}
