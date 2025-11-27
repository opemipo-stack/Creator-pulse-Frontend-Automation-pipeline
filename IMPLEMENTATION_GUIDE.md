# Creator Pulse - Implementation Guide

Technical documentation for developers building on Creator Pulse.

## System Architecture

### Frontend (React + TypeScript)

**Stack:**
- React 18.3 with TypeScript
- Vite for bundling
- Tailwind CSS for styling
- Lucide React for icons

**Key Components:**
- `ScraperDashboard`: Main controller and UI orchestration
- `InsightsSummary`: Executive summary display
- `ThemesSection`: Trending themes with expandable details
- `EngagementTargets`: Creator engagement recommendations

### Backend (Your Vercel Deployment)

**API Endpoint:** `POST /api/analyze`

**Request:**
```json
{
  "posts": "Raw text of all scraped posts concatenated"
}
```

**Response:**
```json
{
  "executive_summary": {
    "key_topics": ["string"],
    "weekly_angle": "string",
    "top_engagement_opportunities": ["string"]
  },
  "themes": [
    {
      "theme": "string",
      "whats_happening": "string",
      "rising_keywords": ["string"],
      "content_hooks": ["string"],
      "ctas": ["string"]
    }
  ],
  "engagement_targets": [
    {
      "creator_handle": "string",
      "platform": "string",
      "post_link": "string",
      "summary": "string",
      "recommended_engagement": "string",
      "pain_point_match": "string"
    }
  ]
}
```

---

## Scraper Implementation Details

### ScrapedPost Type

```typescript
interface ScrapedPost {
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
```

### Adding a New Platform

**Steps:**

1. **Create scraper file** `src/lib/scrapers/[platform].ts`:

```typescript
import { ScrapedPost } from './types';

interface PlatformConfig {
  // Your API credentials
  apiKey: string;
}

class PlatformScraper {
  private config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  async searchPosts(query: string, limit: number = 50): Promise<ScrapedPost[]> {
    // Implement your scraping logic
    // Return array of ScrapedPost objects
    return [];
  }
}

export { PlatformScraper, type PlatformConfig };
```

2. **Export from index** `src/lib/scrapers/index.ts`:

```typescript
export { PlatformScraper, type PlatformConfig } from './[platform]';
```

3. **Add to dashboard** `src/components/ScraperDashboard.tsx`:

```typescript
// In state
const [config, setConfig] = useState({
  // ... existing
  platformApiKey: localStorage.getItem('platformApiKey') || '',
});

// In handleScrapeAndAnalyze
if (config.platformApiKey) {
  try {
    const platformScraper = new PlatformScraper({
      apiKey: config.platformApiKey,
    });
    const posts = await platformScraper.searchPosts(config.searchQuery, 20);
    allPosts.push(...posts);
    setSuccess((prev) => (prev || '') + (prev ? ' • ' : '') + `Platform: ${posts.length} posts`);
  } catch (err) {
    setError((prev) => (prev || '') + (prev ? ' • ' : '') + `Platform error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

