import {UtcTimeZone} from '../constants';
import type {TimeZone} from '../typings';
import {getDateTimeFormat} from '../utils/locale';

/**
 * Returns the user's time zone.
 */
// eslint-disable-next-line new-cap
export const guessUserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Returns all time zones.
 */
// remove when Intl definition is extended
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/49231
export const getTimeZonesList = (): string[] => Intl.supportedValuesOf?.('timeZone') || [];

const validTimeZones: Record<TimeZone, boolean> = {};
export function isValidTimeZone(zone: string) {
    if (!zone) {
        return false;
    }

    if (Object.prototype.hasOwnProperty.call(validTimeZones, zone)) {
        return validTimeZones[zone];
    }

    try {
        new Intl.DateTimeFormat('en-US', {timeZone: zone}).format();
        validTimeZones[zone] = true;
        return true;
    } catch {
        validTimeZones[zone] = false;
        return false;
    }
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
function isDateField(v: string): v is DateField {
    return dateFields.includes(v as DateField);
}
export function timeZoneOffset(zone: TimeZone, ts: number) {
    const date = new Date(ts);
    if (isNaN(date.valueOf()) || (zone !== 'system' && !isValidTimeZone(zone))) {
        return NaN;
    }

    if (zone === 'system') {
        return -date.getTimezoneOffset() || 0;
    }

    const dtf = getDateTimeFormat('en-US', {
        hour12: false,
        timeZone: zone === 'system' ? undefined : zone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        era: 'short',
    });
    const formatted = dtf.formatToParts(date);
    const parts: DateParts = {
        year: 1,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        era: 'AD',
    };
    for (const {type, value} of formatted) {
        if (type === 'era') {
            parts.era = value;
        } else if (isDateField(type)) {
            parts[type] = parseInt(value, 10);
        }
    }

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
        return 'system';
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

export function parseZoneInfo({
    timeZone,
    ts,
    locale,
    offsetFormat,
}: {
    timeZone?: string;
    ts: number;
    locale: string;
    offsetFormat?: 'short' | 'long';
}) {
    const date = new Date(ts);
    const intlOpts: Intl.DateTimeFormatOptions = {
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };

    if (timeZone) {
        intlOpts.timeZone = normalizeTimeZone(timeZone, timeZone);
    }

    const modified = {timeZoneName: offsetFormat, ...intlOpts};

    const parsed = new Intl.DateTimeFormat(locale, modified)
        .formatToParts(date)
        .find((m) => m.type.toLowerCase() === 'timezonename');
    return parsed ? parsed.value : '';
}
