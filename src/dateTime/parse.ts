import {fixOffset, timeZoneOffset} from '../timeZone';
import type {InputObject} from '../typings';
import {
    daysInMonth,
    daysInYear,
    gregorianToOrdinal,
    gregorianToWeek,
    normalizeComponent,
    normalizeDateComponents,
    objToTS,
    tsToObject,
    uncomputeOrdinal,
    weekToGregorian,
    weeksInWeekYear,
} from '../utils';
import type {DateObject} from '../utils';
import {getLocaleData, getLocaleWeekValues} from '../utils/locale';

export function getTimestampFromArray(
    input: (number | string)[],
    timezone: string,
    offset?: number,
) {
    if (input.length === 0) {
        return getTimestampFromObject({}, timezone, offset);
    }

    const dateParts = input.map(Number);
    const [year, month = 0, date = 1, hour = 0, minute = 0, second = 0, millisecond = 0] =
        dateParts;

    return getTimestampFromObject(
        {year, month, date, hour, minute, second, millisecond},
        timezone,
        offset,
    );
}

const defaultUnitValues = {
    year: 1,
    month: 0,
    date: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
} as const;
const defaultWeekUnitValues = {
    weekYear: 1,
    weekNumber: 1,
    weekday: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
} as const;
const defaultOrdinalUnitValues = {
    year: 1,
    dayOfYear: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
} as const;
const orderedUnits = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'] as const;
const orderedWeekUnits = [
    'weekYear',
    'weekNumber',
    'weekday',
    'hour',
    'minute',
    'second',
    'millisecond',
] as const;
const orderedOrdinalUnits = [
    'year',
    'dayOfYear',
    'hour',
    'minute',
    'second',
    'millisecond',
] as const;

type NormalizedInput = Partial<Record<ReturnType<typeof normalizeComponent>, number>>;

