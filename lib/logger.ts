/**
 * Logger Utility.
 * Provides unified, structured logging across server and client.
 * Suppresses debug/info messages in production to maintain performance and data privacy.
 */
export class Logger {
  private static isProduction = process.env.NODE_ENV === "production";

  /**
   * Logs an info level message.
   * 
   * @param {string} message - Description of the logged event.
   * @param {any[]} optionalParams - Additional metadata to accompany the log.
   */
  static info(message: string, ...optionalParams: any[]) {
    if (!this.isProduction) {
      console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...optionalParams);
    }
  }

  /**
   * Logs a warning level message.
   * 
   * @param {string} message - Description of the warning event.
   * @param {any[]} optionalParams - Additional metadata or stacks.
   */
  static warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...optionalParams);
  }

  /**
   * Logs an error level message.
   * 
   * @param {string} message - Description of the error.
   * @param {any} error - The error object or context.
   */
  static error(message: string, error?: any) {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error || "");
  }
}
