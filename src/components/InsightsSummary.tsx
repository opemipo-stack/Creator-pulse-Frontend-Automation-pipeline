
import { Lightbulb, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { AnalysisResult } from '../lib/scrapers';

interface InsightsSummaryProps {
  analysis: AnalysisResult;
}

export function InsightsSummary({ analysis }: InsightsSummaryProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative bg-surface border border-primary/20 rounded-xl p-8 overflow-hidden group hover:border-primary/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500"></div>
        
        <div className="relative flex items-start gap-5">
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 group-hover:shadow-glow transition-all duration-300">
            <Lightbulb className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-bold text-foreground">Weekly Angle</h3>
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {analysis.executive_summary.weekly_angle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-success/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--success)/0.1)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-success/10 rounded-lg border border-success/20">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Key Topics</h3>
          </div>
          <ul className="space-y-3">
            {analysis.executive_summary.key_topics.map((topic, idx) => (
              <li
                key={idx}
                className="text-sm text-muted-foreground flex items-start gap-3 group/item"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="text-success mt-0.5 text-lg leading-none group-hover/item:scale-125 transition-transform">•</span>
                <span className="leading-relaxed">{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--accent)/0.1)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Engagement Opportunities</h3>
          </div>
          <ul className="space-y-3">
            {analysis.executive_summary.top_engagement_opportunities.map(
              (opp, idx) => (
                <li 
                  key={idx} 
                  className="text-sm text-muted-foreground flex items-start gap-3 group/item"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <span className="text-accent mt-0.5 text-lg leading-none group-hover/item:scale-125 transition-transform">•</span>
                  <span className="leading-relaxed">{opp}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
