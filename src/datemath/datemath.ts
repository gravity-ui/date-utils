// Copyright 2015 Grafana Labs
// Copyright 2021 YANDEX LLC

import {dateTime} from '../dateTime';
import type {DateTime, DurationUnit, TimeZone} from '../typings';

const units: DurationUnit[] = ['y', 'Q', 'M', 'w', 'd', 'h', 'm', 's'];

export function isLikeRelative(text: string) {
    return text.startsWith('now');
}

export interface ParseOptions {
    roundUp?: boolean;
    timeZone?: TimeZone;
}

export function parse(text: string, options: ParseOptions = {}): DateTime | undefined {
    if (!text) {
        return undefined;
    }

    const {roundUp, timeZone} = options;

    let time;
    let mathString = '';
    let index;
    let parseString;

    if (text.substring(0, 3) === 'now') {
        time = dateTime({timeZone});
        mathString = text.substring('now'.length);
    } else {
        index = text.indexOf('||');

        if (index === -1) {
            parseString = text;
            mathString = '';
        } else {
            parseString = text.substring(0, index);
            mathString = text.substring(index + 2);
        }

        time = dateTime({input: parseString, timeZone});
    }

    if (!time.isValid()) {
        return undefined;
    }

    if (!mathString.length) {
        return time;
    }

    return parseDateMath(mathString, time, roundUp);
}

export function parseDateMath(
    mathString: string,
    time: DateTime,
    roundUp?: boolean,
): DateTime | undefined {
    const strippedMathString = mathString.replace(/\s/g, '');
    let resultTime = time;
    let i = 0;
    const len = strippedMathString.length;

    while (i < len) {
        const c = strippedMathString.charAt(i++);
        let type;
        let num;

        if (c === '/') {
            type = 0;
        } else if (c === '+') {
            type = 1;
        } else if (c === '-') {
            type = 2;
        } else {
            return undefined;
        }

        if (isNaN(parseInt(strippedMathString.charAt(i), 10))) {
            num = 1;
        } else if (strippedMathString.length === 2) {
            num = parseInt(strippedMathString.charAt(i), 10);
        } else {
            const numFrom = i;
            while (!isNaN(parseInt(strippedMathString.charAt(i), 10))) {
                i++;
                if (i > 10) {
                    return undefined;
                }
            }
            num = parseInt(strippedMathString.substring(numFrom, i), 10);
        }

        if (type === 0) {
            // rounding is only allowed on whole, single, units (eg M or 1M, not 0.5M or 2M)
            if (num !== 1) {
                return undefined;
            }
        }

        const unit = strippedMathString.charAt(i++) as DurationUnit;

        if (units.includes(unit)) {
            if (type === 0) {
                if (roundUp) {
                    resultTime = resultTime.endOf(unit);
                } else {
                    resultTime = resultTime.startOf(unit);
                }
            } else if (type === 1) {
                resultTime = resultTime.add(num, unit);
            } else if (type === 2) {
                resultTime = resultTime.subtract(num, unit);
            }
        } else {
            return undefined;
        }
    }

    return resultTime;
}
