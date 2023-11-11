import isNumber from 'lodash/isNumber';
import {isDateTime} from '../dateTime';
import {normalizeDateComponents} from './utils';

import type {DateTimeInput, DurationInputObject, DurationUnit, InputObject} from '../typings';

const isoRegex =
    /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

export interface DurationObject {
    milliseconds: number;
    days: number;
    months: number;
}
// eslint-disable-next-line complexity
export function getDuration(amount: DateTimeInput, unit?: DurationUnit): DurationObject {
    let duration: DurationInputObject = {};
    let match: RegExpExecArray | null = null;
    if (amount === null || amount === undefined) {
    } else if (isDateTime(amount)) {
        duration[unit ? unit : 'milliseconds'] = amount.valueOf();
    } else if (isNumber(amount) || !isNaN(Number(amount))) {
        duration[unit ? unit : 'milliseconds'] = Number(amount);
    } else if (typeof amount === 'string' && (match = isoRegex.exec(amount))) {
        const sign = match[1] === '-' ? -1 : 1;
        duration = {
            y: parseIso(match[2]) * sign,
            M: parseIso(match[3]) * sign,
            w: parseIso(match[4]) * sign,
            d: parseIso(match[5]) * sign,
            h: parseIso(match[6]) * sign,
            m: parseIso(match[7]) * sign,
            s: parseIso(match[8]) * sign,
        };
    } else if (typeof amount === 'object') {
        duration = amount as InputObject;
    }

    const normalizedInput = normalizeDateComponents(duration);
    const years = normalizedInput.year || 0;
    const quarters = normalizedInput.quarter || 0;
    const months = normalizedInput.month || 0;
    const weeks = normalizedInput.weekNumber || normalizedInput.isoWeekNumber || 0;
    const days = normalizedInput.day || 0;
    const hours = normalizedInput.hour || 0;
    const minutes = normalizedInput.minute || 0;
    const seconds = normalizedInput.second || 0;
    const milliseconds = normalizedInput.millisecond || 0;

    const _milliseconds =
        milliseconds + seconds * 1000 + minutes * 1000 * 60 + hours * 1000 * 60 * 60;
    const _days = Number(days) + weeks * 7;
    const _months = Number(months) + quarters * 3 + years * 12;

    return {
        milliseconds: _milliseconds,
        days: _days,
        months: _months,
    };
}

function parseIso(inp: string) {
    const res = inp ? parseFloat(inp.replace(',', '.')) : 0;
    return isNaN(res) ? 0 : res;
}
