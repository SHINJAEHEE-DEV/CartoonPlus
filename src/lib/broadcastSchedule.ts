export type ScheduledBroadcast={scheduleType:'daily'|'weekdays'|'once';targetTime:string;targetDays?:string[];targetDate?:string;isEnabled:boolean};
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function isDue(schedule:ScheduledBroadcast,now:Date):boolean{if(!schedule.isEnabled||schedule.targetTime!==now.toTimeString().slice(0,5))return false;if(schedule.scheduleType==='daily')return true;if(schedule.scheduleType==='once')return schedule.targetDate===localDate(now);return schedule.targetDays?.includes(['SUN','MON','TUE','WED','THU','FRI','SAT'][now.getDay()])??false;}
