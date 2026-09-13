export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: number;
}

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  writer?: (entry: LogEntry) => void;
}

export class MahivaLogger {
  private readonly level: LogLevel;
  private readonly prefix?: string;
  private readonly writer?: (entry: LogEntry) => void;

  public constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? "info";
    this.prefix = options.prefix;
    this.writer = options.writer;
  }

  public debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  public error(message: string, context?: LogContext): void {
    this.log("error", message, context);
  }

  public log(level: LogLevel, message: string, context?: LogContext): void {
    const levels: Record<LogLevel, number> = {
      debug: 10,
      info: 20,
      warn: 30,
      error: 40,
    };

    if (levels[level] < levels[this.level]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message: this.prefix ? `[${this.prefix}] ${message}` : message,
      context,
      timestamp: Date.now(),
    };

    if (this.writer) {
      this.writer(entry);
      return;
    }

    const prefix = this.prefix ? `[${this.prefix}] ` : "";
    const color = {
      debug: "\u001b[36m",
      info: "\u001b[32m",
      warn: "\u001b[33m",
      error: "\u001b[31m",
    }[level];

    const reset = "\u001b[0m";
    console.log(
      `${color}${prefix}${level.toUpperCase()}${reset} ${entry.message}`,
    );
  }
}

export function createLogger(options: LoggerOptions = {}): MahivaLogger {
  return new MahivaLogger(options);
}

export const logger = createLogger({ prefix: "mahiva" });

export const PACKAGE_NAME = "@mahiva/logger";
