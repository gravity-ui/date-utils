/**
 * Format of the string is based on Unicode Technical Standard #35: https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 *
 */

import {englishFormats} from '../constants';
import type {Locale, LongDateFormat} from '../locale/types';
import {settings} from '../settings';
import {parseZoneInfo} from '../timeZone';
import type {DateTime} from '../typings';

function getShortLocalizedFormatFromLongLocalizedFormat(format: string) {
    return format.replace(
        /(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,
        (_: string, escapeSequence: string, localizedFormat: string) =>
            escapeSequence || localizedFormat.slice(1),
    );
}

const localizedFormattingTokens = /(\[[^\]]*])|(LTS?|l{1,4}|L{1,4})/g;
export function expandFormat(
    format: string,
    formats: LongDateFormat = settings.getDefaultLocaleOptions().longDateFormat ?? englishFormats,
) {
    let result = format;
    for (let i = 0; i < 5; i++) {
        const expandedFormat = result.replace(
            localizedFormattingTokens,
            (_: string, escapeSequence: string, localizedFormat: keyof LongDateFormat) => {
                if (localizedFormat) {
                    const LongLocalizedFormat =
                        localizedFormat.toUpperCase() as keyof typeof englishFormats;
                    return (
                        formats[localizedFormat] ||
                        englishFormats[localizedFormat as keyof typeof englishFormats] ||
                        getShortLocalizedFormatFromLongLocalizedFormat(
                            formats[LongLocalizedFormat] || englishFormats[LongLocalizedFormat],
                        )
                    );
                }
                return escapeSequence;
            },
        );
        if (expandedFormat === result) {
            break;
        }
        result = expandedFormat;
    }
    return result;
}

export const FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ';

