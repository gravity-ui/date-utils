import dayjs, {ConfigType} from '../dayjs';
import {DateTime, DateTimeInput, FormatInput, TimeZone} from '../typings';
import {STRICT, UtcTimeZone} from '../constants';
import {compareStrings} from '../utils';

export const createDateTime = (
    input?: DateTimeInput,
    format?: FormatInput,
    timeZone?: TimeZone,
) => {
    const date = format ? dayjs(input as ConfigType, format, STRICT) : dayjs(input as ConfigType);

    return (timeZone ? date.tz(timeZone) : date) as DateTime;
};

export const createUTCDateTime = (input?: DateTimeInput, format?: FormatInput) => {
    return (
        format ? dayjs.utc(input as ConfigType, format, STRICT) : dayjs.utc(input as ConfigType)
    ) as DateTime;
};

/**
 * Creates a DateTime instance.
 * @param opt
 * @param {DateTimeInput=} opt.input - input to parse.
 * @param {string=} opt.format - strict {@link https://dayjs.gitee.io/docs/en/display/format format} for parsing user's input.
 * @param {string=} opt.timeZone - specified {@link https://dayjs.gitee.io/docs/en/timezone/timezone time zone}.
 * @param {string=} opt.lang - specified locale.
 */
export const dateTime = (opt?: {
    input?: DateTimeInput;
    format?: FormatInput;
    timeZone?: TimeZone;
    lang?: string;
}): DateTime => {
    const {input, format, timeZone, lang} = opt || {};

    const prevLang = dayjs.locale();
    const shouldSetLocale = lang && prevLang !== lang;

    if (shouldSetLocale) {
        dayjs.locale(lang);
    }

    const date = compareStrings(timeZone, UtcTimeZone, {ignoreCase: true})
        ? createUTCDateTime(input, format)
        : createDateTime(input, format, timeZone);

    if (shouldSetLocale) {
        dayjs.locale(prevLang);
    }

    return date;
};

/**
 * Checks if value is DateTime.
 * @param {unknown} value - value to check.
 */
export const isDateTime = (value: unknown): value is DateTime => {
    return dayjs.isDayjs(value);
};
