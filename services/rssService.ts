import { XMLParser } from 'fast-xml-parser';
import { NewsArticle, RssFeed } from '@/types/news';
import { nanoid } from '@reduxjs/toolkit';

interface RssItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  'dc:date'?: string;
  'content:encoded'?: string;
  media?: {
    $: {
      url: string;
    };
  };
  'media:content'?: {
    '@_url'?: string;
    '@_type'?: string;
    $?: {
      url?: string;
    };
  } | Array<{
    '@_url'?: string;
    '@_type'?: string;
    $?: {
      url?: string;
    };
  }>;
  'media:thumbnail'?: {
    '@_url'?: string;
    $?: {
      url?: string;
    };
  };
  enclosure?: {
    '@_url'?: string;
    '@_type'?: string;
    '@_length'?: string;
  } | Array<{
    '@_url'?: string;
    '@_type'?: string;
    '@_length'?: string;
  }>;
  image?: {
    url?: string;
  };
}

interface RssChannel {
  title?: string;
  item?: RssItem | RssItem[];
  entry?: RssItem | RssItem[];
}

interface RssResponse {
  rss?: {
    channel?: RssChannel;
  };
  feed?: RssChannel;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '$text',
  ignoreDeclaration: true,
  parseAttributeValue: true,
  allowBooleanAttributes: true,
});

// Add a feed-specific image extraction configuration
const feedImageExtractors = {
  'haarlemupdates.nl': (item: RssItem): string | undefined => {
    // WordPress specific image extraction
    if (item['content:encoded']) {
      const wpImageMatch = item['content:encoded'].match(/<img[^>]+src="([^"]+)"/i);
      if (wpImageMatch?.[1]) return wpImageMatch[1];
    }
    return undefined;
  },
  'omroepflevoland.nl': (item: RssItem): string | undefined => {
    // Flevoland specific image extraction
    if (item.image) return typeof item.image === 'string' ? item.image : item.image.url;
    return undefined;
  }
};

function extractImageUrl(item: RssItem, feedUrl: string): string | undefined {
  // Try feed-specific extractor first
  for (const [domain, extractor] of Object.entries(feedImageExtractors)) {
    if (feedUrl.includes(domain)) {
      const image = extractor(item);
      if (image) return image;
    }
  }

  // Handle enclosure
  if (item.enclosure) {
    if (Array.isArray(item.enclosure)) {
      const imageEnclosure = item.enclosure.find(enc => 
        enc['@_type']?.startsWith('image/') || 
        enc['@_url']?.match(/\.(jpg|jpeg|png|gif|webp)/i)
      );
      return imageEnclosure?.['@_url'];
    } else {
      return item.enclosure['@_url'];
    }
  }

  return undefined;
}

function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#39;': "'",
    '&#8211;': '–',
    '&#8212;': '—',
    '&ndash;': '–',
    '&mdash;': '—',
    '&nbsp;': ' '
  };
  
  return text.replace(/&[#\w]+;/g, entity => 
    entities[entity] || entity
  );
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok && retries > 0) {
      if ([503, 429, 502, 504].includes(response.status)) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, options, retries - 1);
      }
    }
    
    return response;
  } catch (error) {
    if (retries > 0 && error instanceof TypeError) { // Network errors
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

const isDevelopment = process.env.NODE_ENV === 'development';

function log(message: string, data?: any) {
  if (isDevelopment) {
    console.log(message, data ? data : '');
  }
}

function logError(message: string, error?: any) {
  if (isDevelopment) {
    console.error(message, error || '');
  } else {
    console.error(message);
  }
}

export async function fetchRssFeed(feed: RssFeed): Promise<NewsArticle[]> {
  try {
    log(`Fetching RSS feed: ${feed.name} (${feed.url})`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetchWithRetry(feed.url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; NewsApp/1.0;)'
      },
      signal: controller.signal // Use AbortController instead of timeout
    });

    clearTimeout(timeoutId); // Clear the timeout if fetch succeeds

    if (response.status === 503) {
      log(`Service unavailable for ${feed.name}, retrying...`);
      // Wait 1 second and retry once
      await new Promise(resolve => setTimeout(resolve, 1000));
      const retryResponse = await fetchWithRetry(feed.url, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          'User-Agent': 'Mozilla/5.0 (compatible; NewsApp/1.0;)'
        }
      });
      if (!retryResponse.ok) {
        logError(`Failed to fetch ${feed.name} after retry: ${retryResponse.status}`, retryResponse);
        return [];
      }
      return parseRssFeed(await retryResponse.text(), feed);
    }

    if (!response.ok) {
      logError(`HTTP error! status: ${response.status} for ${feed.name}`, response);
      return [];
    }

    const xmlText = await response.text();
    log(`Successfully fetched ${feed.name}, parsing XML...`);
    return parseRssFeed(xmlText, feed);
  } catch (error) {
    logError(`Error fetching RSS feed ${feed.url}:`, error);
    return [];
  }
}

interface ValidatedRssItem extends RssItem {
  title: string;      // Make required
  link: string;       // Make required
  description: string; // Make required
}

function validateRssItem(item: RssItem): item is ValidatedRssItem {
  return (
    typeof item.title === 'string' &&
    typeof item.link === 'string' &&
    typeof item.description === 'string'
  );
}

function parseRssFeed(xmlText: string, feed: RssFeed): NewsArticle[] {
  try {
    const result = parser.parse(xmlText) as RssResponse;
    const channel = result.rss?.channel || result.feed;
    
    if (!channel?.item) {
      logError('Invalid feed structure', { feed: feed.url });
      return [];
    }

    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    
    return items
      .filter(validateRssItem)
      .map(item => ({
        id: nanoid(),
        title: decodeHtmlEntities(item.title),
        description: decodeHtmlEntities(item.description.replace(/<[^>]*>/g, '')),
        url: item.link,
        imageUrl: extractImageUrl(item, feed.url),
        category: feed.name,
        source: feed.name,
        publishedAt: item.pubDate ?? item['dc:date'] ?? new Date().toISOString(),
      }));
  } catch (error) {
    logError(`Error parsing RSS feed: ${feed.url}`, error);
    return [];
  }
} 