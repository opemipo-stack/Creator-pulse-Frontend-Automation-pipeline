import { ScrapedPost } from './types';

interface YoutubeConfig {
  apiKey: string;
}

interface YoutubeSearchResult {
  id: { videoId: string; channelId: string };
  snippet: {
    publishedAt: string;
    channelTitle: string;
    title: string;
    description: string;
  };
}

interface YoutubeSearchResponse {
  items: YoutubeSearchResult[];
}

interface YoutubeVideoStats {
  statistics: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
}


// interface YoutubeVideoStats {
//   viewCount: string;
//   likeCount?: string;
//   commentCount?: string;
// }




class YoutubeScraper {
  private config: YoutubeConfig;

  constructor(config: YoutubeConfig) {
    this.config = config;
  }

  async searchVideos(query: string, limit: number = 50): Promise<ScrapedPost[]> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&order=date&maxResults=${Math.min(limit, 50)}&key=${this.config.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = (await response.json()) as YoutubeSearchResponse;

    const posts: ScrapedPost[] = [];

    for (const item of data.items.slice(0, limit)) {
      const videoId = item.id.videoId;

      try {
        const statsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${this.config.apiKey}`
        );

        // let stats = { viewCount: '0', likeCount: '0', commentCount: '0' };
        let stats: YoutubeVideoStats["statistics"] = {
            viewCount: "0",
            likeCount: "0",
            commentCount: "0",
          };

        if (statsResponse.ok) {
          const statsData = (await statsResponse.json()) as {
            items: YoutubeVideoStats[];
          };
          if (statsData.items[0]) {
            stats = statsData.items[0].statistics;
          }

        }

        posts.push({
          id: videoId,
          platform: 'youtube' as const,
          creator_handle: item.snippet.channelTitle,
          content: `${item.snippet.title}\n\n${item.snippet.description}`,
          post_link: `https://youtube.com/watch?v=${videoId}`,
          timestamp: item.snippet.publishedAt,
          engagement: {
            likes: parseInt(stats.likeCount || '0'),
            comments: parseInt(stats.commentCount || '0'),
          },
        });
      } catch {
        posts.push({
          id: videoId,
          platform: 'youtube' as const,
          creator_handle: item.snippet.channelTitle,
          content: `${item.snippet.title}\n\n${item.snippet.description}`,
          post_link: `https://youtube.com/watch?v=${videoId}`,
          timestamp: item.snippet.publishedAt,
        });
      }
    }

    return posts;
  }
}

export { YoutubeScraper, type YoutubeConfig };
