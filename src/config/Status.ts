import fs from "fs";
import YAML from "yaml";
import { type Subscription } from "./Config";

export interface SubscriptionStatus {
  [name: string]: {
    lastUpdated?: string;
  };
}

const STATUS_FILE = "./status.yml";

export function loadStatus(): SubscriptionStatus {
  if (!fs.existsSync(STATUS_FILE)) {
    return {};
  }
  const file = fs.readFileSync(STATUS_FILE, "utf8");
  const data = YAML.parse(file);
  return data || {};
}

export function saveStatus(status: SubscriptionStatus): void {
  const yamlStr = YAML.stringify(status);
  fs.writeFileSync(STATUS_FILE, yamlStr, "utf8");
}

export function updateStatus(subscription: Subscription) {
  const status = loadStatus();
  status[subscription.name] = {
    lastUpdated: subscription.lastUpdated,
  };
  saveStatus(status);
}
