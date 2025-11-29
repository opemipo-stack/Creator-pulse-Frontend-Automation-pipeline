
// import { useState } from 'react';
// import {
//   Loader,
//   AlertCircle,
//   CheckCircle,
//   Play,
//   Settings,
//   Eye,
//   EyeOff,
//   Activity,
//   Sparkles,
// } from 'lucide-react';
// import { RedditScraper, YoutubeScraper, FacebookScraper, ScrapedPost, AnalysisResult } from '../lib/scrapers';
// import { AnalysisApiClient } from '../lib/api';
// import { InsightsSummary } from './InsightsSummary';
// import { ThemesSection } from './ThemesSection';
// import { EngagementTargets } from './EngagementTargets';

// const BACKEND_URL =
//   import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// export function ScraperDashboard() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
//   const [showSettings, setShowSettings] = useState(false);
//   const [showApiKeys, setShowApiKeys] = useState(false);

//   const [config, setConfig] = useState({
//     redditClientId: localStorage.getItem('redditClientId') || '',
//     redditClientSecret: localStorage.getItem('redditClientSecret') || '',
//     redditUsername: localStorage.getItem('redditUsername') || '',
//     redditPassword: localStorage.getItem('redditPassword') || '',
//     youtubeApiKey: localStorage.getItem('youtubeApiKey') || '',
//     facebookAccessToken: localStorage.getItem('facebookAccessToken') || '',
//     searchQuery: localStorage.getItem('searchQuery') || 'filmmaking',
//   });

//   const handleConfigChange = (field: string, value: string) => {
//     setConfig((prev) => {
//       const updated = { ...prev, [field]: value };
//       localStorage.setItem(field, value);
//       return updated;
//     });
//   };

//   const handleScrapeAndAnalyze = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
//     setAnalysis(null);

//     try {
//       const allPosts: ScrapedPost[] = [];

//       if (config.youtubeApiKey) {
//         try {
//           const ytScraper = new YoutubeScraper({
//             apiKey: config.youtubeApiKey,
//           });
//           const ytPosts = await ytScraper.searchVideos(config.searchQuery, 20);
//           allPosts.push(...ytPosts);
//           setSuccess(
//             (prev) =>
//               (prev || '') + (prev ? ' • ' : '') + `YouTube: ${ytPosts.length} posts`
//           );
//         } catch (err) {
//           setError(
//             (prev) =>
//               (prev || '') +
//               (prev ? ' • ' : '') +
//               `YouTube error: ${err instanceof Error ? err.message : 'Unknown error'}`
//           );
//         }
//       }

//       if (
//         config.redditClientId &&
//         config.redditClientSecret &&
//         config.redditUsername &&
//         config.redditPassword
//       ) {
//         try {
//           const redditScraper = new RedditScraper({
//             clientId: config.redditClientId,
//             clientSecret: config.redditClientSecret,
//             username: config.redditUsername,
//             password: config.redditPassword,
//           });
//           const redditPosts = await redditScraper.searchPosts(
//             config.searchQuery,
//             20
//           );
//           allPosts.push(...redditPosts);
//           setSuccess(
//             (prev) =>
//               (prev || '') +
//               (prev ? ' • ' : '') +
//               `Reddit: ${redditPosts.length} posts`
//           );
//         } catch (err) {
//           setError(
//             (prev) =>
//               (prev || '') +
//               (prev ? ' • ' : '') +
//               `Reddit error: ${err instanceof Error ? err.message : 'Unknown error'}`
//           );
//         }
//       }

//       if (config.facebookAccessToken) {
//         try {
//           const fbScraper = new FacebookScraper({
//             accessToken: config.facebookAccessToken,
//           });
//           const fbPosts = await fbScraper.searchPosts('filmmakers', 20);
//           allPosts.push(...fbPosts);
//           setSuccess(
//             (prev) =>
//               (prev || '') + (prev ? ' • ' : '') + `Facebook: ${fbPosts.length} posts`
//           );
//         } catch (err) {
//           setError(
//             (prev) =>
//               (prev || '') +
//               (prev ? ' • ' : '') +
//               `Facebook error: ${err instanceof Error ? err.message : 'Unknown error'}`
//           );
//         }
//       }

