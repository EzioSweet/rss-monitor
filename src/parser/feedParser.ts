import Parser from "rss-parser";
import { Logger } from "../logger/logger";

const parser = new Parser();

export interface FeedItem {
  title: string;
  pubDate?: string;
  isoDate?: string;
  link?: string;
  content?: string;
}

export interface FeedResult {
  title: string;
  items: FeedItem[];
}

export async function parseFeed(url: string): Promise<FeedResult | null> {
  try {
    Logger.debug(`Fetching feed from ${url}`);
    const feed = await parser.parseURL(url);
    return {
      title: feed.title || url,
      items: feed.items as FeedItem[],
    };
  } catch (err) {
    Logger.error(`Failed to parse feed ${url}: ${err}`);
    return null;
  }
}
