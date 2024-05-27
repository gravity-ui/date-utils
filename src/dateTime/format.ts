import {englishFormats} from '../constants';
import {settings} from '../settings';
import type {Locale, LongDateFormat} from '../settings/types';
import {parseZoneInfo} from '../timeZone';
import type {DateTime} from '../typings';

function getShortLocalizedFormatFromLongLocalizedFormat(formatBis: string) {
    return formatBis.replace(
        /(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,
        (_: string, escapeSequence: string, localizedFormat: string) =>
            escapeSequence || localizedFormat.slice(1),
    );
}

export function expandFormat(
    format: string,
    formats: LongDateFormat = settings.getLocaleData().formats ?? englishFormats,
) {
    return format.replace(
        /(\[[^\]]*])|(LTS?|l{1,4}|L{1,4})/g,
        (_: string, escapeSequence: string, localizedFormat: keyof LongDateFormat) => {
            if (localizedFormat) {
                if (localizedFormat in englishFormats) {
                    return (
                        formats[localizedFormat] ||
                        englishFormats[localizedFormat as keyof typeof englishFormats]
                    );
                }
                const LongLocalizedFormat =
                    localizedFormat.toUpperCase() as keyof typeof englishFormats;
                return getShortLocalizedFormatFromLongLocalizedFormat(
                    formats[LongLocalizedFormat] || englishFormats[LongLocalizedFormat],
                );
            }
            return escapeSequence;
        },
    );
}

export const FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ';

const formattingTokens =
    /(\[[^[]*\])|([Hh]mm(ss)?|Mo|M{1,4}|Do|DDDo|D{1,4}|d{2,4}|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|Y{4,6}|YY?|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

const formatTokenFunctions: Record<
    string,
    (date: DateTime, locale: Locale, format: string) => string
> = {};

export function formatDate(
    date: DateTime,
    format = FORMAT_DEFAULT,
    locale = settings.getLocaleData(),
) {
    const expandedFormat = expandFormat(format, locale.formats);
    return expandedFormat.replace(formattingTokens, (match: string) => {
        if (formatTokenFunctions[match]) {
            return formatTokenFunctions[match](date, locale, expandedFormat);
        }
        return removeFormattingTokens(match);
    });
}

function removeFormattingTokens(input: string) {
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
    // dayjs locales ordinal method returns value inside brackets '[' ']'
    return removeFormattingTokens(`${locale.ordinal?.(date.month() + 1, 'M')}`);
};

formatTokenFunctions['MMM'] = (date, locale, format) => {
    const month = date.month();
    return getShort({
        date,
        format,
        data: locale.monthsShort,
        index: month,
        fullData: locale.months,
        maxLength: 3,
    });
};

formatTokenFunctions['MMMM'] = (date, locale, format) => {
    const month = date.month();
    return getShort({
        date,
        format,
        data: locale.months,
        index: month,
    });
};

formatTokenFunctions['w'] = (date) => {
    return `${date.week()}`;
};

formatTokenFunctions['ww'] = (date) => {
    return zeroPad(date.week(), 2);
};

formatTokenFunctions['wo'] = (date, locale) => {
    // dayjs locales ordinal method returns value inside brackets '[' ']'
    return removeFormattingTokens(`${locale.ordinal?.(date.week(), 'w')}`);
};

formatTokenFunctions['W'] = (date) => {
    return `${date.isoWeek()}`;
};

formatTokenFunctions['WW'] = (date) => {
    return zeroPad(date.isoWeek(), 2);
};

formatTokenFunctions['Wo'] = (date, locale) => {
    // dayjs locales ordinal method returns value inside brackets '[' ']'
    return removeFormattingTokens(`${locale.ordinal?.(date.isoWeek(), 'W')}`);
};

formatTokenFunctions['d'] = (date) => {
    return `${date.day()}`;
};

formatTokenFunctions['do'] = (date, locale) => {
    // dayjs locales ordinal method returns value inside brackets '[' ']'
    return removeFormattingTokens(`${locale.ordinal?.(date.day(), 'd')}`);
};

formatTokenFunctions['dd'] = (date, locale, format) => {
    const day = date.day();
    return getShort({
        date,
        format,
        data: locale.weekdaysMin,
        index: day,
        fullData: locale.weekdays,
        maxLength: 2,
    });
};

formatTokenFunctions['ddd'] = (date, locale, format) => {
    const day = date.day();
    return getShort({
        date,
        format,
        data: locale.weekdaysShort,
        index: day,
        fullData: locale.weekdays,
        maxLength: 3,
    });
};

formatTokenFunctions['dddd'] = (date, locale, format) => {
    const day = date.day();
    return getShort({
        date,
        format,
        data: locale.weekdays,
        index: day,
    });
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

function meridiem(hour: number, _minute: number, isLowercase: boolean) {
    const m = hour < 12 ? 'AM' : 'PM';
    return isLowercase ? m.toLowerCase() : m;
}

formatTokenFunctions['a'] = (date, locale) => {
    const func = locale.meridiem || meridiem;
    return func(date.hour(), date.minute(), true);
};

formatTokenFunctions['A'] = (date, locale) => {
    const func = locale.meridiem || meridiem;
    return func(date.hour(), date.minute(), false);
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
    // dayjs locales ordinal method returns value inside brackets '[' ']'
    return removeFormattingTokens(`${locale.ordinal?.(date.quarter(), 'Q')}`);
};

formatTokenFunctions['D'] = (date) => {
    return `${date.date()}`;
};

formatTokenFunctions['DD'] = (date) => {
    return zeroPad(date.date(), 2);
};

formatTokenFunctions['Do'] = (date, locale) => {
    // dayjs locales ordinal method returns value inside brackets '[' ']'
    return removeFormattingTokens(`${locale.ordinal?.(date.date(), 'D')}`);
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
    // dayjs locales ordinal method returns value inside brackets '[' ']'
    return removeFormattingTokens(`${locale.ordinal?.(date.dayOfYear(), 'DDD')}`);
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

function getShort({
    date,
    format,
    data,
    index,
    fullData,
    maxLength,
}: {
    date: DateTime;
    format: string;
    data?: string[] | ((date: DateTime, format: string) => string);
    index: number;
    fullData?: string[] | ((date: DateTime, format: string) => string);
    maxLength?: number;
}) {
    let value = '';
    if (data) {
        value = typeof data === 'function' ? data(date, format) : data[index];
    }

    if (!value && fullData) {
        value = typeof fullData === 'function' ? fullData(date, format) : fullData[index];
        if (value) {
            value = value.slice(0, maxLength);
        }
    }

    if (value) {
        return value;
    }

    throw new Error('Invalid locale data');
}

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
