// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import type {Locale} from '../locale/types';
import {fullYearFromTwoDigitYear, parseMilliseconds, signedOffset} from '../utils';
import type {DateObject} from '../utils';

import {expandFormat, formattingTokens, removeFormattingTokens} from './format';

export interface ParseToken<Token extends string, Output> {
    token: Token;
    regex: RegExp;
    deserialize: (input: RegExpMatchArray) => Output;
}

function escapeToken(token: string) {
    return token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function digitRegexp(_locale: Locale, append = '') {
    // TODO: support numbering system other than latn
    return new RegExp(`\\d${append}`);
}

function parseDigit(s: string, _locale: Locale) {
    // TODO: support numbering system other than latn
    return parseInt(s, 10);
}

function intUnit<Token extends string>(
    token: Token,
    locale: Locale,
    append = '',
    post: (input: number) => number = (x) => x,
) {
    return {
        token,
        regex: digitRegexp(locale, append),
        deserialize: (match) => post(parseDigit(`${match.shift()}`, locale)),
    } satisfies ParseToken<Token, number>;
}

const NBSP = String.fromCharCode(160);
const spaceOrNBSPRegExp = RegExp(`[ ${NBSP}]`, 'g');

function prepareForSearch(s: string) {
    return s.replace(spaceOrNBSPRegExp, spaceOrNBSPRegExp.source).replace(/\./g, '\\.?');
}

function stripInconsistencies(s: string) {
    return s.replace(spaceOrNBSPRegExp, ' ').replace(/\./g, '').toLowerCase();
}

function oneOf<Token extends string>(token: Token, values: string[]) {
    return {
        token,
        regex: new RegExp(`${values.map(prepareForSearch).join('|')}`),
        deserialize: (match) => {
            const s = `${match.shift()}`;
            const sStripped = stripInconsistencies(s);
            return values.findIndex((v) => stripInconsistencies(v) === sStripped);
        },
    } satisfies ParseToken<Token, number>;
}
function simple<Token extends string>(token: Token, regex: RegExp) {
    return {
        token,
        regex,
        deserialize: ([s]) => s,
    } satisfies ParseToken<Token, string>;
}

function getTokenUnit(token: string, locale: Locale) {
    switch (token) {
        case 'Y': {
            return intUnit('year', locale, '{1,6}');
        }
        case 'YY': {
            return intUnit('year', locale, '{2,4}', fullYearFromTwoDigitYear);
        }
        case 'YYYY': {
            return intUnit('year', locale, '{4}');
        }
        case 'YYYYY': {
            return intUnit('year', locale, '{4,6}');
        }
        case 'YYYYYY': {
            return intUnit('year', locale, '{6}');
        }
        case 'Q': {
            return intUnit('quarter', locale, '{1}');
        }
        case 'Qo': {
            return locale.ordinalParseUnit('quarter');
        }
        case 'M': {
            return intUnit('month', locale, '{1,2}', (n) => n - 1);
        }
        case 'MM': {
            return intUnit('month', locale, '{2}', (n) => n - 1);
        }
        case 'MMM': {
            return oneOf('month', locale.months('short'));
        }
        case 'MMMM': {
            return oneOf('month', locale.months('long'));
        }
        case 'Mo': {
            return locale.ordinalParseUnit('month');
        }
        case 'D': {
            return intUnit('date', locale, '{1,2}');
        }
        case 'DD': {
            return intUnit('date', locale, '{2}');
        }
        case 'Do': {
            return locale.ordinalParseUnit('date');
        }
        case 'DDD': {
            return intUnit('dayOfYear', locale, '{1,3}');
        }
        case 'DDDD': {
            return intUnit('dayOfYear', locale, '{3}');
        }
        case 'DDDo': {
            return locale.ordinalParseUnit('dayOfYear');
        }
        case 'd': {
            return intUnit('weekday', locale, '{1}');
        }
        case 'do': {
            return locale.ordinalParseUnit('weekday');
        }
        case 'dd': {
            return oneOf('weekday', locale.weekdays('narrow'));
        }
        case 'ddd': {
            return oneOf('weekday', locale.weekdays('short'));
        }
        case 'dddd': {
            return oneOf('weekday', locale.weekdays('long'));
        }
        case 'w': {
            return intUnit('weekNumber', locale, '{1,2}');
        }
        case 'ww': {
            return intUnit('weekNumber', locale, '{2}');
        }
        case 'wo': {
            return locale.ordinalParseUnit('weekNumber');
        }
        case 'gg': {
            return intUnit('weekYear', locale, '{2,4}', fullYearFromTwoDigitYear);
        }
        case 'gggg': {
            return intUnit('weekYear', locale, '{4}');
        }
        case 'H': {
            return intUnit('hour', locale, '{1,2}');
        }
        case 'HH': {
            return intUnit('hour', locale, '{2}');
        }
        case 'h': {
            return intUnit('hour12', locale, '{1,2}');
        }
        case 'hh': {
            return intUnit('hour12', locale, '{2}');
        }
        case 'k': {
            return intUnit('hour', locale, '{1,2}', (n) => (n === 24 ? 0 : n));
        }
        case 'kk': {
            return intUnit('hour', locale, '{2}', (n) => (n === 24 ? 0 : n));
        }
        case 'm': {
            return intUnit('minute', locale, '{1,2}');
        }
        case 'mm': {
            return intUnit('minute', locale, '{2}');
        }
        case 's': {
            return intUnit('second', locale, '{1,2}');
        }
        case 'ss': {
            return intUnit('second', locale, '{2}');
        }
        case 'S': {
            return intUnit('millisecond', locale, '{1}', (n) => 100 * n);
        }
        case 'SS': {
            return intUnit('millisecond', locale, '{2}', (n) => 10 * n);
        }
        case 'SSS': {
            return intUnit('millisecond', locale, '{3}');
        }
        case 'SSSS': {
            return simple('millisecondStr', digitRegexp(locale, '{1,4}'));
        }
        case 'SSSSS': {
            return simple('millisecondStr', digitRegexp(locale, '{1,5}'));
        }
        case 'SSSSSS': {
            return simple('millisecondStr', digitRegexp(locale, '{1,6}'));
        }
        case 'SSSSSSS': {
            return simple('millisecondStr', digitRegexp(locale, '{1,7}'));
        }
        case 'SSSSSSSS': {
            return simple('millisecondStr', digitRegexp(locale, '{1,8}'));
        }
        case 'SSSSSSSSS': {
            return simple('millisecondStr', digitRegexp(locale, '{1,9}'));
        }
        case 'a': {
            return oneOf('meridiemShort', locale.meridiems('short'));
        }
        case 'A': {
            return oneOf('meridiemLong', locale.meridiems('long'));
        }
        case 'z': {
            return simple('timezone', /[a-z_+-/]{1,256}?/);
        }
        case 'Z': {
            return {
                token: 'offset',
                regex: new RegExp(
                    `([+-]${digitRegexp(locale, '{1,2}').source})(?::(${digitRegexp(locale, '{2}').source}))?`,
                ),
                deserialize: (match: RegExpMatchArray) => {
                    const [, h, m] = match;
                    match.shift();
                    match.shift();
                    match.shift();
                    return signedOffset(h, m);
                },
            };
        }
        case 'ZZ': {
            return {
                token: 'offset',
                regex: new RegExp(
                    `([+-]${digitRegexp(locale, '{1,2}').source})(${digitRegexp(locale, '{2}').source})?`,
                ),
                deserialize: (match: RegExpMatchArray) => {
                    const [, h, m] = match;
                    match.shift();
                    match.shift();
                    match.shift();
                    return signedOffset(h, m);
                },
            };
        }
    }
    return {
        token: 'literal',
        regex: new RegExp(escapeToken(removeFormattingTokens(token))),
        deserialize: (match) => `${match.shift()}`,
    } satisfies ParseToken<'literal', string>;
}

type Unit = ReturnType<typeof getTokenUnit>;
type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
    x: infer I,
) => void
    ? I
    : never;

