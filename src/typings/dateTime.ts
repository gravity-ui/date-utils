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
    isAfter: (input?: DateTimeInput) => boolean;
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
    utc: (keepLocalTime?: boolean) => DateTime;
    utcOffset: (offset?: number, keepLocalTime?: boolean) => DateTime;
    daysInMonth: () => number;
    date(): number;
    date(value: number): DateTime;
    month(): number;
    month(value: number): DateTime;
    year(): number;
    year(value: number): DateTime;
    day(): number;
    day(value: number): DateTime;
    hour(): number;
    hour(value: number): DateTime;
    minute(): number;
    minute(value: number): DateTime;
    second(): number;
    second(value: number): DateTime;
    millisecond(): number;
    millisecond(value: number): DateTime;
}
