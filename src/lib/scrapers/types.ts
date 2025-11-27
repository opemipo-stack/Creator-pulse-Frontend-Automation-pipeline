export interface ScrapedPost {
  id: string;
  platform: 'reddit' | 'youtube' | 'facebook';
  creator_handle: string;
  content: string;
  post_link: string;
  timestamp: string;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

export interface AnalysisResult {
  executive_summary: {
    key_topics: string[];
    weekly_angle: string;
    top_engagement_opportunities: string[];
  };
  themes: Array<{
    theme: string;
    whats_happening: string;
    rising_keywords: string[];
    content_hooks: string[];
    ctas: string[];
  }>;
  engagement_targets: Array<{
    creator_handle: string;
    platform: string;
    post_link: string;
    summary: string;
    recommended_engagement: string;
    pain_point_match: string;
  }>;
}
