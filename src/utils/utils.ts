import type {DateTime} from '../typings';

export type CompareStringsOptions = {
    ignoreCase?: boolean;
};

// x % n but takes the sign of n instead of x
export function floorMod(x: number, n: number) {
    return x - n * Math.floor(x / n);
}

export function isLeapYear(year: number) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInYear(year: number) {
    return isLeapYear(year) ? 366 : 365;
}

export function daysInMonth(year: number, month: number): number {
    const modMonth = floorMod(month, 12),
        modYear = year + (month - modMonth) / 12;

    if (modMonth === 1) {
        return isLeapYear(modYear) ? 29 : 28;
    } else {
        return [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth];
    }
}

export interface DateObject {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

export function tsToObject(ts: number, offset: number): DateObject {
    const value = ts + offset * 60 * 1000;

    const date = new Date(value);

    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
        date: date.getUTCDate(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
        millisecond: date.getUTCMilliseconds(),
    };
}
export function objToTS(obj: DateObject) {
    const ts = Date.UTC(
        obj.year,
        obj.month,
        obj.date,
        obj.hour,
        obj.minute,
        obj.second,
        obj.millisecond,
    );

    // for legacy reasons, years between 0 and 99 are interpreted as 19XX; revert that
    if (obj.year < 100 && obj.year >= 0) {
        const d = new Date(ts);
        // set the month and day again, this is necessary because year 2000 is a leap year, but year 100 is not
        // so if obj.year is in 99, but obj.day makes it roll over into year 100,
        // the calculations done by Date.UTC are using year 2000 - which is incorrect
        d.setUTCFullYear(obj.year, obj.month, obj.date);

        return d.valueOf();
    }
    return ts;
}

const durationNormalizedUnits = {
    y: 'years',
    year: 'years',
    years: 'years',
    Q: 'quarters',
    quarter: 'quarters',
    quarters: 'quarters',
    M: 'months',
    month: 'months',
    months: 'months',
    w: 'weeks',
    week: 'weeks',
    weeks: 'weeks',
    d: 'days',
    day: 'days',
    days: 'days',
    h: 'hours',
    hour: 'hours',
    hours: 'hours',
    m: 'minutes',
    minute: 'minutes',
    minutes: 'minutes',
    s: 'seconds',
    second: 'seconds',
    seconds: 'seconds',
    ms: 'milliseconds',
    millisecond: 'milliseconds',
    milliseconds: 'milliseconds',
} as const;

export function normalizeDurationUnit(component: string) {
    const unit = ['d', 'D', 'm', 'M', 'w', 'W', 'E', 'Q'].includes(component)
        ? component
        : component.toLowerCase();
    if (unit in durationNormalizedUnits) {
        return durationNormalizedUnits[unit as keyof typeof durationNormalizedUnits];
    }

    throw new Error(`Invalid unit ${component}`);
}

const normalizedUnits = {
    y: 'year',
    year: 'year',
    years: 'year',
    M: 'month',
    month: 'month',
    months: 'month',
    D: 'date',
    date: 'date',
    dates: 'date',
    h: 'hour',
    hour: 'hour',
    hours: 'hour',
    m: 'minute',
    minute: 'minute',
    minutes: 'minute',
    Q: 'quarter',
    quarter: 'quarter',
    quarters: 'quarter',
    s: 'second',
    second: 'second',
    seconds: 'second',
    ms: 'millisecond',
    millisecond: 'millisecond',
    milliseconds: 'millisecond',
    d: 'day',
    day: 'day',
    days: 'day',
    weeknumber: 'weekNumber',
    w: 'weekNumber',
    week: 'weekNumber',
    weeks: 'weekNumber',
    isoweeknumber: 'isoWeekNumber',
    W: 'isoWeekNumber',
    isoweek: 'isoWeekNumber',
    isoweeks: 'isoWeekNumber',
    E: 'isoWeekday',
    isoweekday: 'isoWeekday',
    isoweekdays: 'isoWeekday',
    weekday: 'weekday',
    weekdays: 'weekday',
    e: 'weekday',
    dayOfYear: 'dayOfYear',
    dayOfYears: 'dayOfYear',
    DDD: 'dayOfYear',
    weekyear: 'weekYear',
    isoweekyear: 'isoWeekYear',
} as const;

export function normalizeComponent(component: string) {
    const unit = ['d', 'D', 'm', 'M', 'w', 'W', 'e', 'E', 'Q'].includes(component)
        ? component
        : component.toLowerCase();
    if (unit in normalizedUnits) {
        return normalizedUnits[unit as keyof typeof normalizedUnits];
    }

    throw new Error(`Invalid unit ${component}`);
}

function asNumber(value: unknown) {
    const numericValue = Number(value);
    if (typeof value === 'boolean' || value === '' || Number.isNaN(numericValue)) {
        throw new Error(`Invalid unit value ${value}`);
    }
    return numericValue;
}

export function normalizeDateComponents<From extends string, To extends string>(
    components: Partial<Record<From, string | number | undefined>>,
    normalizer: (unit: string) => To,
) {
    const normalized: Partial<Record<To, number>> = {};
    for (const [c, v] of Object.entries(components)) {
        if (v === undefined || v === null) {
            continue;
        }
        normalized[normalizer(c)] = asNumber(v);
    }
    return normalized;
}

const matchOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z
// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
const chunkOffset = /([+-]|\d\d)/gi;

export function offsetFromString(value: string | undefined) {
    const matches = (value || '').match(matchOffset);

    if (matches === null) {
        return null;
    }

    const chunk = matches[matches.length - 1] || '';
    const [sign, h, m] = String(chunk).match(chunkOffset) || ['-', 0, 0];
    const minutes = Number(Number(h) * 60) + (isFinite(Number(m)) ? Number(m) : 0);

    return sign === '+' ? minutes : -minutes;
}

function dayOfWeek(year: number, month: number, day: number) {
    const d = new Date(Date.UTC(year, month, day));

    if (year < 100 && year >= 0) {
        d.setUTCFullYear(d.getUTCFullYear() - 1900);
    }

    return d.getUTCDay();
}

function isoDayOfWeek(year: number, month: number, day: number) {
    const d = dayOfWeek(year, month, day);
    return d === 0 ? 7 : d;
}

const nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

export function computeOrdinal({year, month, date}: {year: number; month: number; date: number}) {
    return date + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month];
}

