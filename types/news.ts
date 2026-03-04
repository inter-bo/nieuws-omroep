export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  source: string;
  url: string;
  publishedAt: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  feeds: RssFeed[];
}

export interface RssFeed {
  id: string;
  url: string;
  name: string;
  enabled: boolean;
} 