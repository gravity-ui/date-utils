// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import {UtcTimeZone} from '../constants';
import * as English from '../locale/english';
import type {DateObject} from '../utils';

interface ExtractedDateObject extends Partial<DateObject> {
    weekYear?: number;
    weekNumber?: number;
    weekday?: number;
}

type Extractor = (
    m: RegExpExecArray,
) => [dateObj: ExtractedDateObject, timezoneOrOffset: string | number | null];

type PartialResult = [
    dateObj: ExtractedDateObject,
    timezoneOrOffset: string | number | null,
    cursor: number,
];
type PartialExtractor = (m: RegExpExecArray, cursor: number) => PartialResult;

function combineExtractors(...extractors: PartialExtractor[]): Extractor {
    return (m) => {
        const res = extractors.reduce<PartialResult>(
            ([dateObj, timezoneOffset, cursor], extractor) => {
                const [nextDateObj, nextTimezoneOffset, nextCursor] = extractor(m, cursor);
                return [
                    {...dateObj, ...nextDateObj},
                    nextTimezoneOffset ?? timezoneOffset,
                    nextCursor,
                ];
            },
            [{}, null, 1],
        );
        return [res[0], res[1]];
    };
}

function parse(input: string, ...patterns: [RegExp, Extractor][]) {
    if (!input) {
        return [null, null];
    }

    for (const [regex, extractor] of patterns) {
        const match = regex.exec(input);
        if (match) {
            return extractor(match);
        }
    }

    return [null, null];
}

// IANA time zone format: https://en.wikipedia.org/wiki/List_of_IANA_time_zones
const ianaRegex = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
// Z or ±00:00
const offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
const isoExtendedZone = `(?:${offsetRegex.source}?(?:\\[(${ianaRegex.source})\\])?)?`;
// hh:mm:ss.sss
const isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
const isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${isoExtendedZone}`);
const isoTimeOnly = RegExp(`^T?${isoTimeBaseRegex.source}$`);
// Thh:mm:ss.sss±00:00
const isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`);
// YYYY-MM-DD
const isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
// YYYY-Www-D
const isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
// YYYY-DDD
const isoOrdinalRegex = /(\d{4})-?(\d{3})/;

const isoYmdWithTimeExtensionRegex = new RegExp(
    `^${isoYmdRegex.source}${isoTimeExtensionRegex.source}$`,
);
const isoWeekWithTimeExtensionRegex = new RegExp(
    `^${isoWeekRegex.source}${isoTimeExtensionRegex.source}$`,
);
const isoOrdinalWithTimeExtensionRegex = new RegExp(
    `^${isoOrdinalRegex.source}${isoTimeExtensionRegex.source}$`,
);
const isoTimeFullRegex = new RegExp(`^${isoTimeRegex.source}$`);

// https://datatracker.ietf.org/doc/html/rfc2822#section-4.3
const obsOffsets = {
    GMT: 0,
    UT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60,
};

// RFC 2822/5322 https://datatracker.ietf.org/doc/html/rfc2822
// Fri, 19 Nov 82 16:14:55 GMT
const rfc2822 =
    /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;

function preprocessRFC2822(s: string) {
    // Remove comments and folding whitespace and replace multiple-spaces with a single space
    return s
        .replace(/\([^()]*\)|[\n\t]/g, ' ')
        .replace(/(\s\s+)/g, ' ')
        .trim();
}

function extractRfc2822(
    match: RegExpExecArray,
): [dateObj: ExtractedDateObject, timezoneOffset: number] {
    const [
        ,
        weekday,
        day,
        month,
        year,
        hour,
        minute,
        second,
        obsOffset,
        zeroOffset,
        offsetHours,
        offsetMinutes,
    ] = match;

    const result = stringsToDateObject(weekday, year, month, day, hour, minute, second);

    let offset: number;
    if (obsOffset) {
        offset = obsOffsets[obsOffset as keyof typeof obsOffsets];
    } else if (zeroOffset) {
        offset = 0;
    } else {
        const hours = parseInt(offsetHours, 10);
        const sign = hours < 0 || Object.is(hours, -0) ? -1 : 1;
        const minutes = parseInt(offsetMinutes, 10) || 0;
        offset = (hours || 0) * 60 + sign * minutes;
    }
    return [result, offset];
}

function extractISOYmd(match: RegExpExecArray, cursor: number): PartialResult {
    const item = {
        year: parseInteger(match[cursor]),
        month: parseInteger(match[cursor + 1], 1) - 1,
        day: parseInteger(match[cursor + 2], 1),
    };

    return [item, null, cursor + 3];
}
function extractISOTime(match: RegExpExecArray, cursor: number): PartialResult {
    const item = {
        hour: parseInteger(match[cursor], 0),
        minute: parseInteger(match[cursor + 1], 0),
        second: parseInteger(match[cursor + 2], 0),
        millisecond: parseMilliseconds(match[cursor + 3]),
    };

    return [item, null, cursor + 4];
}

function extractISOOffset(match: RegExpExecArray, cursor: number): PartialResult {
    const local = !match[cursor] && !match[cursor + 1];
    if (local) {
        return [{}, null, cursor + 3];
    }
    if (match[cursor]) {
        return [{}, 0, cursor + 3];
    }

    const fullOffset = signedOffset(match[cursor + 1], match[cursor + 2]);
    return [{}, fullOffset, cursor + 3];
}

function extractIANAZone(match: RegExpExecArray, cursor: number): PartialResult {
    const zone = match[cursor] || null;
    return [{}, zone, cursor + 1];
}

