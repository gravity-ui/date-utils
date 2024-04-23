import type {DurationInput, DurationUnit} from './duration';

export type DateTimeInput =
    | InputObject
    | Date
    | string
    | number
    | Array<string | number>
    | DateTime
    | null
    | undefined;
export type FormatInput = string | undefined;
export type BaseUnit =
    | 'year'
    | 'years'
    | 'y'
    | 'month'
    | 'months'
    | 'M'
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
    | 'ms';

export type QuarterUnit = 'quarter' | 'quarters' | 'Q';
export type WeekUnit = 'week' | 'weeks' | 'w';
type IsoWeekUnit = 'isoWeek' | 'isoWeeks'; // | 'W'; - not supported;
type DateUnit = 'date' | 'dates' | 'D';
export type StartOfUnit = BaseUnit | QuarterUnit | WeekUnit | IsoWeekUnit | DateUnit;
export type AllUnit =
    | BaseUnit
    | QuarterUnit
    | DateUnit
    | WeekUnit
    | IsoWeekUnit
    | 'isoWeekday'
    | 'isoWeekdays'
    | 'E';

export type InputObject = Partial<Record<BaseUnit | DateUnit, number>>;
export type SetObject = Partial<
    Record<
        | BaseUnit
        | QuarterUnit
        | DateUnit
        | WeekUnit
        | IsoWeekUnit
        | 'weekday'
        | 'weekdays'
        | 'e'
        | 'isoWeekday'
        | 'isoWeekdays'
        | 'E',
        number | string
    >
>;

export interface DateTime extends Object {
    add(amount: DurationInput, unit?: DurationUnit): DateTime;
    subtract(amount: DurationInput, unit?: DurationUnit): DateTime;
    set(unit: AllUnit, amount: number): DateTime;
    set(amount: SetObject): DateTime;
    diff(amount: DateTimeInput, unit?: DurationUnit, asFloat?: boolean): number;
    format(formatInput?: FormatInput): string;
    fromNow(withoutSuffix?: boolean): string;
    from(formaInput: DateTimeInput, withoutSuffix?: boolean): string;
    isSame(input?: DateTimeInput, granularity?: StartOfUnit): boolean;
    isBefore(input?: DateTimeInput): boolean;
    isAfter(input?: DateTimeInput): boolean;
    isValid(): boolean;
    local(keepLocalTime?: boolean): DateTime;
    locale(): string;
    locale(locale: string): DateTime;
    startOf(unitOfTime: StartOfUnit): DateTime;
    endOf(unitOfTime: StartOfUnit): DateTime;
    toDate(): Date;
    toISOString(keepOffset?: boolean): string;
    valueOf(): number;
    unix(): number;
    utc(keepLocalTime?: boolean): DateTime;
    utcOffset(): number;
    utcOffset(offset: number | string, keepLocalTime?: boolean): DateTime;
    timeZone(): string;
    timeZone(timeZone: string, keepLocalTime?: boolean): DateTime;
    daysInMonth: () => number;
    date(): number;
    date(value: number): DateTime;
    week(): number;
    week(value: number): DateTime;
    isoWeek(): number;
    isoWeek(value: number): DateTime;
    isoWeekday(): number;
    isoWeekday(value: number): DateTime;
    month(): number;
    month(value: number): DateTime;
    quarter(): number;
    quarter(value: number): DateTime;
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
