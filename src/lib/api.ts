import { ScrapedPost, AnalysisResult } from './scrapers';

interface AnalysisApiConfig {
  backendUrl: string;
}

class AnalysisApiClient {
  private config: AnalysisApiConfig;

  constructor(config: AnalysisApiConfig) {
    this.config = config;
  }

  async analyzePosts(posts: ScrapedPost[]): Promise<AnalysisResult> {
    if (!posts.length) {
      throw new Error('No posts to analyze');
    }

    const postsText = posts
      .map(
        (post) =>
          `[${post.platform.toUpperCase()}] ${post.creator_handle}\n${post.content}\nLink: ${post.post_link}\n---`
      )
      .join('\n\n');

    const response = await fetch(`${this.config.backendUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        posts: postsText,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Analysis API error: ${error.error || response.statusText}`
      );
    }

    return response.json() as Promise<AnalysisResult>;
  }
}

export { AnalysisApiClient, type AnalysisApiConfig };
