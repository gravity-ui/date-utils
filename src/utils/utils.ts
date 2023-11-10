import type {SetObject} from '../typings';

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

export function daysInMonth(year: number, month: number): number {
    const modMonth = floorMod(month, 12),
        modYear = year + (month - modMonth) / 12;

    if (modMonth === 1) {
        return isLeapYear(modYear) ? 29 : 28;
    } else {
        return [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth];
    }
}

export function tsToObject(ts: number, offset: number) {
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
export function objToTS(obj: Record<keyof ReturnType<typeof tsToObject>, number>) {
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
        d.setUTCFullYear(obj.year, obj.month - 1, obj.date);

        return d.valueOf();
    }
    return ts;
}

type NormalizedUnit =
    | 'year'
    | 'month'
    | 'date'
    | 'day'
    | 'hour'
    | 'minute'
    | 'second'
    | 'millisecond'
    | 'quarter'
    | 'weekNumber'
    | 'isoWeekNumber'
    | 'isoWeekday';

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
    w: 'weekNumber',
    week: 'weekNumber',
    weeks: 'weekNumber',
    W: 'isoWeekNumber',
    isoweek: 'isoWeekNumber',
    isoweeks: 'isoWeekNumber',
    E: 'isoWeekday',
    isoweekday: 'isoWeekday',
    isoweekdays: 'isoWeekday',
} as const;

function normalizeComponent(component: string) {
    const unit = ['d', 'D', 'm', 'M', 'w', 'W', 'E', 'Q'].includes(component)
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

export function normalizeDateComponents(components: SetObject) {
    const normalized: Partial<Record<NormalizedUnit, number>> = {};
    for (const [c, v] of Object.entries(components)) {
        if (v === undefined || v === null) continue;
        normalized[normalizeComponent(c)] = asNumber(v);
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
