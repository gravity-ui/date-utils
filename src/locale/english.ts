import type {ParseToken} from '../dateTime/formatParse';

import type {RelativeTime} from './types';

export const monthsLong = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const monthsShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
export const monthsNarrow = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export const weekdaysLong = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];
export const weekdaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const weekdaysNarrow = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function meridiems(length: 'long' | 'short') {
    return length === 'short'
        ? ['AM', 'PM']
        : ['at night', 'the morning', 'noon', 'in the afternoon', 'the evening'];
}

export const erasLong = ['Before Christ', 'Anno Domini'];
export const erasShort = ['BC', 'AD'];
export const erasNarrow = ['B', 'A'];

export function months(length: 'long' | 'short' | 'narrow' | '2-digit' | 'numeric') {
    switch (length) {
        case 'long':
            return monthsLong;
        case 'short':
            return monthsShort;
        case 'narrow':
            return monthsNarrow;
        case '2-digit':
            return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        case 'numeric':
            return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        default:
            return monthsLong;
    }
}

export function weekdays(length: 'long' | 'short' | 'narrow') {
    switch (length) {
        case 'long':
            return weekdaysLong;
        case 'short':
            return weekdaysShort;
        case 'narrow':
            return weekdaysNarrow;
        default:
            return weekdaysLong;
    }
}

export function eras(length: 'long' | 'short' | 'narrow') {
    switch (length) {
        case 'long':
            return erasLong;
        case 'short':
            return erasShort;
        case 'narrow':
            return erasNarrow;
        default:
            return erasLong;
    }
}

export function meridiem(hour: number, length: 'long' | 'short') {
    const values = meridiems(length);
    if (length === 'short') {
        return values[hour < 12 ? 0 : 1];
    }

    if (hour < 6) {
        return values[0];
    }
    if (hour < 12) {
        return values[1];
    }
    if (hour === 12) {
        return values[2];
    }
    if (hour < 18) {
        return values[3];
    }
    if (hour < 21) {
        return values[4];
    }
    return values[0];
}

export function ordinal(n: number): string {
    const rem100 = n % 100;
    if (rem100 > 20 || rem100 < 10) {
        switch (rem100 % 10) {
            case 1: {
                return `${n}st`;
            }
            case 2: {
                return `${n}nd`;
            }
            case 3: {
                return `${n}rd`;
            }
        }
    }
    return `${n}th`;
}

export function ordinalParseUnit(
    unit: 'date' | 'weekday' | 'dayOfYear' | 'weekNumber' | 'month' | 'quarter',
) {
    return {
        token: unit,
        regex: /(\d+)(th|st|nd|rd)?/,
        deserialize: ([, s]) => Number(s),
    } satisfies ParseToken<typeof unit, number>;
}

export const relativeTime = {
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
