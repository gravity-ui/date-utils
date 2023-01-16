import type {ConfigTypeMap} from '../dayjs';

export type DateTimeInput =
    | ConfigTypeMap['objectSupport']
    | Date
    | string
    | number
    | Array<string | number>
    | DateTime
    | undefined;
export type FormatInput = string | undefined;

export type DurationUnit =
    | 'year'
    | 'years'
    | 'y'
    | 'month'
    | 'months'
    | 'M'
    | 'week'
    | 'weeks'
    | 'isoWeek'
    | 'w'
    | 'day'
    | 'days'
    | 'd'
    | 'hour'
    | 'hours'
    | 'h'
    | 'minute'
    | 'minutes'
    | 'm'
    | 'second'
    | 'seconds'
    | 's'
    | 'millisecond'
    | 'milliseconds'
    | 'ms'
    | 'quarter'
    | 'quarters'
    | 'Q';

export interface DateTime extends Object {
    add: (amount?: DateTimeInput, unit?: DurationUnit) => DateTime;
    set: (unit: DurationUnit, amount: DateTimeInput) => DateTime;
    diff: (amount: DateTimeInput, unit?: DurationUnit, truncate?: boolean) => number;
    endOf: (unitOfTime: DurationUnit) => DateTime;
    format: (formatInput?: FormatInput) => string;
    fromNow: (withoutSuffix?: boolean) => string;
    from: (formaInput: DateTimeInput) => string;
    isSame: (input?: DateTimeInput, granularity?: DurationUnit) => boolean;
    isBefore: (input?: DateTimeInput) => boolean;
    isValid: () => boolean;
    local: () => DateTime;
    locale: (locale: string) => DateTime;
    startOf: (unitOfTime: DurationUnit) => DateTime;
    subtract: (amount?: DateTimeInput, unit?: DurationUnit) => DateTime;
    toDate: () => Date;
    toISOString: (keepOffset?: boolean) => string;
    isoWeekday: (day?: number | string) => number | string;
    valueOf: () => number;
    unix: () => number;
    utc: () => DateTime;
    utcOffset: () => number;
    daysInMonth: () => number;
    date: () => number;
    month: () => number;
    year: () => number;
    day: () => number;
    hour: () => number;
    minute: () => number;
    second: () => number;
}
