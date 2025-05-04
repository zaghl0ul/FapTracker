import { useMemo } from 'react';
import { 
  subDays, 
  startOfDay, 
  parseISO, 
  isWithinInterval, 
  differenceInCalendarDays 
} from 'date-fns';
import { Entry } from '../contexts/EntriesContext';

interface StatsResult {
  total: number;
  totalDuration: number;
  avg: number;
  avgDuration: number;
  streak: number;
  longest: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  dailyMax: number;
}

export const useStats = (entries: Entry[]): StatsResult => {
  return useMemo(() => {
    if (entries.length === 0) {
      return { 
        total: 0, 
        totalDuration: 0,
        avg: 0, 
        avgDuration: 0,
        streak: 0, 
        longest: 0,
        thisWeek: 0,
        lastWeek: 0,
        thisMonth: 0,
        lastMonth: 0,
        dailyMax: 0
      };
    }
    
    // Sort entries by date
    const sorted = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate base stats
    const total = sorted.reduce((sum, entry) => sum + entry.count, 0);
    const totalDuration = sorted.reduce((sum, entry) => sum + (entry.totalDuration || 0), 0);
    const avg = total / sorted.length;
    const avgDuration = totalDuration / sorted.length;
    
    // Find the daily maximum
    const dailyMax = sorted.reduce((max, entry) => Math.max(max, entry.count), 0);
    
    // Calculate streak
    let streak = 0;
    let longest = 0;
    const now = new Date();
    
    // Get all dates with entries
    const datesWithEntries = sorted
      .filter(entry => entry.count > 0)
      .map(entry => startOfDay(parseISO(entry.date)).getTime());
    
    // Find the current streak
    let currentDate = startOfDay(now);
    
    while (datesWithEntries.includes(currentDate.getTime())) {
      streak++;
      currentDate = subDays(currentDate, 1);
    }
    
    // Find the longest streak
    const uniqueDates = [...new Set(datesWithEntries)].sort();
    
    if (uniqueDates.length > 0) {
      let currentStreak = 1;
      
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        
        if (differenceInCalendarDays(prevDate, currDate) === 1) {
          currentStreak++;
        } else {
          longest = Math.max(longest, currentStreak);
          currentStreak = 1;
        }
      }
      
      longest = Math.max(longest, currentStreak);
    }
    
    // Calculate period totals
    const today = startOfDay(now);
    const oneWeekAgo = startOfDay(subDays(now, 7));
    const twoWeeksAgo = startOfDay(subDays(now, 14));
    const oneMonthAgo = startOfDay(subDays(now, 30));
    const twoMonthsAgo = startOfDay(subDays(now, 60));
    
    const thisWeek = sorted.reduce((sum, entry) => {
      const date = startOfDay(parseISO(entry.date));
      return isWithinInterval(date, { start: oneWeekAgo, end: today }) 
        ? sum + entry.count 
        : sum;
    }, 0);
    
    const lastWeek = sorted.reduce((sum, entry) => {
      const date = startOfDay(parseISO(entry.date));
      return isWithinInterval(date, { start: twoWeeksAgo, end: subDays(oneWeekAgo, 1) }) 
        ? sum + entry.count 
        : sum;
    }, 0);
    
    const thisMonth = sorted.reduce((sum, entry) => {
      const date = startOfDay(parseISO(entry.date));
      return isWithinInterval(date, { start: oneMonthAgo, end: today }) 
        ? sum + entry.count 
        : sum;
    }, 0);
    
    const lastMonth = sorted.reduce((sum, entry) => {
      const date = startOfDay(parseISO(entry.date));
      return isWithinInterval(date, { start: twoMonthsAgo, end: subDays(oneMonthAgo, 1) }) 
        ? sum + entry.count 
        : sum;
    }, 0);
    
    return { 
      total, 
      totalDuration,
      avg, 
      avgDuration,
      streak, 
      longest,
      thisWeek,
      lastWeek,
      thisMonth,
      lastMonth,
      dailyMax
    };
  }, [entries]);
};