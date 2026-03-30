import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAgeGroup(age: number): '5-10' | '11-14' | '15-19' {
  if (age <= 10) return '5-10';
  if (age <= 14) return '11-14';
  return '15-19';
}

export function getAgeGroupLabel(age: number): string {
  if (age <= 10) return '1-6';
  if (age <= 14) return '7-12';
  return '13-19';
}

export function getMentorRatioColor(ratio: number): string {
  if (ratio <= 5) return 'text-green-600';
  if (ratio <= 10) return 'text-amber-500';
  return 'text-red-600';
}

export function getMentorRatioBg(ratio: number): string {
  if (ratio <= 5) return 'bg-green-100 border-green-300';
  if (ratio <= 10) return 'bg-amber-100 border-amber-300';
  return 'bg-red-100 border-red-300';
}

export function xpToLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(level: number): number {
  return level * level * 100;
}

export function xpProgress(xp: number): number {
  const level = xpToLevel(xp);
  const current = (level - 1) * (level - 1) * 100;
  const next = xpForNextLevel(level);
  return Math.round(((xp - current) / (next - current)) * 100);
}

export function formatDate(date: Date | { toDate(): Date } | string | null): string {
  if (!date) return '—';
  const d = typeof date === 'object' && 'toDate' in date ? date.toDate() : new Date(date as string);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function daysUntil(date: Date | { toDate(): Date } | string | null): number {
  if (!date) return Infinity;
  const d = typeof date === 'object' && 'toDate' in date ? date.toDate() : new Date(date as string);
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export const BADGES = [
  { id: 'first_task', name: 'First Step', description: 'Complete your first task', icon: '🌟' },
  { id: 'week_streak', name: 'Week Warrior', description: '7-day completion streak', icon: '🔥' },
  { id: 'top_learner', name: 'Top Learner', description: 'Reach top 10 on leaderboard', icon: '🏆' },
  { id: 'xp_100', name: 'Century Club', description: 'Earn 100 XP', icon: '💯' },
  { id: 'xp_500', name: 'XP Hunter', description: 'Earn 500 XP', icon: '⚡' },
  { id: 'xp_1000', name: 'Legend', description: 'Earn 1000 XP', icon: '👑' },
  { id: 'perfect_quiz', name: 'Quiz Master', description: 'Score 10/10 on a quiz', icon: '🎓' },
  { id: 'helpful', name: 'Helper', description: 'Help a peer', icon: '🤝' },
];

export const SUBJECTS = ['Math', 'Science', 'English', 'Reading', 'Life Skills', 'Arts', 'Social Studies', 'Computer'];
export const AGE_GROUPS = ['1-6', '7-12', '13-19'] as const;
export const LANGUAGES = ['Hindi', 'English', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi'];
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
