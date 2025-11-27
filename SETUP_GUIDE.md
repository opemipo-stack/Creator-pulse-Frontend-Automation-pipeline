# Creator Pulse - Setup Guide

Complete guide to getting Creator Pulse running locally with all platforms configured.

## Architecture Overview

```
Frontend (React + Vite)
    ↓
Scrapers (Reddit, YouTube, Facebook)
    ↓
Your Backend (Next.js on Vercel)
    ↓
OpenAI Analysis API
```

## Prerequisites

- Node.js 18+
- Your backend deployed on Vercel (the Next.js app with OpenAI integration)
- API keys for platforms you want to scrape

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

Click the **Settings** button in the app and enter your API credentials. They're saved to browser localStorage.

### 3. Start the Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Platform Configuration

### YouTube Data API

**Setup Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create an OAuth 2.0 API key (API Key type)
5. Copy the API key to settings

**Limits:** 10,000 requests/day (free tier)

---

### Reddit API

**Setup Steps:**

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "Create an application" (scroll to bottom)
3. Fill in:
   - Name: "Creator Pulse"
   - Type: "Script"
   - About URL: leave blank or enter any URL
   - Redirect URI: `http://localhost`
4. You'll see your credentials:
   - **Client ID**: Under the app name (14 characters)
   - **Client Secret**: Click "show" next to secret
5. Use your Reddit username and password in settings

**Limits:** 60 requests/minute per IP

**Example Values:**
```
Client ID: xAbCdEfGhIjKlM
Client Secret: 1a2B3cD4eF5gH6iJ7kL8mN9oP0qR1sT
Username: your_reddit_username
Password: your_reddit_password
```

---

### Facebook Graph API

**Setup Steps:**

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app (select "Business" type)
3. Add "Facebook Login" product
4. Go to Settings → Basic and note your App ID
5. Generate an access token:
   - Go to Tools → Graph API Explorer
   - Select your app from dropdown
   - Click "Generate Access Token"
   - Copy the token to settings
6. For production: Create a system user token for longer validity

**Limits:** Depends on your app review status

**Token Validity:** Tokens expire after 60 days of non-use (developer tokens)

---

## Environment Variables

### Backend Configuration

The frontend needs to know where your backend is deployed:

**For local testing:**
```bash
# The app defaults to http://localhost:3000
# If your backend is elsewhere, add to .env:
VITE_BACKEND_URL=http://localhost:3000
```

**For production:**
```bash
# Update before building:
VITE_BACKEND_URL=https://your-vercel-deployment.vercel.app
```

---

## How It Works

### Scraping Flow

1. **User clicks "Start Analysis"**
2. **Frontend triggers scrapers** (YouTube, Reddit, Facebook in parallel)
3. **Raw posts collected** from each platform
4. **Posts formatted** as text for analysis
5. **Sent to your backend** at `/api/analyze`
6. **OpenAI processes** with your system prompt
7. **Insights returned** and displayed in dashboard

### Data Flow

```
User Config (stored in localStorage)
    ↓
Platform APIs (Reddit/YouTube/Facebook)
    ↓
ScrapedPost[] objects
    ↓
Text formatting
    ↓
Backend /api/analyze endpoint
    ↓
OpenAI gpt-4o with JSON response
    ↓
AnalysisResult displayed in UI
```

---

## Features

### Dashboard

- **Settings Panel**: Configure all API keys
- **Search Query**: Customize what to search for
- **Real-time Status**: See which platforms succeeded/failed
- **Executive Summary**: Key topics and weekly angle
- **Trending Themes**: Expandable cards with keywords and CTAs
- **Engagement Targets**: Creators to engage with

### Error Handling

- Graceful failures if one platform is unavailable
- Detailed error messages for debugging
- Continues with available data (e.g., if Reddit fails, still analyzes YouTube)

---

## Development

### Project Structure

```
src/
├── lib/
│   ├── scrapers/
│   │   ├── types.ts          # Shared TypeScript types
│   │   ├── reddit.ts         # Reddit scraper
│   │   ├── youtube.ts        # YouTube scraper
│   │   ├── facebook.ts       # Facebook scraper
│   │   └── index.ts          # Exports
│   └── api.ts                # Backend integration
├── components/
│   ├── ScraperDashboard.tsx  # Main controller
│   ├── InsightsSummary.tsx   # Summary display
│   ├── ThemesSection.tsx     # Themes display
│   └── EngagementTargets.tsx # Targets display
└── App.tsx
```

### Building for Production

```bash
npm run build
npm run preview
```

This creates an optimized build in the `dist/` folder.

---

## Troubleshooting

### "Analysis API error"

**Check:**
- Backend URL is correct in settings or `.env`
- Backend is running/deployed
- OpenAI API key configured in backend

### YouTube returns no results

**Check:**
- API key is valid
- API enabled in Google Cloud Console
- Not hitting rate limit (10k/day)

### Reddit returns "Auth failed"

**Check:**
- Username/password are correct
- Client ID and Secret match your app
- Reddit app is "script" type, not "web"

### Facebook returns empty posts

**Check:**
- Access token is valid
- Token hasn't expired
- You have permission to access the page

---

## API Credentials Checklist

| Platform | Credential | Where to Get | Required |
|----------|-----------|---|----------|
| YouTube | API Key | Google Cloud Console | Optional |
| Reddit | Client ID | Reddit App Preferences | Optional |
| Reddit | Client Secret | Reddit App Preferences | Optional |
| Reddit | Username | Your Reddit account | Optional |
| Reddit | Password | Your Reddit account | Optional |
| Facebook | Access Token | Facebook Developers | Optional |

You can use any combination. The app will analyze whatever it can collect.

---

## Common Workflows

### Scrape Weekly Filmmaker Discussions

1. Set search query to: "filmmaking challenges"
2. Configure YouTube API
3. Configure Reddit credentials
4. Click Start Analysis
5. Review trending themes and engagement targets
6. Export insights (copy/paste from UI)

### Monitor Specific Creator

1. Set search query to creator name: "@FilmmakerName"
2. Configure Facebook with page access token
3. Run analysis
4. Check "Engagement Targets" section

### Test Backend Integration

1. Manually test your backend:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"posts":"test filmmaker discussion post"}'
```

2. Should return JSON with executive_summary, themes, engagement_targets

---

## Performance Tips

- **Reduce Results**: Limit YouTube/Reddit to fewer than 50 posts
- **Cache Results**: Backend caches OpenAI responses (if configured)
- **Batch Requests**: Scrape multiple sources in parallel (automatic)

---

## Next Steps

1. Get API credentials for at least one platform
2. Configure in the Settings panel
3. Test with a small search query first
4. Expand to multiple platforms once working
5. Customize the system prompt in your backend for your specific needs

---

## Support

If something isn't working:

1. Check browser console for errors (F12)
2. Verify API credentials are correct
3. Test backend independently with curl
4. Check that your backend is running/deployed
5. Review platform API documentation

---

## Rate Limits Reference

| Platform | Limit | Period |
|----------|-------|--------|
| YouTube | 10,000 | Day |
| Reddit | 60 | Minute |
| Facebook | Varies | Minute |

These limits are per IP/account. Official API documentation has details.
