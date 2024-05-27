import {fixOffset, timeZoneOffset} from '../timeZone';
import type {InputObject} from '../typings';
import {normalizeComponent, normalizeDateComponents, objToTS, tsToObject} from '../utils';
import type {DateObject} from '../utils';

export function getTimestampFromArray(input: (number | string)[], timezone: string) {
    if (input.length === 0) {
        return getTimestampFromObject({}, timezone);
    }

    const dateParts = input.map(Number);
    const [year, month = 0, date = 1, hour = 0, minute = 0, second = 0, millisecond = 0] =
        dateParts;

    return getTimestampFromObject({year, month, date, hour, minute, second, millisecond}, timezone);
}

const defaultUnitValues = {
    year: 1,
    month: 1,
    date: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
} as const;
const orderedUnits = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'] as const;

export function getTimestampFromObject(
    input: InputObject,
    timezone: string,
): [ts: number, offset: number] {
    const normalized = normalizeDateComponents(input, normalizeComponent);
    normalized.date = normalized.day ?? normalized.date;

    const objNow = tsToObject(Date.now(), timeZoneOffset(timezone, Date.now()));
    let foundFirst = false;
    for (const unit of orderedUnits) {
        if (normalized[unit] !== undefined) {
            foundFirst = true;
        } else if (foundFirst) {
            normalized[unit] = defaultUnitValues[unit];
        } else {
            normalized[unit] = objNow[unit];
        }
    }
    const [ts, offset] = fixOffset(
        objToTS(normalized as DateObject),
        timeZoneOffset(timezone, Date.now()),
        timezone,
    );
    return [ts, offset];
}
