import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

/**
 * This is a Nest middleware class that checks the headers of incoming requests to ensure they are valid.
 * Specifically, it checks if the content-type header is application/json for POST, PUT, and PATCH requests (excluding multipart/form-data), and if the accept header is application/json for GET requests.
 * If the headers are invalid, the middleware responds with an appropriate HTTP status code and error message. Otherwise,
 * it allows the request to pass through to the next middleware or handler function. The middleware also logs any errors using the Logger class provided by Nest.
 */
@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Create a new logger instance
    const logger = new Logger("HeaderMiddleware");

    // Check if the request is a POST, PUT, or PATCH, and if the content type is not JSON or multipart/form-data
    if (
      (req.method === "POST" ||
        req.method === "PUT" ||
        req.method === "PATCH") &&
      req.headers["content-type"] !== "application/json" &&
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      // Log an error message
      logger.error(
        `This ${req.method} request was rejected because content-type header was either invalid or not provided`,
      );

      // Set the content type header to JSON and send a 415 error response
      res.setHeader("content-type", "application/json");
      res.status(415).send();
    }
    // Check if the request is a GET, and if the accept header is not JSON
    else if (
      req.method === "GET" &&
      req.headers["accept"] !== "application/json"
    ) {
      // Log an error message
      logger.error(
        `This ${req.method} request was rejected because accept header was either invalid or not provided`,
      );

      // Set the accept header to JSON and send a 406 error response
      res.setHeader("accept", "application/json");
      res.status(406).send();
    } else {
      // If the request is valid, call the next middleware
      next();
    }
  }
}
