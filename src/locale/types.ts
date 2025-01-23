import type {ParseToken} from '../dateTime/formatParse';
import type {DateTime} from '../typings';

export interface WeekInfo {
    /** An integer between 1 (Monday) and 7 (Sunday) indicating the first day of the week for the locale. */
    firstDay: number;
    /** An integer between 1 and 7 (commonly 1 and 4) indicating the minimal days required in the first week of a month or year, for week-of-year or week-of-month calculations */
    minimalDays: number;
    /** An array of integers between 1 and 7 indicating the weekend days for the locale.  */
    weekend: number[];
}

export interface Locale {
    locale: string;
    longDateFormat: LongDateFormat;
    relativeTime?: RelativeTime;
    months(length: 'long' | 'short' | 'narrow', isStandalone?: boolean): string[];
    weekdays(length: 'long' | 'short' | 'narrow', isStandalone?: boolean): string[];
    eras(length: 'long' | 'short' | 'narrow'): string[];
    meridiems(length: 'long' | 'short'): string[];
    meridiem(hour: number, length?: 'long' | 'short' | 'narrow'): string;
    ordinal: OrdinalNumberFunction;
    ordinalParseUnit: OrdinalParseUnitFunction;
    weekInfo(): WeekInfo;
    // Formatters
    numberFormatter(): NumberFormatter;
    dateTimeFormatter(): DateTimeFormatter;
    relativeNumberFormatter(): RelativeNumberFormatter;
    // listFormatter(): ListFormatter;
}

export interface DateTimeFormatter {
    format(date: DateTime): string;
    formatToParts(date: DateTime): Intl.DateTimeFormatPart[];
}
export interface NumberFormatter {
    format(number: number): string;
}
export interface RelativeNumberFormatter {
    format(number: number, unit: string): string;
    formatToParts(number: number, unit: string): Intl.RelativeTimeFormatPart[];
}

export interface LongDateFormat {
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;
    LT: string;
    LTS: string;

    l?: string;
    ll?: string;
    lll?: string;
    llll?: string;
    lt?: string;
    lts?: string;
}

type RelativeFormatFunc<T> = (
    v: number,
    withoutSuffix: boolean,
    unit: T,
    isFuture: boolean,
) => string;

export interface RelativeTime {
    future: string | ((v: string) => string);
    past: string | ((v: string) => string);
    s: string | RelativeFormatFunc<'s'>;
    m: string | RelativeFormatFunc<'m'>;
    mm: string | RelativeFormatFunc<'mm'>;
    h: string | RelativeFormatFunc<'h'>;
    hh: string | RelativeFormatFunc<'hh'>;
    d: string | RelativeFormatFunc<'d'>;
    dd: string | RelativeFormatFunc<'dd'>;
    M: string | RelativeFormatFunc<'M'>;
    MM: string | RelativeFormatFunc<'MM'>;
    y: string | RelativeFormatFunc<'y'>;
    yy: string | RelativeFormatFunc<'yy'>;
}

export type OrdinalNumberFunction = (
    n: number,
    unit: 'date' | 'weekday' | 'dayOfYear' | 'weekNumber' | 'month' | 'quarter',
) => string;

export type OrdinalParseUnitFunction = (
    unit: 'date' | 'weekday' | 'dayOfYear' | 'weekNumber' | 'month' | 'quarter',
) => ParseToken<typeof unit, number>;

export interface LocaleOptions {
    longDateFormat: LongDateFormat;
    relativeTime?: RelativeTime;
    ordinal: OrdinalNumberFunction;
    ordinalParseUnit: OrdinalParseUnitFunction;
}
