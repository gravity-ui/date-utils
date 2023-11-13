import {UtcTimeZone} from '../constants';
import dayjs from '../dayjs';
import type {TimeZone} from '../typings';

/**
 * Returns the user's time zone.
 */
export const guessUserTimeZone = () => dayjs.tz.guess();

/**
 * Returns all time zones.
 */
// remove when Intl definition is extended
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/49231
export const getTimeZonesList = (): string[] => Intl.supportedValuesOf?.('timeZone') || [];

export function isValidTimeZone(zone: string) {
    if (!zone) {
        return false;
    }

    try {
        new Intl.DateTimeFormat('en-US', {timeZone: zone}).format();
        return true;
    } catch {
        return false;
    }
}

const dateTimeFormatCache: Record<TimeZone, Intl.DateTimeFormat> = {};
function makeDateTimeFormat(zone: TimeZone) {
    if (!dateTimeFormatCache[zone]) {
        dateTimeFormatCache[zone] = new Intl.DateTimeFormat('en-US', {
            hour12: false,
            timeZone: zone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            era: 'short',
        });
    }
    return dateTimeFormatCache[zone];
}

const dateFields = [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'era',
] satisfies Intl.DateTimeFormatPartTypes[];
type DateField = (typeof dateFields)[number];
type DateParts = Record<Exclude<DateField, 'era'>, number> & {era: string};
export function timeZoneOffset(zone: TimeZone, ts: number) {
    const date = new Date(ts);
    if (isNaN(date.valueOf()) || !isValidTimeZone(zone)) {
        return NaN;
    }

    const dtf = makeDateTimeFormat(zone);
    const parts = Object.fromEntries(
        dtf
            .formatToParts(date)
            .filter(({type}) => dateFields.includes(type as DateField))
            .map(({type, value}) => [type, type === 'era' ? value : parseInt(value, 10)]),
    ) as DateParts;

    // Date.UTC(year), year: 0 — is 1 BC, -1 — is 2 BC, e.t.c
    const year = parts.era === 'BC' ? -Math.abs(parts.year) + 1 : parts.year;
    const month = parts.month - 1; // month is zero base index

    // https://bugs.chromium.org/p/chromium/issues/detail?id=1025564&can=2&q=%2224%3A00%22%20datetimeformat
    const hour = parts.hour === 24 ? 0 : parts.hour;

    let asUTC = Date.UTC(year, month, parts.day, hour, parts.minute, parts.second, 0);

    // years between 0 and 99 are interpreted as 19XX; revert that
    if (year < 100 && year >= 0) {
        const d = new Date(asUTC);
        d.setUTCFullYear(year, month, parts.day);
        asUTC = d.valueOf();
    }

    let asTS = date.valueOf();
    const over = asTS % 1000;
    asTS -= over >= 0 ? over : 1000 + over;
    return (asUTC - asTS) / (60 * 1000);
}

export function normalizeTimeZone(input: string | undefined, defaultZone: string) {
    if (input === undefined || input === null) {
        return defaultZone;
    }

    const lowered = input.toLowerCase();
    if (lowered === 'utc' || lowered === 'gmt') {
        return UtcTimeZone;
    }

    if (lowered === 'system') {
        return guessUserTimeZone();
    }

    if (lowered === 'default') {
        return defaultZone;
    }

    if (isValidTimeZone(input)) {
        return input;
    }

    throw new Error(`InvalidZone: ${input}`);
}

export function fixOffset(
    localTS: number,
    o: number,
    tz: string,
): [timestamp: number, offset: number] {
    // Our UTC time is just a guess because our offset is just a guess
    let utcGuess = localTS - o * 60 * 1000;

    // Test whether the zone matches the offset for this ts
    const o2 = timeZoneOffset(tz, utcGuess);

    // If so, offset didn't change and we're done
    if (o === o2) {
        return [utcGuess, o];
    }

    // If not, change the ts by the difference in the offset
    utcGuess -= (o2 - o) * 60 * 1000;

    // If that gives us the local time we want, we're done
    const o3 = timeZoneOffset(tz, utcGuess);
    if (o2 === o3) {
        return [utcGuess, o2];
    }

    // If it's different, we're in a hole time. The offset has changed, but we don't adjust the time
    return [localTS - Math.min(o2, o3) * 60 * 1000, Math.min(o2, o3)];
}