// In settings form
<div className="border-t border-gray-200 pt-4">
  <h3 className="font-semibold text-gray-900 mb-3">Platform Configuration</h3>
  <input
    type="password"
    value={config.platformApiKey}
    onChange={(e) => handleConfigChange('platformApiKey', e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    placeholder="Your API key"
  />
</div>
```

---

## API Integration Details

### AnalysisApiClient

Located in `src/lib/api.ts`

```typescript
const apiClient = new AnalysisApiClient({
  backendUrl: 'http://localhost:3000'
});

const result = await apiClient.analyzePosts(scrapedPosts);
```

**Error Handling:**
- Network errors throw with message
- API errors include backend error message
- Response validation is minimal (assumes backend returns correct structure)

### Extending the API Client

To add new endpoints:

```typescript
async getInsightHistory(): Promise<AnalysisResult[]> {
  const response = await fetch(`${this.config.backendUrl}/api/history`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
```

---

## Data Flow

### Complete Flow Diagram

```
User clicks "Start Analysis"
    ↓
ScraperDashboard.handleScrapeAndAnalyze()
    ↓
For each enabled platform:
  - Create scraper instance
  - Call searchPosts(query, limit)
  ↓
Collect all ScrapedPost[] from all platforms
    ↓
Format posts as text:
  "[PLATFORM] creator_handle\ncontent\nLink: url\n---"
    ↓
AnalysisApiClient.analyzePosts(posts)
    ↓
POST to /api/analyze with text
    ↓
Backend:
  - Sends to OpenAI with system prompt
  - Parses JSON response
  - Returns AnalysisResult
    ↓
setAnalysis(result)
    ↓
UI updates:
  - InsightsSummary renders executive_summary
  - ThemesSection renders themes[]
  - EngagementTargets renders engagement_targets[]
```

---

## State Management

### ScraperDashboard State

```typescript
const [loading, setLoading] = useState(false);          // Request in progress
const [error, setError] = useState<string | null>(null); // Error messages
const [success, setSuccess] = useState<string | null>(null); // Success messages
const [analysis, setAnalysis] = useState<AnalysisResult | null>(null); // Results
const [showSettings, setShowSettings] = useState(false); // Settings panel toggle
const [showApiKeys, setShowApiKeys] = useState(false);  // API key visibility
const [config, setConfig] = useState({ /* ... */ });   // API credentials
```

**LocalStorage:**
- All config values saved to localStorage for persistence
- Retrieved on component mount
- Updated via `handleConfigChange()`

---

## Performance Optimization

### Current Optimizations

1. **Parallel requests**: All scrapers run simultaneously
2. **Lazy imports**: Components lazy loaded via React
3. **CSS optimization**: Tailwind purges unused styles in build

### Potential Improvements

**Caching:**
```typescript
const cache = new Map<string, AnalysisResult>();

async analyzePosts(posts: ScrapedPost[]): Promise<AnalysisResult> {
  const cacheKey = posts.map(p => p.id).sort().join(',');

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const result = await apiClient.analyzePosts(posts);
  cache.set(cacheKey, result);
  return result;
}
```

**Debouncing search:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useMemo(
  () => debounce((q: string) => handleSearch(q), 500),
  []
);

const handleSearchChange = (q: string) => {
  setSearchQuery(q);
  debouncedSearch(q);
};
```

---

## Error Handling Strategy

### Current Approach

1. **Platform-level errors**: Caught individually, don't stop other platforms
2. **API errors**: Formatted with backend error message if available
3. **User feedback**: Combined error/success messages displayed
4. **Graceful degradation**: Analysis proceeds with available data

### Error Types

```typescript
// Platform unavailable
// → Skip and continue with others

// Network timeout
// → Display timeout message

// Invalid credentials
// → Display auth error message

// No posts found
// → Display "No posts collected" error

// Backend error
// → Display OpenAI error or backend error
```

---

## Testing

### Unit Test Example

```typescript
import { RedditScraper } from '../src/lib/scrapers/reddit';

describe('RedditScraper', () => {
  it('should fetch and transform posts', async () => {
    const scraper = new RedditScraper({
      clientId: 'test-id',
      clientSecret: 'test-secret',
      username: 'test-user',
      password: 'test-pass',
    });

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: {
            children: [
              {
                data: {
                  id: 'test-id',
                  author: 'test-author',
                  title: 'Test Title',
                  selftext: 'Test content',
                  // ... other fields
                },
              },
            ],
          },
        }),
      })
    );

    const posts = await scraper.searchPosts('test', 10);
    expect(posts).toHaveLength(1);
    expect(posts[0].platform).toBe('reddit');
  });
});
```

---

## Deployment

### To Vercel

```bash
# 1. Build locally
npm run build

# 2. Deploy (requires Vercel CLI)
vercel

# 3. Set environment variable if using custom backend URL
vercel env add VITE_BACKEND_URL https://your-backend.vercel.app
```

### To GitHub Pages

```bash
# 1. Update vite.config.ts
export default defineConfig({
  base: '/repository-name/',
  // ...
});

# 2. Build
npm run build

# 3. Deploy contents of dist/ folder
```

---

## Configuration

### Customizing System Prompt

Edit your backend's `api/analyze.ts`:

```typescript
const SYSTEM_PROMPT = `You are Creator Pulse, an AI that...

Return ONLY valid JSON using the following structure:
// ... rest of prompt
`;
```

### Changing Search Limits

In `ScraperDashboard.tsx`:

```typescript
// Change default limits per platform
const ytPosts = await ytScraper.searchVideos(config.searchQuery, 50); // was 20
const redditPosts = await redditScraper.searchPosts(config.searchQuery, 50); // was 20
```

### Styling Customization

All components use Tailwind classes. Modify `src/index.css` for global styles or component files for specific styles.

---

## Debugging

### Enable Logging

Add to `ScraperDashboard.tsx`:

```typescript
console.log('Starting scrape with config:', config);
console.log('Collected posts:', allPosts);
console.log('Sending to backend:', postsText);
console.log('Analysis result:', result);
```

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Start Analysis"
4. Check requests to:
   - `api.reddit.com`
   - `www.googleapis.com`
   - `graph.facebook.com`
   - Your backend URL

### Validate JSON Response

Backend should return valid JSON matching AnalysisResult interface. Test with:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"posts":"test post from test creator"}'
```

---

## Common Modifications

### Add Custom Analysis View

1. Create new component: `src/components/CustomAnalysis.tsx`
2. Accept `analysis: AnalysisResult` as prop
3. Import and render in `ScraperDashboard.tsx`

### Add Data Export

```typescript
const handleExportJSON = () => {
  const json = JSON.stringify(analysis, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analysis-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};
```

### Add CSV Export

```typescript
const handleExportCSV = () => {
  const rows = analysis.engagement_targets.map(t => [
    t.creator_handle,
    t.platform,
    t.summary,
    t.recommended_engagement,
  ]);
  const csv = [
    ['Handle', 'Platform', 'Summary', 'Engagement'].join(','),
    ...rows.map(r => r.map(c => `"${c}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `targets-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};
```

---

## Troubleshooting Development

### "Cannot find module" errors

Check that:
1. File exists in the path
2. Export statement is correct
3. Import path is correct (no typos)

### Styles not applying

Check:
1. Tailwind classes are spelled correctly
2. CSS file is imported in `main.tsx`
3. Vite is running (dev server)

### API not responding

Check:
1. Backend is running/deployed
2. VITE_BACKEND_URL is correct
3. Backend `/api/analyze` endpoint exists
4. OpenAI API key configured in backend

---

## Resources

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Contributing

To contribute improvements:

1. Create feature branch
2. Test thoroughly (all platforms if possible)
3. Update this documentation
4. Submit pull request

---

Last Updated: 2024