export const formattingTokens =
    /(\[[^[]*\])|([Hh]mm(ss)?|Mo|M{1,4}|Do|DDDo|D{1,4}|d{2,4}|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|Y{4,6}|YY?|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

const formatTokenFunctions: Record<
    string,
    (date: DateTime, locale: Locale, format: string) => string
> = {};

export function formatDate(date: DateTime, format = FORMAT_DEFAULT, locale: Locale) {
    const expandedFormat = expandFormat(format, locale.longDateFormat);
    return expandedFormat.replace(formattingTokens, (match: string) => {
        if (formatTokenFunctions[match]) {
            return formatTokenFunctions[match](date, locale, expandedFormat);
        }
        return removeFormattingTokens(match);
    });
}

export function removeFormattingTokens(input: string) {
    return input.replace(/^\[([\s\S)]*)\]$/g, '$1');
}

formatTokenFunctions['Y'] = (date) => {
    const y = date.year();
    return y <= 9999 ? zeroPad(y, 4) : '+' + y;
};

formatTokenFunctions['YY'] = (date) => {
    const y = date.year();
    return zeroPad(y % 100, 2);
};

formatTokenFunctions['YYYY'] = (date) => {
    return zeroPad(date.year(), 4);
};
formatTokenFunctions['YYYYY'] = (date) => {
    return zeroPad(date.year(), 5);
};
formatTokenFunctions['YYYYYY'] = (date) => {
    return zeroPad(date.year(), 6, true);
};

formatTokenFunctions['M'] = (date) => {
    return `${date.month() + 1}`;
};

formatTokenFunctions['MM'] = (date) => {
    return zeroPad(date.month() + 1, 2);
};

formatTokenFunctions['Mo'] = (date, locale) => {
    return locale.ordinal(date.month() + 1, 'month');
};

formatTokenFunctions['MMM'] = (date, locale, _format) => {
    const month = date.month();
    return locale.months('short')[month];
};

formatTokenFunctions['MMMM'] = (date, locale, _format) => {
    const month = date.month();
    return locale.months('long')[month];
};

formatTokenFunctions['w'] = (date) => {
    return `${date.week()}`;
};

formatTokenFunctions['ww'] = (date) => {
    return zeroPad(date.week(), 2);
};

formatTokenFunctions['wo'] = (date, locale) => {
    return locale.ordinal(date.week(), 'weekNumber');
};

formatTokenFunctions['W'] = (date) => {
    return `${date.isoWeek()}`;
};

formatTokenFunctions['WW'] = (date) => {
    return zeroPad(date.isoWeek(), 2);
};

formatTokenFunctions['Wo'] = (date, locale) => {
    return locale.ordinal(date.isoWeek(), 'weekNumber');
};

formatTokenFunctions['d'] = (date) => {
    return `${date.day()}`;
};

formatTokenFunctions['do'] = (date, locale) => {
    return locale.ordinal(date.day(), 'weekday');
};

formatTokenFunctions['dd'] = (date, locale, _format) => {
    const day = date.day();
    return locale.weekdays('narrow')[day];
};

formatTokenFunctions['ddd'] = (date, locale, _format) => {
    const day = date.day();
    return locale.weekdays('short')[day];
};

formatTokenFunctions['dddd'] = (date, locale, _format) => {
    const day = date.day();
    return locale.weekdays('long')[day];
};

formatTokenFunctions['e'] = (date) => {
    return `${date.weekday()}`;
};

formatTokenFunctions['E'] = (date) => {
    return `${date.isoWeekday()}`;
};

function hFormat(hours: number) {
    return hours % 12 || 12;
}

function kFormat(hours: number) {
    return hours || 24;
}

formatTokenFunctions['H'] = (date) => {
    return `${date.hour()}`;
};

formatTokenFunctions['HH'] = (date) => {
    return zeroPad(date.hour(), 2);
};

formatTokenFunctions['h'] = (date) => {
    return `${hFormat(date.hour())}`;
};

formatTokenFunctions['hh'] = (date) => {
    return zeroPad(hFormat(date.hour()), 2);
};

formatTokenFunctions['k'] = (date) => {
    return `${kFormat(date.hour())}`;
};

formatTokenFunctions['kk'] = (date) => {
    return zeroPad(kFormat(date.hour()), 2);
};

formatTokenFunctions['hmm'] = (date) => {
    return `${hFormat(date.hour())}${zeroPad(date.minute(), 2)}`;
};

formatTokenFunctions['hmmss'] = (date) => {
    return `${hFormat(date.hour())}${zeroPad(date.minute(), 2)}${zeroPad(date.second(), 2)}`;
};

formatTokenFunctions['Hmm'] = (date) => {
    return `${date.hour()}${zeroPad(date.minute(), 2)}`;
};

formatTokenFunctions['Hmmss'] = (date) => {
    return `${date.hour()}${zeroPad(date.minute(), 2)}${zeroPad(date.second(), 2)}`;
};

formatTokenFunctions['a'] = (date, locale) => {
    return locale.meridiem(date.hour(), 'short');
};

formatTokenFunctions['A'] = (date, locale) => {
    return locale.meridiem(date.hour(), 'long');
};

formatTokenFunctions['Z'] = (date) => {
    let offset = date.utcOffset();
    let sign = '+';
    if (offset < 0) {
        offset = -offset;
        sign = '-';
    }
    // eslint-disable-next-line no-bitwise
    return `${sign}${zeroPad(~~(offset / 60), 2)}:${zeroPad(~~offset % 60, 2)}`;
};

formatTokenFunctions['ZZ'] = (date) => {
    let offset = date.utcOffset();
    let sign = '+';
    if (offset < 0) {
        offset = -offset;
        sign = '-';
    }
    // eslint-disable-next-line no-bitwise
    return `${sign}${zeroPad(~~(offset / 60), 2)}${zeroPad(~~offset % 60, 2)}`;
};

formatTokenFunctions['Q'] = (date) => {
    return `${date.quarter()}`;
};

formatTokenFunctions['Qo'] = (date, locale) => {
    return locale.ordinal(date.quarter(), 'quarter');
};

formatTokenFunctions['D'] = (date) => {
    return `${date.date()}`;
};

formatTokenFunctions['DD'] = (date) => {
    return zeroPad(date.date(), 2);
};

formatTokenFunctions['Do'] = (date, locale) => {
    return locale.ordinal(date.date(), 'date');
};

formatTokenFunctions['m'] = (date) => {
    return `${date.minute()}`;
};

formatTokenFunctions['mm'] = (date) => {
    return zeroPad(date.minute(), 2);
};

formatTokenFunctions['s'] = (date) => {
    return `${date.second()}`;
};

formatTokenFunctions['ss'] = (date) => {
    return zeroPad(date.second(), 2);
};

formatTokenFunctions['S'] = (date) => {
    // eslint-disable-next-line no-bitwise
    return `${~~(date.millisecond() / 100)}`;
};

formatTokenFunctions['SS'] = (date) => {
    // eslint-disable-next-line no-bitwise
    return `${~~(date.millisecond() / 10)}`;
};

formatTokenFunctions['SSS'] = (date) => {
    return zeroPad(date.millisecond(), 3);
};

formatTokenFunctions['SSSS'] = (date) => {
    return zeroPad(date.millisecond() * 10, 4);
};

formatTokenFunctions['SSSSS'] = (date) => {
    return zeroPad(date.millisecond() * 100, 5);
};

formatTokenFunctions['SSSSSS'] = (date) => {
    return zeroPad(date.millisecond() * 1000, 6);
};

formatTokenFunctions['SSSSSSS'] = (date) => {
    return zeroPad(date.millisecond() * 10000, 7);
};

formatTokenFunctions['SSSSSSSS'] = (date) => {
    return zeroPad(date.millisecond() * 100000, 8);
};

formatTokenFunctions['SSSSSSSSS'] = (date) => {
    return zeroPad(date.millisecond() * 1000000, 9);
};

formatTokenFunctions['x'] = (date) => {
    return `${date.valueOf()}`;
};

formatTokenFunctions['X'] = (date) => {
    return `${date.unix()}`;
};

formatTokenFunctions['z'] = (date) => {
    return parseZoneInfo({
        ts: date.valueOf(),
        locale: date.locale(),
        timeZone: date.timeZone(),
        offsetFormat: 'short',
    });
};

formatTokenFunctions['zz'] = (date) => {
    return parseZoneInfo({
        ts: date.valueOf(),
        locale: date.locale(),
        timeZone: date.timeZone(),
        offsetFormat: 'long',
    });
};

formatTokenFunctions['DDD'] = (date) => {
    return `${date.dayOfYear()}`;
};

formatTokenFunctions['DDDD'] = (date) => {
    return zeroPad(date.dayOfYear(), 3);
};

formatTokenFunctions['DDDo'] = (date, locale) => {
    return locale.ordinal(date.dayOfYear(), 'dayOfYear');
};

formatTokenFunctions['gg'] = (date) => {
    return zeroPad(date.weekYear() % 100, 2);
};

formatTokenFunctions['gggg'] = (date) => {
    return zeroPad(date.weekYear(), 4);
};

formatTokenFunctions['ggggg'] = (date) => {
    return zeroPad(date.weekYear(), 5);
};

formatTokenFunctions['GG'] = (date) => {
    return zeroPad(date.isoWeekYear() % 100, 2);
};

formatTokenFunctions['GGGG'] = (date) => {
    return zeroPad(date.isoWeekYear(), 4);
};

formatTokenFunctions['GGGGG'] = (date) => {
    return zeroPad(date.isoWeekYear(), 5);
};

function zeroPad(number: number, targetLength: number, forceSign = false) {
    const absNumber = String(Math.abs(number));
    let sign = '';
    if (number < 0) {
        sign = '-';
    } else if (forceSign) {
        sign = '+';
    }

    return `${sign}${absNumber.padStart(targetLength, '0')}`;
}
