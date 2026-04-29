// COMPONENT: Icon — wrapper untuk Lucide icons (modern format)
// Lucide.icons.X = [[tag, attrs], [tag, attrs], ...] — array of children directly
// Pakai: <window.Icon name="bell" size={20} className="..." />

(function() {
'use strict';

const NAME_MAP = {
  // Navigation
  'menu':'Menu','close':'X','arrow-left':'ArrowLeft','arrow-right':'ArrowRight',
  'chevron-down':'ChevronDown','chevron-up':'ChevronUp',
  // Action
  'heart':'Heart','bookmark':'Bookmark','share':'Share2','message':'MessageCircle',
  'send':'Send','edit':'Edit3','plus':'Plus','check':'Check',
  'thumbs-up':'ThumbsUp','thumbs-down':'ThumbsDown','star':'Star','flag':'Flag',
  'flame':'Flame',
  // Content
  'file-text':'FileText','video':'Video','mic':'Mic','image':'Image',
  'book':'BookOpen','graduation':'GraduationCap',
  // Civic
  'users':'Users','user':'User','shield':'Shield','scale':'Scale',
  'map-pin':'MapPin','building':'Building2','megaphone':'Megaphone','gavel':'Gavel',
  // Status
  'circle-check':'CircleCheck','circle-x':'CircleX','clock':'Clock','pause':'Pause',
  'rotate':'RotateCw','eye':'Eye','search':'Search','filter':'Filter',
  // Misc
  'sparkles':'Sparkles','lightbulb':'Lightbulb','bell':'Bell','calendar':'Calendar',
  'lock':'Lock','unlock':'Unlock','download':'Download','upload':'Upload',
  'external':'ExternalLink','play':'Play','home':'Home','mail':'Mail',
  'trophy':'Trophy','award':'Award','vote':'Vote','target':'Target',
  'list':'List','settings':'Settings','help':'CircleHelp','info':'Info',
  'arrow-up-right':'ArrowUpRight','trending-up':'TrendingUp',
};

function Icon({ name, size = 18, color, strokeWidth = 2, className = '', style = {} }) {
  const lucide = window.lucide;
  const lucideName = NAME_MAP[name] || name;
  const finalColor = color || 'currentColor';

  // Fallback if lucide / icon not found — invisible spacer
  if (!lucide?.icons?.[lucideName]) {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{ display: 'inline-block', width: size, height: size, ...style }}
      />
    );
  }

  // Lucide format: array of [tag, attrs] entries (children only)
  const childrenSpec = lucide.icons[lucideName];

  return (
    <svg
      aria-hidden="true"
      className={`jw-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={finalColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      {Array.isArray(childrenSpec) && childrenSpec.map((entry, i) => {
        if (!Array.isArray(entry) || entry.length < 2) return null;
        const [tag, attrs] = entry;
        return React.createElement(tag, { key: i, ...attrs });
      })}
    </svg>
  );
}

window.Icon = Icon;
})();