type UnionMatches<T> =
    T extends ParseToken<infer Token, infer Output> ? {[K in Token]: Output} : never;
type Prettify<T> = {[K in keyof T]: T[K]} & {};
type Matches = Prettify<UnionToIntersection<UnionMatches<Unit>>>;

interface ExtractedDateObject extends Partial<DateObject> {
    dayOfYear?: number;
    weekYear?: number;
    weekNumber?: number;
    weekday?: number;
}

function toDateField(token: string): keyof ExtractedDateObject | undefined {
    switch (token) {
        case 'year':
        case 'month':
        case 'dayOfYear':
        case 'weekYear':
        case 'weekNumber':
        case 'weekday':
        case 'date':
        case 'hour':
        case 'minute':
        case 'second':
        case 'millisecond': {
            return token;
        }
    }

    return undefined;
}

export function parseDateStringWithFormat(input: string, format: string, locale: Locale) {
    const tokens = expandFormat(format, locale.longDateFormat).match(formattingTokens) || [];
    const matches: Partial<Matches> = {};

    const units = tokens.map((token) => getTokenUnit(token, locale));
    const re = `^${units.map((unit) => `(${unit.regex.source})`).join('')}$`;

    const match = input.match(new RegExp(re, 'i'));
    if (!match) {
        return [{}, null] as const;
    }
    match.shift();
    for (const unit of units) {
        Object.assign(matches, {[unit.token]: unit.deserialize(match)});
    }

    if (matches.millisecondStr) {
        matches.millisecond = parseMilliseconds(matches.millisecondStr);
    }

    if (matches.hour12 !== undefined) {
        matches.hour = matches.hour12;
        if (matches.meridiemLong !== undefined || matches.meridiemShort !== undefined) {
            const length = matches.meridiemLong === undefined ? 'short' : 'long';
            const meridiemIndex = matches.meridiemLong ?? matches.meridiemShort ?? 0;
            const meridiem = locale.meridiems(length)[meridiemIndex];
            if (locale.meridiem(matches.hour, length) !== meridiem) {
                matches.hour = (matches.hour + 12) % 24;
                if (locale.meridiem(matches.hour, length) !== meridiem) {
                    matches.hour = NaN;
                }
            }
        }
    }

    if (matches.quarter) {
        matches.month = 3 * (matches.quarter - 1);
    }

    const output: ExtractedDateObject = {};
    for (const token of Object.keys(matches)) {
        const field = toDateField(token);
        if (field) {
            output[field] = matches[field];
        }
    }

    const zoneOrOffset = matches.offset ?? matches.timezone ?? null;

    return [output, zoneOrOffset] as const;
}
