import type {Locale, RelativeTime} from '../settings/types';
import type {BaseUnit, DateTime, DateTimeInput} from '../typings';

import {dateTime} from './dateTime';

export interface RelativeTimeThreshold {
    l: Exclude<keyof RelativeTime, 'future' | 'past'>;
    r: number;
    d?: BaseUnit;
}

const thresholds: RelativeTimeThreshold[] = [
    {l: 's', r: 44, d: 'second'},
    {l: 'm', r: 89},
    {l: 'mm', r: 44, d: 'minute'},
    {l: 'h', r: 89},
    {l: 'hh', r: 21, d: 'hour'},
    {l: 'd', r: 35},
    {l: 'dd', r: 25, d: 'day'},
    {l: 'M', r: 45},
    {l: 'MM', r: 10, d: 'month'},
    {l: 'y', r: 17},
    {l: 'yy', r: Infinity, d: 'year'},
];

const relObj = {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
} satisfies RelativeTime;

export function fromTo(
    date: DateTime,
    input: DateTimeInput,
    loc: Locale['relativeTime'] = relObj,
    withoutSuffix = false,
    isFrom = true,
): string {
    let result = 0;
    let isFuture;
    let out = '';
    for (let i = 0; i < thresholds.length; i += 1) {
        let t = thresholds[i];
        if (t.d) {
            result = isFrom ? date.diff(input, t.d, true) : dateTime({input}).diff(date, t.d, true);
        }
        const abs = Math.round(Math.abs(result));
        isFuture = result > 0;
        if (abs <= t.r) {
            if (abs <= 1 && i > 0) t = thresholds[i - 1]; // 1 minutes -> a minute, 0 seconds -> 0 second
            const format = loc[t.l];
            if (typeof format === 'string') {
                out = format.replace('%d', `${abs}`);
            } else {
                out = format(abs, withoutSuffix, t.l, isFuture);
            }
            break;
        }
    }
    if (withoutSuffix) return out;
    const pastOrFuture = isFuture ? loc.future : loc.past;
    if (typeof pastOrFuture === 'function') {
        return pastOrFuture(out);
    }
    return pastOrFuture.replace('%s', out);
}
