import fs from 'fs';
import YAML from 'yaml';

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface MailConfig {
  smtp: SMTPConfig;
  from: string;
  to: string[];
}

export interface Subscription {
  name: string;
  url: string;
  lastUpdated?: string; 
}

export interface AppConfig {
  mail: MailConfig;
  logLevel: string;
  updateInterval: number; // 毫秒
  subscriptions: Subscription[];
}

export function loadConfig(filePath: string = "./config.yml"): AppConfig {
  const file = fs.readFileSync(filePath, "utf8");
  const config: AppConfig = YAML.parse(file);
  return config;
}