//       if (!allPosts.length) {
//         throw new Error('No posts collected from any platform');
//       }

//       const apiClient = new AnalysisApiClient({ backendUrl: BACKEND_URL });
//       const result = await apiClient.analyzePosts(allPosts);
//       setAnalysis(result);
//       setSuccess((prev) => (prev || '') + (prev ? ' • ' : '') + 'Analysis complete!');
//     } catch (err) {
//       setError(
//         (prev) =>
//           (prev || '') +
//           (prev ? ' • ' : '') +
//           (err instanceof Error ? err.message : 'Unknown error')
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mb-10 animate-fade-in">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
//                 <div className="relative p-3 bg-card rounded-xl border border-primary/30">
//                   <Activity className="w-8 h-8 text-primary" />
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-foreground">Creator Pulse</h1>
//                 <p className="text-muted-foreground mt-1 text-sm">
//                   Analyze filmmaker conversations across social platforms
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowSettings(!showSettings)}
//               className={`p-3 rounded-xl transition-all duration-300 border ${
//                 showSettings
//                   ? 'bg-primary/10 border-primary/30 text-primary'
//                   : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/20'
//               }`}
//             >
//               <Settings className="w-6 h-6" />
//             </button>
//           </div>

//           {showSettings && (
//             <div className="bg-surface rounded-xl border border-border p-6 mb-6 animate-slide-up">
//               <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
//                 <Settings className="w-5 h-5 text-primary" />
//                 Configuration
//               </h2>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-foreground mb-2">
//                     Search Query
//                   </label>
//                   <input
//                     type="text"
//                     value={config.searchQuery}
//                     onChange={(e) => handleConfigChange('searchQuery', e.target.value)}
//                     className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
//                     placeholder="e.g., filmmaking, cinematography"
//                   />
//                 </div>

