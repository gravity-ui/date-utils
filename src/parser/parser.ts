// Copyright 2015 Grafana Labs
// Copyright 2021 YANDEX LLC

import {dateTime, isDateTime} from '../dateTime';
import {settings} from '../settings';
import type {DateTime, DateTimeInput, DateTimeOptionsWhenParsing} from '../typings';

export function isLikeRelative(text: unknown): text is string {
    return typeof text === 'string' && settings.getRelativeParser().isLikeRelative(text);
}

function parseInput(
    input: DateTimeInput,
    options?: DateTimeOptionsWhenParsing,
): DateTime | undefined {
    if (isLikeRelative(input)) {
        const allowRelative = options?.allowRelative ?? true;

        if (!allowRelative) {
            return undefined;
        }

        const parser = settings.getRelativeParser();
        return parser.parse(input, options);
    }

    const {format, lang} = options || {};
    try {
        const date = dateTime({input, format, lang, timeZone: options?.timeZone});
        return date.isValid() ? date : undefined;
    } catch {
        return undefined;
    }
}
/**
 * Parses a number, text or `Date` to a `DateTime` value. If a timeZone is supplied the incoming value
 * is parsed with that timeZone as a base.
 *
 * It can also parse the relative date and time format, e.g. `'now-6h'` will be parsed as `Date.now() - 6 hours` and
 * returned as a valid `DateTime` value.
 */
export function dateTimeParse(
    input: unknown,
    options?: DateTimeOptionsWhenParsing,
): DateTime | undefined {
    if (input === undefined) {
        return undefined;
    }

    const date = parseInput(input, options);

    return date;
}
/**
 * Checks if value is a valid date which in this context means that it is either
 * a `DateTime` instance or it can be parsed by parse function.
 */
export function isValid(value?: string | DateTime): boolean {
    try {
        if (isDateTime(value)) {
            return value.isValid();
        }

        const date = dateTimeParse(value, {allowRelative: true});

        if (!date) {
            return false;
        }

        return date.isValid();
    } catch {
        return false;
    }
}
