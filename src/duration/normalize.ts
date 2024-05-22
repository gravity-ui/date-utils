// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import type {DurationValues} from './duration';

const daysInYearAccurate = 146097.0 / 400;
const daysInMonthAccurate = 146097.0 / 4800;

const lowOrderMatrix = {
    weeks: {
        days: 7,
        hours: 7 * 24,
        minutes: 7 * 24 * 60,
        seconds: 7 * 24 * 60 * 60,
        milliseconds: 7 * 24 * 60 * 60 * 1000,
    },
    days: {
        hours: 24,
        minutes: 24 * 60,
        seconds: 24 * 60 * 60,
        milliseconds: 24 * 60 * 60 * 1000,
    },
    hours: {minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1000},
    minutes: {seconds: 60, milliseconds: 60 * 1000},
    seconds: {milliseconds: 1000},
};

const matrix = {
    years: {
        quarters: 4,
        months: 12,
        weeks: daysInYearAccurate / 7,
        days: daysInYearAccurate,
        hours: daysInYearAccurate * 24,
        minutes: daysInYearAccurate * 24 * 60,
        seconds: daysInYearAccurate * 24 * 60 * 60,
        milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000,
    },
    quarters: {
        months: 3,
        weeks: daysInYearAccurate / 28,
        days: daysInYearAccurate / 4,
        hours: (daysInYearAccurate * 24) / 4,
        minutes: (daysInYearAccurate * 24 * 60) / 4,
        seconds: (daysInYearAccurate * 24 * 60 * 60) / 4,
        milliseconds: (daysInYearAccurate * 24 * 60 * 60 * 1000) / 4,
    },
    months: {
        weeks: daysInMonthAccurate / 7,
        days: daysInMonthAccurate,
        hours: daysInMonthAccurate * 24,
        minutes: daysInMonthAccurate * 24 * 60,
        seconds: daysInMonthAccurate * 24 * 60 * 60,
        milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1000,
    },
    ...lowOrderMatrix,
};

export const orderedUnits = [
    'years',
    'quarters',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
] as const;

const reverseUnits = orderedUnits.slice(0).reverse();

export function normalizeValues(values: DurationValues, {roundUp}: {roundUp?: boolean} = {}) {
    const newValues: DurationValues = {...values};

    const factor = durationToMilliseconds(values) < 0 ? -1 : 1;

    let previous = null;
    for (let i = 0; i < reverseUnits.length; i++) {
        const current = reverseUnits[i];
        if (newValues[current] === undefined || newValues[current] === null) {
            continue;
        }
        if (!previous) {
            previous = current;
            continue;
        }

        const previousVal = (newValues[previous] ?? 0) * factor;
        // @ts-expect-error
        const conv = matrix[current][previous];

        // if (previousVal < 0):
        // lower order unit is negative (e.g. { years: 2, days: -2 })
        // normalize this by reducing the higher order unit by the appropriate amount
        // and increasing the lower order unit
        // this can never make the higher order unit negative, because this function only operates
        // on positive durations, so the amount of time represented by the lower order unit cannot
        // be larger than the higher order unit
        // else:
        // lower order unit is positive (e.g. { years: 2, days: 450 } or { years: -2, days: 450 })
        // in this case we attempt to convert as much as possible from the lower order unit into
        // the higher order one
        //
        // Math.floor takes care of both of these cases, rounding away from 0
        // if previousVal < 0 it makes the absolute value larger
        // if previousVal >= it makes the absolute value smaller
        const rollUp = Math.floor(previousVal / conv);
        newValues[current] = (newValues[current] ?? 0) + rollUp * factor;
        newValues[previous] = (newValues[previous] ?? 0) - rollUp * conv * factor;
        previous = current;
    }

    // try to convert any decimals into smaller units if possible
    // for example for { years: 2.5, days: 0, seconds: 0 } we want to get { years: 2, days: 182, hours: 12 }
    previous = null;
    for (let i = 0; i < orderedUnits.length; i++) {
        const current = orderedUnits[i];
        if (newValues[current] === undefined || newValues[current] === null) {
            continue;
        }
        if (!previous) {
            previous = current;
            continue;
        }

        const fraction = (newValues[previous] ?? 0) % 1;
        newValues[previous] = (newValues[previous] ?? 0) - fraction;
        // @ts-expect-error
        newValues[current] = (newValues[current] ?? 0) + fraction * matrix[previous][current];
        previous = current;
    }

    if (roundUp && previous && newValues[previous]) {
        newValues[previous] = Math.round(newValues[previous] ?? 0);
    }

    return newValues;
}

function durationToMilliseconds(values: DurationValues) {
    let sum = values.milliseconds ?? 0;
    for (const unit of reverseUnits.slice(1)) {
        const v = values[unit];
        if (v) {
            // @ts-expect-error
            sum += v * matrix[unit]['milliseconds'];
        }
    }
    return sum;
}

export function removeZeros<T extends Record<string, number>>(values: Partial<T>) {
    const newValues: Partial<T> = {};
    for (const [key, value] of Object.entries(values)) {
        if (value !== 0) {
            newValues[key as keyof T] = value;
        }
    }
    return newValues;
}

export function shiftTo(
    values: DurationValues,
    units: (keyof DurationValues)[],
    options?: {roundUp?: boolean},
) {
    if (!units.length) {
        return values;
    }
    const newValues: DurationValues = {};
    const accumulated: DurationValues = {};
    let lastUnit: keyof DurationValues | undefined;

    for (const unit of orderedUnits) {
        if (!units.includes(unit)) {
            if (values[unit]) {
                accumulated[unit] = values[unit];
            }
            continue;
        }
        lastUnit = unit;

        let own = 0;

        // anything we haven't boiled down yet should get boiled to this unit
        for (const ak of Object.keys(accumulated)) {
            // @ts-expect-error
            own += matrix[ak][unit] * accumulated[ak];
            accumulated[ak as keyof DurationValues] = 0;
        }

        // plus anything that's already in this unit
        const v = values[unit];
        if (v) {
            own += v;
        }

        // only keep the integer part for now in the hopes of putting any decimal part
        // into a smaller unit later
        const i = Math.trunc(own);
        newValues[unit] = i;
        accumulated[unit] = (own * 1000 - i * 1000) / 1000;
    }

    // lastUnit must be defined since units is not empty
    if (lastUnit) {
        // anything leftover becomes the decimal for the last unit
        for (const [key, value] of Object.entries(accumulated)) {
            if (value !== 0) {
                newValues[lastUnit] =
                    (newValues[lastUnit] ?? 0) +
                    (key === lastUnit
                        ? value
                        : // @ts-expect-error
                          value / matrix[lastUnit][key]);
            }
        }
        const v = newValues[lastUnit];
        if (v) {
            newValues[lastUnit] = Math.round(v * 1000) / 1000;
        }
    }

    return normalizeValues(newValues, options);
}

export function rescale(values: DurationValues, options?: {roundUp?: boolean}): DurationValues {
    const newValues = removeZeros(
        shiftTo(
            normalizeValues(values),
            ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'],
            options,
        ),
    );
    return newValues;
}