//                 <div className="border-t border-border pt-6">
//                   <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-destructive rounded-full"></span>
//                     YouTube Configuration
//                   </h3>
//                   <div>
//                     <label className="block text-sm font-semibold text-foreground mb-2">
//                       API Key
//                     </label>
//                     <div className="flex gap-2">
//                       <input
//                         type={showApiKeys ? 'text' : 'password'}
//                         value={config.youtubeApiKey}
//                         onChange={(e) =>
//                           handleConfigChange('youtubeApiKey', e.target.value)
//                         }
//                         className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
//                         placeholder="Your YouTube API key"
//                       />
//                       <button
//                         onClick={() => setShowApiKeys(!showApiKeys)}
//                         className="p-3 bg-surface border border-border rounded-xl hover:border-primary/30 transition-all"
//                       >
//                         {showApiKeys ? (
//                           <EyeOff className="w-5 h-5 text-muted-foreground" />
//                         ) : (
//                           <Eye className="w-5 h-5 text-muted-foreground" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t border-border pt-6">
//                   <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
//                     Reddit Configuration
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-foreground mb-2">
//                           Client ID
//                         </label>
//                         <input
//                           type={showApiKeys ? 'text' : 'password'}
//                           value={config.redditClientId}
//                           onChange={(e) =>
//                             handleConfigChange('redditClientId', e.target.value)
//                           }
//                           className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-foreground mb-2">
//                           Client Secret
//                         </label>
//                         <input
//                           type={showApiKeys ? 'text' : 'password'}
//                           value={config.redditClientSecret}
//                           onChange={(e) =>
//                             handleConfigChange('redditClientSecret', e.target.value)
//                           }
//                           className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
//                         />
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-foreground mb-2">
//                           Username
//                         </label>
//                         <input
//                           type="text"
//                           value={config.redditUsername}
//                           onChange={(e) =>
//                             handleConfigChange('redditUsername', e.target.value)
//                           }
//                           className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-foreground mb-2">
//                           Password
//                         </label>
//                         <input
//                           type={showApiKeys ? 'text' : 'password'}
//                           value={config.redditPassword}
//                           onChange={(e) =>
//                             handleConfigChange('redditPassword', e.target.value)
//                           }
//                           className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t border-border pt-6">
//                   <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-primary rounded-full"></span>
//                     Facebook Configuration
//                   </h3>
//                   <div>
//                     <label className="block text-sm font-semibold text-foreground mb-2">
//                       Access Token
//                     </label>
//                     <input
//                       type={showApiKeys ? 'text' : 'password'}
//                       value={config.facebookAccessToken}
//                       onChange={(e) =>
//                         handleConfigChange('facebookAccessToken', e.target.value)
//                       }
//                       className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
//                       placeholder="Your Facebook access token"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <button
//             onClick={handleScrapeAndAnalyze}
//             disabled={loading}
//             className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
//               loading
//                 ? 'bg-muted text-muted-foreground cursor-not-allowed'
//                 : 'bg-primary text-primary-foreground hover:shadow-glow active:scale-[0.98]'
//             }`}
//           >
//             {loading ? (
//               <>
//                 <Loader className="w-5 h-5 animate-spin" />
//                 Analyzing...
//               </>
//             ) : (
//               <>
//                 <Play className="w-5 h-5" />
//                 Start Analysis
//               </>
//             )}
//           </button>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex gap-3 animate-slide-up">
//             <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
//             <div className="text-sm text-destructive font-medium">{error}</div>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-xl flex gap-3 animate-slide-up">
//             <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
//             <div className="text-sm text-success font-medium">{success}</div>
//           </div>
//         )}

//         {analysis && (
//           <div className="space-y-10">
//             <InsightsSummary analysis={analysis} />
//             <ThemesSection themes={analysis.themes} />
//             <EngagementTargets targets={analysis.engagement_targets} />
//           </div>
//         )}

//         {!analysis && !loading && !showSettings && (
//           <div className="mt-12 text-center py-16 animate-fade-in">
//             <Sparkles className="w-12 h-12 text-primary/40 mx-auto" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import { useState, useEffect } from 'react';
import {
  Loader,
  AlertCircle,
  CheckCircle,
  Play,
  Sparkles,
} from 'lucide-react';
import { RedditScraper, YoutubeScraper, FacebookScraper, ScrapedPost, AnalysisResult } from '../lib/scrapers';
import { AnalysisApiClient } from '../lib/api';
import { InsightsSummary } from './InsightsSummary';
import { ThemesSection } from './ThemesSection';
import { EngagementTargets } from './EngagementTargets';
import logo from '../assets/image-DNaKSDV2Vm6rz8yKS6WtuJwy4rLZwh.png';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Environment variables configuration
const ENV_CONFIG = {
  youtube: {
    apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  },
  reddit: {
    clientId: import.meta.env.VITE_REDDIT_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_REDDIT_CLIENT_SECRET || '',
    username: import.meta.env.VITE_REDDIT_USERNAME || '',
    password: import.meta.env.VITE_REDDIT_PASSWORD || '',
  },
  facebook: {
    accessToken: import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN || '',
  },
};


