import type { AppConfig, Subscription } from "../config/Config";
import { parseFeed, type FeedItem } from "../parser/feedParser";
import { Logger } from "../logger/logger";
import { sendEmail } from "../email/emailSender";
import { loadStatus, saveStatus, type SubscriptionStatus } from "../config/Status";


function getLatestDate(items: FeedItem[]): Date | null {
  const dates = items
    .map((item) => new Date(item.isoDate || item.pubDate || 0))
    .filter((d) => !isNaN(d.getTime()));
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export async function checkUpdates(config: AppConfig): Promise<void> {
  Logger.info("Checking for updates...");
  const updates: { subscription: Subscription; newItems: FeedItem[] }[] = [];

  const statuses: SubscriptionStatus = loadStatus();

  for (const sub of config.subscriptions) {
    Logger.info(`Processing subscription: ${sub.name}`);
    const feedResult = await parseFeed(sub.url);
    if (!feedResult) continue;

    let lastUpdatedDate: Date | null = null;
    if (statuses[sub.name] && statuses[sub.name].lastUpdated) {
      lastUpdatedDate = new Date(statuses[sub.name].lastUpdated as string);
    }

    const newItems = feedResult.items.filter((item) => {
      const itemDate = new Date(item.isoDate || item.pubDate || 0);
      if (!lastUpdatedDate) return true;
      return itemDate > lastUpdatedDate;
    });

    if (newItems.length > 0) {
      Logger.info(`${sub.name} has ${newItems.length} new items.`);
      const latest = getLatestDate(feedResult.items);
      if (latest) {
        sub.lastUpdated = latest.toISOString();
        statuses[sub.name] = { lastUpdated: latest.toISOString() };
      }
      updates.push({ subscription: sub, newItems });
    } else {
      Logger.info(`No new items for ${sub.name}.`);
    }
  }

  saveStatus(statuses);
  if (updates.length > 0) {
    let htmlContent = `<h2>Feed Updates Summary</h2>`;
    updates.forEach((update) => {
      htmlContent += `<div style="border:1px solid #ccc; border-radius:8px; padding:10px; margin:10px;">
        <h3>${update.subscription.name}</h3>
        <ul>`;
      update.newItems.forEach((item) => {
        htmlContent += `<li>
            <a href="${item.link || "#"}">${item.title}</a>
            <br/><small>${item.pubDate || item.isoDate || ""}</small>
          </li>`;
      });
      htmlContent += `</ul></div>`;
    });

    sendEmail(config.mail, "RSS/Atom Feed Updates", htmlContent).catch((err) => {
      Logger.error(`Error sending email: ${err}`);
    });
  } else {
    Logger.info("No updates found across subscriptions.");
  }
}