export function getTimestampFromObject(
    input: InputObject,
    timezone: string,
    offset?: number,
): [ts: number, offset: number] {
    let normalized = normalizeDateComponents(input, normalizeComponent);
    normalized.date = normalized.day ?? normalized.date;

    const definiteWeekStuff =
        normalized.weekNumber !== undefined || normalized.weekYear !== undefined;

    const containsDayOfYear = normalized.dayOfYear !== undefined;
    const containsYear = normalized.year !== undefined;
    const containsMonthOrDate = normalized.month !== undefined || normalized.date !== undefined;
    const containsYearOrMonthDay = containsYear || containsMonthOrDate;

    if ((containsYearOrMonthDay || containsDayOfYear) && definiteWeekStuff) {
        throw new Error("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
    }

    if (containsMonthOrDate && containsDayOfYear) {
        throw new Error("Can't mix ordinal dates with month/day");
    }

    const useWeekData = definiteWeekStuff || (normalized.weekday && !containsYearOrMonthDay);
    const isFixedOffset = offset !== undefined;
    const likelyOffset = isFixedOffset ? offset : timeZoneOffset(timezone, Date.now());

    let objNow: DateObject & typeof normalized = tsToObject(Date.now(), likelyOffset);

    if (useWeekData) {
        const localeData = getLocaleData('en'); // TODO: locale
        const {minDaysInFirstWeek, startOfWeek} = getLocaleWeekValues(localeData);
        objNow = {...objNow, ...gregorianToWeek(objNow, minDaysInFirstWeek, startOfWeek)};
        setDefaultValues(normalized, objNow, orderedWeekUnits, defaultWeekUnitValues);

        if (!isValidWeekData(normalized, minDaysInFirstWeek, startOfWeek)) {
            return [NaN, NaN];
        }

        normalized = {
            ...normalized,
            ...weekToGregorian(normalized, minDaysInFirstWeek, startOfWeek),
        };
    } else if (containsDayOfYear) {
        objNow = {...objNow, ...gregorianToOrdinal(objNow)};
        setDefaultValues(normalized, objNow, orderedOrdinalUnits, defaultOrdinalUnitValues);

        if (!isValidOrdinalData(normalized)) {
            return [NaN, NaN];
        }

        normalized = {
            ...normalized,
            ...uncomputeOrdinal({...normalized, ordinal: normalized.dayOfYear}),
        };
    } else {
        setDefaultValues(normalized, objNow, orderedUnits, defaultUnitValues);
    }

    if (!isValidDateData(normalized) || !isValidTimeData(normalized)) {
        return [NaN, NaN];
    }

    const ts = objToTS(normalized);
    if (isFixedOffset) {
        return [ts - offset * 60 * 1000, offset];
    }

    return fixOffset(ts, likelyOffset, timezone);
}

function setDefaultValues<T extends string, U extends T>(
    value: Partial<Record<T, number>>,
    now: Partial<Record<T, number>>,
    units: readonly U[],
    defaultValues: Record<U, number>,
) {
    let foundFirst = false;
    for (const unit of units) {
        if (value[unit] !== undefined) {
            foundFirst = true;
        } else if (foundFirst) {
            value[unit] = defaultValues[unit];
        } else {
            value[unit] = now[unit];
        }
    }
}

interface WeekData {
    weekYear: number;
    weekNumber: number;
    weekday: number;
}
function isValidWeekData(
    weekData: NormalizedInput,
    minDaysInFirstWeek = 4,
    startOfWeek = 1,
): weekData is WeekData {
    return (
        weekData.weekYear !== undefined &&
        weekData.weekNumber !== undefined &&
        weekData.weekday !== undefined &&
        Number.isInteger(weekData.weekYear) &&
        Number.isInteger(weekData.weekNumber) &&
        weekData.weekNumber >= 1 &&
        weekData.weekNumber <=
            weeksInWeekYear(weekData.weekYear, minDaysInFirstWeek, startOfWeek) &&
        Number.isInteger(weekData.weekday) &&
        weekData.weekday >= 1 &&
        weekData.weekday <= 7
    );
}

interface OrdinalData {
    year: number;
    dayOfYear: number;
}

function isValidOrdinalData(ordinalData: NormalizedInput): ordinalData is OrdinalData {
    return (
        ordinalData.year !== undefined &&
        ordinalData.dayOfYear !== undefined &&
        Number.isInteger(ordinalData.year) &&
        Number.isInteger(ordinalData.dayOfYear) &&
        ordinalData.dayOfYear >= 1 &&
        ordinalData.dayOfYear <= daysInYear(ordinalData.year)
    );
}

interface DateData {
    year: number;
    month: number;
    date: number;
}

function isValidDateData(dateData: NormalizedInput): dateData is DateData {
    return (
        dateData.year !== undefined &&
        dateData.month !== undefined &&
        dateData.date !== undefined &&
        Number.isInteger(dateData.year) &&
        Number.isInteger(dateData.month) &&
        dateData.month >= 0 &&
        dateData.month <= 11 &&
        Number.isInteger(dateData.date) &&
        dateData.date >= 1 &&
        dateData.date <= daysInMonth(dateData.year, dateData.month)
    );
}

interface TimeData {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

function isValidTimeData(timeData: NormalizedInput): timeData is TimeData {
    return (
        timeData.hour !== undefined &&
        timeData.minute !== undefined &&
        timeData.second !== undefined &&
        timeData.millisecond !== undefined &&
        Number.isInteger(timeData.hour) &&
        Number.isInteger(timeData.minute) &&
        Number.isInteger(timeData.second) &&
        Number.isInteger(timeData.millisecond) &&
        ((timeData.hour >= 0 && timeData.hour <= 23) ||
            (timeData.hour === 24 &&
                timeData.minute === 0 &&
                timeData.second === 0 &&
                timeData.millisecond === 0)) &&
        timeData.minute >= 0 &&
        timeData.minute <= 59 &&
        timeData.second >= 0 &&
        timeData.second <= 59 &&
        timeData.millisecond >= 0 &&
        timeData.millisecond <= 999
    );
}