export function ScraperDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const searchQuery = 'filmmaking';

  const handleScrapeAndAnalyze = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setAnalysis(null);

    try {
      const allPosts: ScrapedPost[] = [];

      // YouTube scraping
      if (ENV_CONFIG.youtube.apiKey) {
        try {
          const ytScraper = new YoutubeScraper({
            apiKey: ENV_CONFIG.youtube.apiKey,
          });
          const ytPosts = await ytScraper.searchVideos(searchQuery, 20);
          allPosts.push(...ytPosts);
          setSuccess(
            (prev) =>
              (prev || '') + (prev ? ' • ' : '') + `YouTube: ${ytPosts.length} posts`
          );
        } catch (err) {
          setError(
            (prev) =>
              (prev || '') +
              (prev ? ' • ' : '') +
              `YouTube error: ${err instanceof Error ? err.message : 'Unknown error'}`
          );
        }
      }

      // Reddit scraping
      if (
        ENV_CONFIG.reddit.clientId &&
        ENV_CONFIG.reddit.clientSecret &&
        ENV_CONFIG.reddit.username &&
        ENV_CONFIG.reddit.password
      ) {
        try {
          const redditScraper = new RedditScraper({
            clientId: ENV_CONFIG.reddit.clientId,
            clientSecret: ENV_CONFIG.reddit.clientSecret,
            username: ENV_CONFIG.reddit.username,
            password: ENV_CONFIG.reddit.password,
          });
          const redditPosts = await redditScraper.searchPosts(searchQuery, 20);
          allPosts.push(...redditPosts);
          setSuccess(
            (prev) =>
              (prev || '') +
              (prev ? ' • ' : '') +
              `Reddit: ${redditPosts.length} posts`
          );
        } catch (err) {
          if (ENV_CONFIG.reddit.clientId) {
            setError(
              prev =>
                (prev || '') +
                (prev ? ' • ' : '') +
                `Reddit error: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
          }
        }

      }

      // Facebook scraping
      if (ENV_CONFIG.facebook.accessToken) {
        try {
          const fbScraper = new FacebookScraper({
            accessToken: ENV_CONFIG.facebook.accessToken,
          });
          const fbPosts = await fbScraper.searchPosts('filmmakers', 20);
          allPosts.push(...fbPosts);
          setSuccess(
            (prev) =>
              (prev || '') + (prev ? ' • ' : '') + `Facebook: ${fbPosts.length} posts`
          );
        } catch (err) {
          if (ENV_CONFIG.facebook.accessToken) {
            setError(prev =>
              (prev || '') +
              (prev ? ' , ' : '') +
              `Facebook error: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
          }
        }

      }

      if (!allPosts.length) {
        throw new Error('No posts collected from any platform. Check your environment variables.');
      }

      const apiClient = new AnalysisApiClient({ backendUrl: BACKEND_URL });
      const result = await apiClient.analyzePosts(allPosts);
      setAnalysis(result);
      setSuccess((prev) => (prev || '') + (prev ? ' • ' : '') + 'Analysis complete!');
    } catch (err) {
      setError(
        (prev) =>
          (prev || '') +
          (prev ? ' • ' : '') +
          (err instanceof Error ? err.message : 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  if (success) {
    const timeout = setTimeout(() => setSuccess(''), 5000);
    return () => clearTimeout(timeout);
  }
}, [success]);

useEffect(() => {
  if (error) {
    const timeout = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(timeout);
  }
}, [error]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
                <div className="relative p-3 bg-card rounded-xl border border-primary/30">
                  <img src={logo} alt="Creator Pulse" className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Creator Pulse</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Analyze filmmaker conversations across social platforms
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleScrapeAndAnalyze}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
              loading
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:shadow-glow active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Analysis
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex gap-3 animate-slide-up">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm text-destructive font-medium">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-xl flex gap-3 animate-slide-up">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div className="text-sm text-success font-medium">{success}</div>
          </div>
        )}

        {analysis && (
          <div className="space-y-10">
            <InsightsSummary analysis={analysis} />
            <ThemesSection themes={analysis.themes} />
            <EngagementTargets targets={analysis.engagement_targets} />
          </div>
        )}

        {!analysis && !loading && (
          <div className="mt-12 text-center py-16 animate-fade-in">
            <Sparkles className="w-12 h-12 text-primary/40 mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}

