export type ScheduledBroadcast = {
  scheduleType: 'daily' | 'weekdays' | 'once';
  targetTime: string;
  targetDays?: string[];
  targetDate?: string;
  isEnabled: boolean;
};
export const localDate = (date: Date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function isScheduledForDate(
  schedule: {
    scheduleType?: 'daily' | 'weekdays' | 'once' | string;
    targetDate?: string | null;
    targetDays?: string[] | null;
  },
  now: Date = new Date()
): boolean {
  if (schedule.scheduleType === 'daily') return true;
  if (schedule.scheduleType === 'once') return schedule.targetDate === localDate(now);
  if (schedule.scheduleType === 'weekdays') {
    const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
    return schedule.targetDays?.includes(weekday) ?? false;
  }
  return false;
}

export function isDue(schedule: ScheduledBroadcast, now: Date): boolean {
  if (!schedule.isEnabled || schedule.targetTime !== now.toTimeString().slice(0, 5)) return false;
  return isScheduledForDate(schedule, now);
}

