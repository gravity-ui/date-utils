import type {InputObject} from '../typings';
import {normalizeComponent, normalizeDateComponents} from '../utils';

export function getTimestampFromArray(input: (number | string)[], utc = false) {
    if (input.length === 0) {
        return Date.now();
    }

    const dateParts = input.map(Number);
    let date: Date;
    const [year, month = 0, day = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0] =
        dateParts;
    if (utc) {
        date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
    } else {
        date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    }

    if (year >= 0 && year < 100) {
        if (utc) {
            date.setUTCFullYear(year, month, day);
        } else {
            date.setFullYear(year, month, day);
        }
    }

    return date.valueOf();
}

export function getTimestampFromObject(input: InputObject, utc = false) {
    if (Object.keys(input).length === 0) {
        return Date.now();
    }
    const normalized = normalizeDateComponents(input, normalizeComponent);
    normalized.day = normalized.day ?? normalized.date;
    const hasYear = normalized.year !== undefined;
    const hasMonth = normalized.month !== undefined;
    const hasDate = normalized.date !== undefined;

    const now = new Date(Date.now());
    const year = normalized.year ?? utc ? now.getUTCFullYear() : now.getFullYear();
    let month = normalized.month;
    if (month === undefined) {
        if (!hasYear && !hasDate) {
            month = utc ? now.getUTCMonth() : now.getMonth();
        } else {
            month = 0;
        }
    }
    let day = normalized.day;
    if (day === undefined) {
        if (!hasYear && !hasMonth) {
            day = utc ? now.getUTCDate() : now.getDate();
        } else {
            day = 1;
        }
    }
    const hours = normalized.hour ?? 0;
    const minutes = normalized.minute ?? 0;
    const seconds = normalized.second ?? 0;
    const milliseconds = normalized.millisecond ?? 0;

    return getTimestampFromArray([year, month, day, hours, minutes, seconds, milliseconds], utc);
}
