// Copyright 2015 Grafana Labs
// Copyright 2023 gravity-ui

import dayjs from '../dayjs';
import {dateTime} from '../dateTime';
import {parse, isValid} from '../datemath';
import {DateTimeOptionsWhenParsing, DateTime, DateTimeParser} from '../typings';

const parseInput: DateTimeParser<DateTimeOptionsWhenParsing> = (
    input,
    options,
): DateTime | undefined => {
    if (typeof input === 'string' && input.indexOf('now') !== -1) {
        const allowRelative = options?.allowRelative ?? true;

        if (!isValid(input) || !allowRelative) {
            return undefined;
        }

        return parse(input, options?.roundUp, options?.timeZone);
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

    dayjs.tz.setDefault(options?.timeZone);

    const date = parseInput(input, options);

    dayjs.tz.setDefault();

    return date;
};
