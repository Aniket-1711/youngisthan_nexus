'use client';

import { xpToLevel, xpForNextLevel, xpProgress } from '@/lib/utils';

interface XPBarProps {
  xp: number;
  theme?: 'young' | 'middle' | 'teen';
}

const themeColors: Record<string, string> = {
  young: 'from-pink-400 to-rose-500',
  middle: 'from-violet-500 to-purple-600',
  teen: 'from-blue-500 to-indigo-600',
};

export function XPBar({ xp, theme = 'teen' }: XPBarProps) {
  const level = xpToLevel(xp);
  const progress = xpProgress(xp);
  const nextLevelXp = xpForNextLevel(level);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-700">Level {level}</span>
        <span className="text-xs text-gray-500">{xp} / {nextLevelXp} XP</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${themeColors[theme]} transition-all duration-1000`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
