// Italian national holidays (fixed dates)
const FIXED_HOLIDAYS = [
  { month: 1, day: 1, name: 'Capodanno' },
  { month: 1, day: 6, name: 'Epifania' },
  { month: 4, day: 25, name: 'Festa della Liberazione' },
  { month: 5, day: 1, name: 'Festa dei Lavoratori' },
  { month: 6, day: 2, name: 'Festa della Repubblica' },
  { month: 8, day: 15, name: 'Ferragosto' },
  { month: 11, day: 1, name: 'Ognissanti' },
  { month: 12, day: 8, name: 'Immacolata Concezione' },
  { month: 12, day: 25, name: 'Natale' },
  { month: 12, day: 26, name: 'Santo Stefano' },
];

/**
 * Calculates Easter Sunday for a given year using the Anonymous Gregorian algorithm.
 */
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/**
 * Returns all Italian national holidays for a given year.
 */
export function getItalianHolidays(year: number): Date[] {
  const holidays: Date[] = [];

  // Fixed holidays
  for (const h of FIXED_HOLIDAYS) {
    holidays.push(new Date(year, h.month - 1, h.day));
  }

  // Easter-based holidays
  const easter = calculateEaster(year);
  holidays.push(easter); // Easter Sunday
  const easterMonday = new Date(easter);
  easterMonday.setDate(easterMonday.getDate() + 1);
  holidays.push(easterMonday); // Easter Monday (Lunedì dell'Angelo)

  return holidays;
}

/**
 * Checks if a date is an Italian national holiday.
 */
export function isItalianHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = getItalianHolidays(year);
  return holidays.some(
    (h) =>
      h.getFullYear() === date.getFullYear() &&
      h.getMonth() === date.getMonth() &&
      h.getDate() === date.getDate()
  );
}

/**
 * Returns the day of the week (1=Monday, ..., 7=Sunday).
 */
export function getDayOfWeek(date: Date): number {
  const day = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  return day === 0 ? 7 : day; // Convert to 1=Monday, ..., 7=Sunday
}

/**
 * Determines the FASCIA value based on time and day.
 * F1: Weekday (Mon-Fri), not holiday, 08:00-19:00
 * F2: Weekday (Mon-Fri), not holiday, 07:00-08:00 or 19:00-23:00
 *     Saturday, not holiday, 07:00-23:00
 * F3: Everything else
 */
export function getFascia(date: Date, timeInterval: string): string {
  const dayOfWeek = getDayOfWeek(date);
  const isHoliday = isItalianHoliday(date);
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isSaturday = dayOfWeek === 6;

  // Parse time interval (e.g., "08:00-08:15")
  const startHour = parseInt(timeInterval.split('-')[0].split(':')[0]);
  const startMinute = parseInt(timeInterval.split('-')[0].split(':')[1]);
  const startTime = startHour + startMinute / 60;

  // F1: Weekday, not holiday, 08:00-19:00
  if (isWeekday && !isHoliday && startTime >= 8 && startTime < 19) {
    return 'F1';
  }

  // F2: Weekday, not holiday, 07:00-08:00 or 19:00-23:00
  if (isWeekday && !isHoliday && ((startTime >= 7 && startTime < 8) || (startTime >= 19 && startTime < 23))) {
    return 'F2';
  }

  // F2: Saturday, not holiday, 07:00-23:00
  if (isSaturday && !isHoliday && startTime >= 7 && startTime < 23) {
    return 'F2';
  }

  // F3: Everything else
  return 'F3';
}

/**
 * Determines PK/OP value.
 * PK: Monday-Friday, not holiday, 08:00-20:00
 * OP: Everything else
 */
export function getPkOp(date: Date, timeInterval: string): string {
  const dayOfWeek = getDayOfWeek(date);
  const isHoliday = isItalianHoliday(date);
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  // Parse time interval
  const startHour = parseInt(timeInterval.split('-')[0].split(':')[0]);
  const startMinute = parseInt(timeInterval.split('-')[0].split(':')[1]);
  const startTime = startHour + startMinute / 60;

  // PK: Weekday, not holiday, 08:00-20:00
  if (isWeekday && !isHoliday && startTime >= 8 && startTime < 20) {
    return 'PK';
  }

  return 'OP';
}

/**
 * Parses a date string (DD/MM/YYYY) into a Date object.
 */
export function parseDate(dateStr: string): Date {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
}