export function uncomputeOrdinal({year, ordinal}: {year: number; ordinal: number}) {
    const table = isLeapYear(year) ? leapLadder : nonLeapLadder,
        month = table.findIndex((i) => i < ordinal),
        day = ordinal - table[month];
    return {month, date: day};
}

export function gregorianToOrdinal(gregData: {year: number; month: number; date: number}) {
    const {year, month, date} = gregData;
    const ordinal = computeOrdinal({year, month, date});
    return {year, ordinal};
}

export function isoWeekdayToLocal(isoWeekday: number, startOfWeek: number) {
    return ((isoWeekday - startOfWeek + 7) % 7) + 1;
}

export function gregorianToWeek(
    dateObj: DateObject,
    minDaysInFirstWeek: number,
    startOfWeek: number,
) {
    const {year, month, date} = dateObj;
    const day = dayOfWeek(year, month, date);

    const {weekYear, weekNumber, weekday} = gregorianToWeekLocale(
        dateObj,
        minDaysInFirstWeek,
        startOfWeek,
    );

    const {
        weekYear: isoWeekYear,
        weekNumber: isoWeekNumber,
        weekday: isoWeekday,
    } = gregorianToWeekLocale(dateObj, 4, 1);

    return {
        day,
        weekYear,
        weekNumber,
        weekday: weekday - 1,
        isoWeekYear,
        isoWeekNumber,
        isoWeekday,
    };
}

function gregorianToWeekLocale(
    dateObj: DateObject,
    minDaysInFirstWeek: number,
    startOfWeek: number,
) {
    const {year, month, date} = dateObj;
    const isoWeekday = isoDayOfWeek(year, month, date);
    const weekday = isoWeekdayToLocal(isoWeekday, startOfWeek);

    const ordinal = computeOrdinal({year, month, date});
    let weekNumber = Math.floor((ordinal - weekday + 14 - minDaysInFirstWeek) / 7);
    let weekYear: number;

    if (weekNumber < 1) {
        weekYear = year - 1;
        weekNumber = weeksInWeekYear(weekYear, minDaysInFirstWeek, startOfWeek);
    } else if (weekNumber > weeksInWeekYear(year, minDaysInFirstWeek, startOfWeek)) {
        weekYear = year + 1;
        weekNumber = 1;
    } else {
        weekYear = year;
    }

    return {weekYear, weekNumber, weekday};
}

function firstWeekOffset(year: number, minDaysInFirstWeek: number, startOfWeek: number) {
    const fwdlw = isoWeekdayToLocal(isoDayOfWeek(year, 0, minDaysInFirstWeek), startOfWeek);
    return -fwdlw + minDaysInFirstWeek - 1;
}

export function weeksInWeekYear(weekYear: number, minDaysInFirstWeek = 4, startOfWeek = 1) {
    const weekOffset = firstWeekOffset(weekYear, minDaysInFirstWeek, startOfWeek);
    const weekOffsetNext = firstWeekOffset(weekYear + 1, minDaysInFirstWeek, startOfWeek);
    return (daysInYear(weekYear) - weekOffset + weekOffsetNext) / 7;
}

export function weekToGregorian(
    weekData: {
        weekYear: number;
        weekNumber: number;
        weekday: number;
    },
    minDaysInFirstWeek: number,
    startOfWeek: number,
) {
    const {weekYear, weekNumber, weekday} = weekData;
    const weekdayOfJan4 = isoWeekdayToLocal(
        isoDayOfWeek(weekYear, 0, minDaysInFirstWeek),
        startOfWeek,
    );
    const yearInDays = daysInYear(weekYear);

    let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 7 + minDaysInFirstWeek;
    let year: number;

    if (ordinal < 1) {
        year = weekYear - 1;
        ordinal += daysInYear(year);
    } else if (ordinal > yearInDays) {
        year = weekYear + 1;
        ordinal -= daysInYear(weekYear);
    } else {
        year = weekYear;
    }

    const {month, date} = uncomputeOrdinal({year, ordinal});
    return {year, month, date};
}

export function monthDiff(a: DateTime, b: DateTime): number {
    if (a.date() < b.date()) {
        // end-of-month calculations work correct when the start month has more
        // days than the end month.
        return -monthDiff(b, a);
    }
    // difference in months
    const wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
    // b is in (anchor - 1 month, anchor + 1 month)
    const anchor = a.add(wholeMonthDiff, 'months');
    let adjust: number;

    if (b.valueOf() - anchor.valueOf() < 0) {
        const anchor2 = a.add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b.valueOf() - anchor.valueOf()) / (anchor.valueOf() - anchor2.valueOf());
    } else {
        const anchor2 = a.add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b.valueOf() - anchor.valueOf()) / (anchor2.valueOf() - anchor.valueOf());
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}
