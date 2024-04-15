// Copyright 2015 Grafana Labs
// Copyright 2021 YANDEX LLC

import {dateTime, isDateTime} from '../dateTime';
import {settings} from '../settings';
import type {DateTime, DateTimeOptionsWhenParsing, DateTimeParser} from '../typings';

export function isLikeRelative(text: unknown): text is string {
    return typeof text === 'string' && settings.getRelativeParser().isLikeRelative(text);
}

const parseInput: DateTimeParser<DateTimeOptionsWhenParsing> = (
    input,
    options,
): DateTime | undefined => {
    if (isLikeRelative(input)) {
        const allowRelative = options?.allowRelative ?? true;

        if (!allowRelative) {
            return undefined;
        }

        const parser = settings.getRelativeParser();
        return parser.parse(input, options);
    }

    const {format, lang} = options || {};
    const date = dateTime({input, format, lang, timeZone: options?.timeZone});

    return date.isValid() ? date : undefined;
};

/**
 * Parses a number, text or Date to a DateTime value. If a timeZone is supplied the incoming value
 * is parsed with that timeZone as a base.
 *
 * It can also parse the relative date and time format, e.g. now-6h will be parsed as Date.now() - 6 hours and
 * returned as a valid DateTime value.
 *
 * If no options are supplied, then default values are used. For more details please see DateTimeOptionsWhenParsing.
 *
 * @param input - should be a parsable date and time input.
 * @param options
 */
export const dateTimeParse: DateTimeParser<DateTimeOptionsWhenParsing> = (
    input,
    options,
): DateTime | undefined => {
    if (!input) {
        return undefined;
    }

    const date = parseInput(input, options);

    return date;
};

/**
 * Checks if value is a valid date which in this context means that it is either
 * a DateTime instance or it can be parsed by parse function.
 * @param value value to parse.
 */
export function isValid(value?: string | DateTime): boolean {
    if (isDateTime(value)) {
        return value.isValid();
    }

    const date = dateTimeParse(value, {allowRelative: true});

    if (!date) {
        return false;
    }

    return date.isValid();
}
