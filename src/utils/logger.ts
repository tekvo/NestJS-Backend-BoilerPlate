import { format, transports, Logform } from "winston";
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import { LoggerService } from "@nestjs/common";

/**
 * Initialize and configure the Winston logger.
 * @returns {Logger} The configured Winston logger.
 */
export const initializeLogger = (): LoggerService => {
  /**
   * Common log format with timestamp and milliseconds.
   * @type {Logform.Format}
   */
  const commonFormat: Logform.Format = format.combine(
    format.timestamp(),
    format.ms(),
    format.errors({ stack: true }),
    nestWinstonModuleUtilities.format.nestLike(process.env.APP_NAME, {
      colors: true,
      prettyPrint: true,
    }),
    // format.json(),
  );

  /**
   * Console transport options for different log levels.
   * @type {Array<{ level: string, format: Logform.Format }>}
   */
  const consoleTransportOptions: Array<{
    level: string;
    format: Logform.Format;
  }> = [
    { level: "log", format: commonFormat },
    { level: "warn", format: commonFormat },
    {
      level: "error",
      format: format.combine(commonFormat, format.errors({ stack: true })),
    },
    { level: "debug", format: commonFormat },
  ];

  /**
   * Array of console transports based on the specified options.
   * @type {transports.Console[]}
   */
  const consoleTransports = consoleTransportOptions.map(
    (options) => new transports.Console(options),
  );

  /**
   * Configured Winston logger with console transports.
   * @type {LoggerService}
   */
  const logger: LoggerService = WinstonModule.createLogger({
    transports: consoleTransports,
  });

  return logger;
};