function extractISOWeekData(match: RegExpExecArray, cursor: number): PartialResult {
    const item = {
        weekYear: parseInteger(match[cursor]),
        weekNumber: parseInteger(match[cursor + 1], 1),
        weekday: parseInteger(match[cursor + 2], 1),
    };

    return [item, null, cursor + 3];
}
function extractISOOrdinalData(match: RegExpExecArray, cursor: number): PartialResult {
    const item = {
        year: parseInteger(match[cursor]),
        dayOfYear: parseInteger(match[cursor + 1], 1),
    };

    return [item, null, cursor + 2];
}

const extractISOYmdTimeAndOffset = combineExtractors(
    extractISOYmd,
    extractISOTime,
    extractISOOffset,
    extractIANAZone,
);

const extractISOWeekTimeAndOffset = combineExtractors(
    extractISOWeekData,
    extractISOTime,
    extractISOOffset,
    extractIANAZone,
);

const extractISOOrdinalDateAndTime = combineExtractors(
    extractISOOrdinalData,
    extractISOTime,
    extractISOOffset,
    extractIANAZone,
);

const extractISOTimeAndOffset = combineExtractors(
    extractISOTime,
    extractISOOffset,
    extractIANAZone,
);

// https://datatracker.ietf.org/doc/html/rfc1123#page-55
const rfc1123 =
    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/;
// https://datatracker.ietf.org/doc/html/rfc850#section-2.1.4
const rfc850 =
    /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/;
// Fri Nov 19 16:59:30 1982
const ascii =
    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;

function extractRFC1123Or850(
    match: RegExpExecArray,
): [dateObj: ExtractedDateObject, timezoneOffset: string] {
    const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match,
        result = stringsToDateObject(
            weekdayStr,
            yearStr,
            monthStr,
            dayStr,
            hourStr,
            minuteStr,
            secondStr,
        );
    return [result, UtcTimeZone];
}

function extractASCII(
    match: RegExpExecArray,
): [dateObj: ExtractedDateObject, timezoneOffset: string] {
    const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match,
        result = stringsToDateObject(
            weekdayStr,
            yearStr,
            monthStr,
            dayStr,
            hourStr,
            minuteStr,
            secondStr,
        );
    return [result, UtcTimeZone];
}

function parseInteger(str: string | undefined | null, defaultValue: number): number;
function parseInteger(str: string | undefined | null, defaultValue?: number): number | undefined;
function parseInteger(str: string | undefined | null, defaultValue?: number) {
    return str ? parseInt(str, 10) : defaultValue;
}

function parseMilliseconds(str: string | undefined | null) {
    return str ? Math.floor(parseFloat(`0.${str}`) * 1000) : undefined;
}

function signedOffset(offsetHours: string, offsetMinutes: string) {
    const hours = parseInt(offsetHours, 10);
    const sign = hours < 0 || Object.is(hours, -0) ? -1 : 1;
    const minutes = parseInt(offsetMinutes, 10) || 0;
    const offset = (hours || 0) * 60 + sign * minutes;

    return offset;
}

function stringsToDateObject(
    weekdayStr: string | undefined,
    yearStr: string,
    monthStr: string,
    dayStr: string,
    hourStr: string | undefined,
    minuteStr: string | undefined,
    secondStr: string | undefined,
) {
    const res: ExtractedDateObject = {
        year:
            yearStr.length === 2
                ? fullYearFromTwoDigitYear(parseInteger(yearStr))
                : parseInteger(yearStr),
        month:
            monthStr.length > 3
                ? English.monthsLong.indexOf(monthStr)
                : English.monthsShort.indexOf(monthStr),
        date: parseInteger(dayStr),
        hour: parseInteger(hourStr),
        minute: parseInteger(minuteStr),
        second: parseInteger(secondStr),
    };

    if (weekdayStr) {
        res.weekday =
            (weekdayStr.length > 3
                ? English.weekdaysLong.indexOf(weekdayStr)
                : English.weekdaysShort.indexOf(weekdayStr)) + 1;
    }

    return res;
}
function fullYearFromTwoDigitYear(year: number | undefined) {
    if (!year || year > 99) {
        return year;
    }

    // TODO: add two digit cutoff year to settings
    return year > 49 ? 1900 + year : 2000 + year;
}

export function parseISODate(s: string) {
    return parse(
        s,
        [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
        [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset],
        [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDateAndTime],
        [isoTimeFullRegex, extractISOTimeAndOffset],
    );
}

export function parseRFC2822Date(s: string) {
    return parse(preprocessRFC2822(s), [rfc2822, extractRfc2822]);
}

export function parseHTTPDate(s: string) {
    return parse(
        s,
        [rfc1123, extractRFC1123Or850],
        [rfc850, extractRFC1123Or850],
        [ascii, extractASCII],
    );
}

export function parseISOTimeOnly(s: string) {
    return parse(s, [isoTimeOnly, combineExtractors(extractISOTime)]);
}

export function parseDateString(input: string) {
    let [obj, offset] = parseISODate(input);
    if (obj !== null) {
        return [obj, offset] as const;
    }
    [obj, offset] = parseRFC2822Date(input);
    if (obj !== null) {
        return [obj, offset] as const;
    }
    [obj, offset] = parseHTTPDate(input);
    if (obj !== null) {
        return [obj, offset] as const;
    }
    [obj, offset] = parseISOTimeOnly(input);
    if (obj !== null) {
        return [obj, offset] as const;
    }

    return [{}, null] as const;
}
