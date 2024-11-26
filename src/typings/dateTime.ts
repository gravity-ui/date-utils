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
    | 'weekday'
    | 'weekdays'
    | 'e'
    | 'isoWeekday'
    | 'isoWeekdays'
    | 'E'
    | 'dayOfYear'
    | 'dayOfYears'
    | 'DDD'
    | 'weekYear'
    | 'isoWeekYear';

export type InputObject = Partial<
    Record<
        | BaseUnit
        | DateUnit
        | WeekUnit
        | 'weekday'
        | 'weekdays'
        | 'e'
        | 'dayOfYear'
        | 'dayOfYears'
        | 'DDD'
        | 'weekYear',
        number
    >
>;
export type SetObject = Partial<Record<AllUnit, number | string>>;

export interface DateTime {
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
    toJSON(): string | null;
    valueOf(): number;
    unix(): number;
    utc(keepLocalTime?: boolean): DateTime;
    utcOffset(): number;
    utcOffset(offset: number | string, keepLocalTime?: boolean): DateTime;
    timeZone(): string;
    timeZone(timeZone: string, keepLocalTime?: boolean): DateTime;
    /** Get the number of days in the current month. */
    daysInMonth: () => number;
    /** Gets the day of the week, with Sunday as 0 and Saturday as 6. */
    day(): number;
    /** Sets the day of the week, with Sunday as 0 and Saturday as 6. */
    day(value: number): DateTime;
    /** Gets the ISO day of the week with 1 being Monday and 7 being Sunday. */
    isoWeekday(): number;
    /** Sets the ISO day of the week with 1 being Monday and 7 being Sunday. */
    isoWeekday(value: number): DateTime;
    /** Gets the day of the week according to the locale. 0 being first day of the week and 6 being last. */
    weekday(): number;
    /** Sets the day of the week according to the locale. 0 being first day of the week and 6 being last. */
    weekday(value: number): number;
    /** Gets the week of the year according to the locale. */
    week(): number;
    /** Sets the week of the year according to the locale. */
    week(value: number): DateTime;
    /** Gets the week-year according to the locale. */
    weekYear(): number;
    /** Sets the week-year according to the locale. */
    weekYear(value: number): DateTime;
    /** Gets the number of weeks in the year according to locale */
    weeksInYear(): number;
    /** Gets the ISO week of the year. First week is the week with the first Thursday of the year (i.e. of January) in it.*/
    isoWeek(): number;
    /** Sets the ISO week of the year. */
    isoWeek(value: number): DateTime;
    /** Gets the ISO week-year. */
    isoWeekYear(): number;
    /** Sets the ISO week-year. */
    isoWeekYear(value: number): DateTime;
    /** Gets the number of weeks in the year, according to ISO weeks. */
    isoWeeksInYear(): number;
    /** Gets the day of the year. */
    dayOfYear(): number;
    /** Sets the day of the year. */
    dayOfYear(value: number): DateTime;
    month(): number;
    month(value: number): DateTime;
    quarter(): number;
    quarter(value: number): DateTime;
    year(): number;
    year(value: number): DateTime;
    date(): number;
    date(value: number): DateTime;
    hour(): number;
    hour(value: number): DateTime;
    minute(): number;
    minute(value: number): DateTime;
    second(): number;
    second(value: number): DateTime;
    millisecond(): number;
    millisecond(value: number): DateTime;
}
