import { INestApplication, Logger } from "@nestjs/common";

export function gracefulShutdown(app: INestApplication) {
  const logger = new Logger(gracefulShutdown.name);

  // Listen for termination signals
  process.on("SIGINT", () => {
    logger.log("Received SIGINT signal. Closing server...");
    shutdown();
  });

  process.on("SIGTERM", () => {
    logger.log("Received SIGTERM signal. Closing server...");
    shutdown();
  });

  // Function to gracefully shut down the server
  async function shutdown() {
    try {
      // Close the Nest.js app gracefully
      await app.close();
      logger.log("Nest.js app closed gracefully.");

      // Close the server gracefully
      process.exit(1);
    } catch (err) {
      logger.error(`Error during graceful shutdown: ${err}`);
      process.exit(1);
    }
  }
}
