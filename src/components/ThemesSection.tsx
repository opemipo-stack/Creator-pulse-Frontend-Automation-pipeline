
import { ChevronDown, Hash, Lightbulb, Target } from 'lucide-react';
import { useState } from 'react';
import { AnalysisResult } from '../lib/scrapers';

interface ThemesSectionProps {
  themes: AnalysisResult['themes'];
}

export function ThemesSection({ themes }: ThemesSectionProps) {
  const [expandedTheme, setExpandedTheme] = useState<number | null>(0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border"></div>
        <h2 className="text-2xl font-bold text-foreground">Trending Themes</h2>
        <div className="h-px flex-1 bg-border"></div>
      </div>
      
      <div className="space-y-3">
        {themes.map((theme, idx) => (
          <div
            key={idx}
            className={`bg-surface rounded-xl border overflow-hidden transition-all duration-300 ${
              expandedTheme === idx 
                ? 'border-primary/50 shadow-glow' 
                : 'border-border hover:border-border/60'
            }`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <button
              onClick={() => setExpandedTheme(expandedTheme === idx ? null : idx)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-surface-elevated transition-colors"
            >
              <div className="text-left flex-1">
                <h3 className="font-bold text-foreground text-lg mb-1">{theme.theme}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{theme.whats_happening}</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-all duration-300 ml-4 ${
                  expandedTheme === idx ? 'rotate-180 text-primary' : ''
                }`}
              />
            </button>

            {expandedTheme === idx && (
              <div className="px-6 py-6 bg-muted/20 border-t border-border space-y-6 animate-slide-up">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="w-4 h-4 text-secondary" />
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Rising Keywords
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {theme.rising_keywords.map((keyword, kidx) => (
                      <span
                        key={kidx}
                        className="px-4 py-2 bg-secondary/10 border border-secondary/30 text-secondary text-sm font-semibold rounded-full hover:bg-secondary/20 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/50"></div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Content Hooks
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {theme.content_hooks.map((hook, hidx) => (
                      <li key={hidx} className="text-sm text-muted-foreground flex gap-3 items-start group/hook">
                        <span className="text-primary mt-1 text-base font-bold group-hover/hook:scale-110 transition-transform">→</span>
                        <span className="leading-relaxed">{hook}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="h-px bg-border/50"></div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-success" />
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Call to Actions
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {theme.ctas.map((cta, cidx) => (
                      <li key={cidx} className="text-sm text-muted-foreground flex gap-3 items-start group/cta">
                        <span className="text-success mt-0.5 text-base font-bold group-hover/cta:scale-110 transition-transform">✓</span>
                        <span className="leading-relaxed">{cta}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
