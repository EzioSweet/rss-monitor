import { red, yellow, gray, blue } from "colorette";

export type LogLevel = "debug" | "info" | "warn" | "error";

export const Logger = {
  level: "info" as LogLevel,

  setLevel(level: LogLevel) {
    this.level = level;
  },

  debug(message: string) {
    if (this.level === "debug") {
      console.log(gray("[DEBUG]"), message);
    }
  },

  info(message: string) {
    if (["debug", "info"].includes(this.level)) {
      console.log(blue("[INFO]"), message);
    }
  },

  warn(message: string) {
    if (["debug", "info", "warn"].includes(this.level)) {
      console.log(yellow("[WARN]"), message);
    }
  },

  error(message: string) {
    console.log(red("[ERROR]"), message);
  },
};
