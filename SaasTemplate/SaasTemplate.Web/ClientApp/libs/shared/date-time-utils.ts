// Third-party modules
import { TranslateService } from "@ngx-translate/core";

// Converts a UTC date to local date by removing timezone offset
export function convertToLocalDate(eventDate?: Date): Date | undefined {
  if (!eventDate) return undefined;
  const date = new Date(eventDate);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

// Combines date and time into a single Date object, adding 1 day to the date
export function getEventDateTime(dateUntil: Date, timeUntil: Date): Date {
  if (dateUntil && timeUntil) {
    const date = new Date(dateUntil);
    date.setDate(date.getDate() + 1);
    const time = new Date(timeUntil);
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      time.getHours(),
      time.getMinutes()
    );
  }
  return new Date();
}

// Returns the difference in milliseconds between now and the target date
export function getTimeDifference(target: Date): number {
  const now: Date = new Date();
  return target.getTime() - now.getTime();
}

// Returns localized date string based on given options and current translation language
export function convertToDate(date: Date, translate: TranslateService, options: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString(`${translate.instant('DATE_LANGUAGE')}`, options);
}

// Returns time string in HH:mm format (24-hour format)
export function convertToTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export interface ICountdownUnit {
  value: string;
  label: string;
}

export interface ICountdown {
  days: ICountdownUnit;
  hours: ICountdownUnit;
  minutes: ICountdownUnit;
  seconds: ICountdownUnit;
}

// Calculates time left and returns value/label pairs so they can be rendered in separate fixed-width elements
export function getTimeUntil(timeDifference: number, translate: TranslateService): ICountdown {
  if (timeDifference <= 0) {
    return {
      days:    { value: '00', label: translate.instant('DAY') + translate.instant('S') },
      hours:   { value: '00', label: translate.instant('HOUR') + translate.instant('I') },
      minutes: { value: '00', label: translate.instant('MINUTE') + translate.instant('S') },
      seconds: { value: '00', label: translate.instant('SECOND') + translate.instant('I') },
    };
  }

  let seconds = Math.floor(timeDifference / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours   = hours % 24;

  const pad = (n: number) => String(n).padStart(2, '0');

  return {
    days:    { value: pad(days),    label: translate.instant('DAY') + (days === 1 ? '' : translate.instant('S')) },
    hours:   { value: pad(hours),   label: translate.instant('HOUR') + (hours === 1 ? '' : (hours < 5 && hours > 0 ? translate.instant('S') : translate.instant('I'))) },
    minutes: { value: pad(minutes), label: translate.instant('MINUTE') + (minutes === 1 ? '' : translate.instant('S')) },
    seconds: { value: pad(seconds), label: translate.instant('SECOND') + (seconds === 1 ? translate.instant('A') : (seconds < 5 && seconds > 0 ? translate.instant('E') : translate.instant('I'))) },
  };
}
