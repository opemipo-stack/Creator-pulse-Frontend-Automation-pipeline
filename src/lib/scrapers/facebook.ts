import { ScrapedPost } from './types';

interface FacebookConfig {
  accessToken: string;
}

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  permalink_url: string;
  shares?: { data: unknown[]; summary: { total_count: number } };
  likes?: { data: unknown[]; summary: { total_count: number } };
  comments?: { data: unknown[]; summary: { total_count: number } };
}

interface FacebookResponse {
  data: FacebookPost[];
  paging?: {
    next: string;
  };
}

interface FacebookPageInfo {
  name: string;
}

class FacebookScraper {
  private config: FacebookConfig;

  constructor(config: FacebookConfig) {
    this.config = config;
  }

  async searchPosts(pageId: string, limit: number = 50): Promise<ScrapedPost[]> {
    try {
      const pageInfoResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=name&access_token=${this.config.accessToken}`
      );

      if (!pageInfoResponse.ok) {
        throw new Error(`Facebook API error: ${pageInfoResponse.statusText}`);
      }

      const pageInfo = (await pageInfoResponse.json()) as FacebookPageInfo;

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/posts?fields=message,story,created_time,permalink_url,shares.summary(true).limit(0),likes.summary(true).limit(0),comments.summary(true).limit(0)&limit=${limit}&access_token=${this.config.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.statusText}`);
      }

      const data = (await response.json()) as FacebookResponse;

      return data.data.map((post) => ({
        id: post.id,
        platform: 'facebook' as const,
        creator_handle: pageInfo.name,
        content: post.message || post.story || '(No text content)',
        post_link: post.permalink_url,
        timestamp: post.created_time,
        engagement: {
          likes: post.likes?.summary.total_count || 0,
          comments: post.comments?.summary.total_count || 0,
          shares: post.shares?.summary.total_count || 0,
        },
      }));
    } catch (error) {
      throw new Error(
        `Facebook scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export { FacebookScraper, type FacebookConfig };
