// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import type {Duration, DurationInput, DurationInputObject, DurationUnit} from '../typings';
import {normalizeDateComponents, normalizeDurationUnit} from '../utils/utils';

import {DurationImpl, isDuration} from './duration';
import {removeZeros} from './normalize';

const isoRegex =
    /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9]+)(?:[.,]([0-9]+)?)?S)?)?$/;

interface Options {
    lang?: string;
}
export function createDuration(
    amount: DurationInput,
    unit?: DurationUnit,
    options?: Options,
): Duration;
export function createDuration(amount: DurationInput, options?: Options): Duration;
export function createDuration(
    amount: DurationInput,
    unit?: DurationUnit | Options,
    options: Options = {},
): Duration {
    let duration: DurationInputObject = {};
    let match: RegExpExecArray | null = null;
    const {lang} = unit && typeof unit === 'object' ? unit : options;
    const durationUnit = typeof unit === 'string' ? unit : 'milliseconds';
    if (isDuration(amount)) {
        return amount;
    } else if (!isNaN(Number(amount))) {
        duration[durationUnit] = Number(amount);
    } else if (typeof amount === 'string' && (match = isoRegex.exec(amount))) {
        const sign = match[1] === '-' ? -1 : 1;
        const secondsSign = match[8] && match[8][0] === '-' ? -1 : 1;
        duration = removeZeros({
            y: parseIso(match[2]) * sign,
            M: parseIso(match[3]) * sign,
            w: parseIso(match[4]) * sign,
            d: parseIso(match[5]) * sign,
            h: parseIso(match[6]) * sign,
            m: parseIso(match[7]) * sign,
            s: parseIso(match[8]) * sign,
            ms:
                Math.floor(parseIso(match[9] ? `0.${match[9]}` : match[9]) * 1000) *
                secondsSign *
                sign,
        });
    } else if (amount && typeof amount === 'object') {
        duration = amount;
    } else {
        throw new Error(`Unknown duration: ${amount}`);
    }

    return new DurationImpl({
        values: normalizeDateComponents(duration, normalizeDurationUnit),
        locale: lang,
    });
}

function parseIso(inp: string | undefined) {
    const res = inp ? parseFloat(inp.replace(',', '.')) : 0;
    return isNaN(res) ? 0 : res;
}
