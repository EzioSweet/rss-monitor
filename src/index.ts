import { loadConfig } from "./config/Config";
import { Logger, type LogLevel } from "./logger/logger";
import { checkUpdates } from "./updater/updater";

function startApp() {
  const config = loadConfig();
  Logger.setLevel(config.logLevel as LogLevel);

  Logger.info("Application started.");

  checkUpdates(config);

  setInterval(() => {
    checkUpdates(config);
  }, config.updateInterval);
}

startApp();
