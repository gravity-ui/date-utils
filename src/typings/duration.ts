import type {DurationValues} from '../duration/duration';

import type {BaseUnit, QuarterUnit, WeekUnit} from './dateTime';

export type DurationUnit = BaseUnit | QuarterUnit | WeekUnit;
export type DurationInputObject = Partial<Record<DurationUnit, number | string>>;
export type DurationInput = Duration | number | string | DurationInputObject | null | undefined;

export type FormatOptions = {
    floor?: boolean;
} & Intl.NumberFormatOptions;

export interface Duration {
    /** Return the length of the duration in the specified unit. */
    as(unit: DurationUnit): number;

    /** Get the value of unit. */
    get(unit: DurationUnit): number;

    /** Set the values of specified units. Return a newly-constructed Duration. */
    set(values: DurationInputObject): Duration;

    /** Get the milliseconds. */
    milliseconds(): number;
    /** Return the length of the duration in the milliseconds. */
    asMilliseconds(): number;

    /** Get the seconds. */
    seconds(): number;
    /** Return the length of the duration in the seconds. */
    asSeconds(): number;

    /** Get the minutes. */
    minutes(): number;
    /** Return the length of the duration in the minutes. */
    asMinutes(): number;

    /** Get the hours. */
    hours(): number;
    /** Return the length of the duration in the hours. */
    asHours(): number;

    /** Get the days. */
    days(): number;
    /** Return the length of the duration in the days. */
    asDays(): number;

    /** Get the weeks. */
    weeks(): number;
    /** Return the length of the duration in the weeks. */
    asWeeks(): number;

    /** Get the months. */
    months(): number;
    /** Return the length of the duration in the months. */
    asMonths(): number;

    /** Get the quarters. */
    quarters(): number;
    /** Return the length of the duration in the quarters. */
    asQuarters(): number;

    /** Get the years. */
    years(): number;
    /** Return the length of the duration in the years. */
    asYears(): number;

    /** Make this Duration longer by the specified amount. Return a newly-constructed Duration. */
    add(amount: DurationInput, unit?: DurationUnit): Duration;

    /** Make this Duration shorter by the specified amount. Return a newly-constructed Duration. */
    subtract(amount: DurationInput, unit?: DurationUnit): Duration;

    /** Return the negative of this Duration. */
    negate(): Duration;

    locale(): string;
    locale(locale: string): Duration;

    /** Returns an ISO 8601-compliant string representation of this Duration. */
    toISOString(): string;

    /** Returns an ISO 8601 representation of this Duration appropriate for use in JSON. */
    toJSON(): string;

    /** Returns a JavaScript object with this Duration's values. */
    toObject(): DurationValues;

    /** Returns a string representation of a Duration in `dateTime.from` format. */
    humanize(withSuffix?: boolean): string;

    /** Returns a string representation of a Duration with all units included. */
    humanizeIntl(options?: {
        listStyle?: 'long' | 'short' | 'narrow'; // Intl.ListFormatStyle
        unitDisplay?: Intl.NumberFormatOptions['unitDisplay'];
    }): string;

    /** Returns a string representation of this Duration formatted according to the specified format string.
     * Used tokens are S for milliseconds, s for seconds, m for minutes, h for hours, d for days, w for weeks, M for months, and y for years.
     * Add padding by repeating the token, e.g. 'yy' pads the years to two digits, "hhhh" pads the hours to four digits.
     */
    format(formatInput: string, options?: FormatOptions): string;

    /** Reduce this Duration to its canonical representation in its current units. */
    normalize(options?: {roundUp?: boolean}): Duration;

    /** Convert this Duration into its representation in a different set of units. */
    shiftTo(units: DurationUnit[], options?: {roundUp?: boolean}): Duration;

    /** Rescale units to its largest representation */
    rescale(options?: {roundUp?: boolean}): Duration;

    isValid(): boolean;
}
