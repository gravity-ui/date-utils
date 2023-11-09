import dayjs from '../dayjs';
import {STRICT, UtcTimeZone} from '../constants';
import {timeZoneOffset, normalizeTimeZone, fixOffset} from '../timeZone';

import type {
    AllUnit,
    DateTime,
    DateTimeInput,
    DurationUnit,
    FormatInput,
    SetObject,
    StartOfUnit,
    TimeZone,
} from '../typings';
import {
    daysInMonth,
    normalizeDateComponents,
    objToTS,
    tsToObject,
    getDuration,
    offsetFromString,
} from '../utils';
import {settings} from '../settings';

const IS_DATE_TIME = Symbol('isDateTime');
class DateTimeImpl implements DateTime {
    static isDateTime(o: unknown): o is DateTime {
        return (
            (typeof o === 'object' && o && IS_DATE_TIME in o && o[IS_DATE_TIME] === true) || false
        );
    }

    [IS_DATE_TIME]: boolean;

    private _timestamp: number;
    private _timeZone: string;
    private _offset: number;
    private _locale: string;
    private _date: dayjs.Dayjs;
    // private _utcDate: dayjs.Dayjs;

    constructor(
        opt: {
            input?: DateTimeInput;
            format?: FormatInput;
            timeZone?: TimeZone;
            utcOffset?: number;
            locale?: string;
        } = {},
    ) {
        this[IS_DATE_TIME] = true;

        let input = opt.input;
        if (DateTimeImpl.isDateTime(input)) {
            input = input.valueOf();
        }
        const locale = opt.locale || settings.getLocale();
        const localDate = opt.format
            ? // @ts-expect-error
              dayjs(input, opt.format, locale, STRICT)
            : // @ts-expect-error
              dayjs(input, undefined, locale);

        this._timestamp = localDate.valueOf();
        // this._utcDate = localDate.utc();
        this._locale = locale;
        if (typeof opt.utcOffset === 'number') {
            this._timeZone = UtcTimeZone;
            this._offset = opt.utcOffset;
            this._date = localDate.utc().utcOffset(this._offset).locale(locale);
            // @ts-expect-error set timezone to utc date
            this._date.$x.$timezone = this._timeZone;
        } else {
            this._timeZone = normalizeTimeZone(opt.timeZone, settings.getDefaultTimeZone());
            this._offset = timeZoneOffset(this._timeZone, this._timestamp);
            this._date = localDate.locale(locale).tz(this._timeZone);
        }
    }

    format(formatInput?: FormatInput) {
        return this._date.format(formatInput);
    }

    toISOString(keepOffset?: boolean): string {
        if (keepOffset) {
            return this._date.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        }
        return this._date.toISOString();
    }

    utcOffset(): number;
    utcOffset(offset: string | number, keepLocalTime?: boolean): DateTime;
    utcOffset(offset?: string | number, keepLocalTime?: boolean): number | DateTime {
        const isSetOffset = offset !== undefined && offset !== null;
        if (!this.isValid()) {
            return isSetOffset ? this : NaN;
        }
        if (isSetOffset) {
            let newOffset;
            if (typeof offset === 'string') {
                newOffset = offsetFromString(offset);
                if (newOffset === null) {
                    return this;
                }
            } else if (Math.abs(offset) < 16) {
                newOffset = offset * 60;
            } else {
                newOffset = offset;
            }
            let ts = this.valueOf();
            if (keepLocalTime) {
                ts -= (newOffset - this._offset) * 60 * 1000;
            }
            return createDateTime({
                input: ts,
                timeZone: UtcTimeZone,
                offset: newOffset,
                locale: this._locale,
            });
        }

        return this._offset;
    }

    timeZone(): string;
    timeZone(timeZone: string, keepLocalTime?: boolean | undefined): DateTime;
    timeZone(timeZone?: string, keepLocalTime?: boolean | undefined): DateTime | string {
        if (timeZone === undefined) {
            return this._timeZone;
        }

        let ts = this.valueOf();
        const zone = normalizeTimeZone(timeZone, settings.getDefaultTimeZone());
        if (keepLocalTime) {
            const offset = timeZoneOffset(zone, ts);
            ts += this._offset * 60 * 1000;
            ts = fixOffset(ts, offset, zone)[0];
        }

        return createDateTime({input: ts, timeZone: zone, locale: this._locale});
    }

    add(amount: DateTimeInput, unit?: DurationUnit): DateTime {
        return addSubtract(this, amount, unit, 1);
    }

    subtract(amount: DateTimeInput, unit?: DurationUnit): DateTime {
        return addSubtract(this, amount, unit, -1);
    }

    startOf(unitOfTime: StartOfUnit): DateTime {
        // @ts-expect-error
        const ts = this._date.startOf(unitOfTime).valueOf();
        return createDateTime({
            input: ts,
            timeZone: this._timeZone,
            offset: this._offset,
            locale: this._locale,
        });
    }

    endOf(unitOfTime: StartOfUnit): DateTime {
        // @ts-expect-error
        const ts = this._date.endOf(unitOfTime).valueOf();
        return createDateTime({
            input: ts,
            timeZone: this._timeZone,
            offset: this._offset,
            locale: this._locale,
        });
    }

    local(keepLocalTime?: boolean): DateTime {
        return this.timeZone('default', keepLocalTime);
    }

    valueOf(): number {
        return this._timestamp;
    }

    isSame(input?: DateTimeInput, granularity?: DurationUnit): boolean {
        const value = DateTimeImpl.isDateTime(input) ? input.valueOf() : input;
        // @ts-expect-error
        return this._date.isSame(value, granularity);
    }

    isBefore(input?: DateTimeInput): boolean {
        const value = DateTimeImpl.isDateTime(input) ? input.valueOf() : input;
        // @ts-expect-error
        return this._date.isBefore(value);
    }

    isAfter(input?: DateTimeInput): boolean {
        const value = DateTimeImpl.isDateTime(input) ? input.valueOf() : input;
        // @ts-expect-error
        return this._date.isBefore(value);
    }

    isValid(): boolean {
        return this._date.isValid();
    }

    diff(
        amount: DateTimeInput,
        unit?: DurationUnit | undefined,
        truncate?: boolean | undefined,
    ): number {
        const value = DateTimeImpl.isDateTime(amount) ? amount.valueOf() : amount;
        // @ts-expect-error
        return this._date.diff(value, unit, truncate);
    }
    fromNow(withoutSuffix?: boolean | undefined): string {
        return this._date.fromNow(withoutSuffix);
    }
    from(formaInput: DateTimeInput, withoutSuffix?: boolean): string {
        // @ts-expect-error
        return this._date.from(formaInput, withoutSuffix);
    }
    locale(): string;
    locale(locale: string): DateTime;
    locale(locale?: string): DateTime | string {
        if (!locale) {
            return this._locale;
        }
        return createDateTime({
            input: this.valueOf(),
            timeZone: this._timeZone,
            offset: this._offset,
            locale: locale,
        });
    }
    toDate(): Date {
        return new Date(this.valueOf());
    }
    unix(): number {
        return Math.floor(this.valueOf() / 1000);
    }
    utc(keepLocalTime?: boolean | undefined): DateTime {
        let ts = this.valueOf();
        if (keepLocalTime) {
            ts += this._offset * 60 * 1000;
        }
        return new DateTimeImpl({input: ts, timeZone: UtcTimeZone});
    }
    daysInMonth(): number {
        return this._date.daysInMonth();
    }

    set(unit: AllUnit | SetObject, amount?: number): DateTime {
        const dateComponents = tsToObject(this._timestamp, this._offset);
        const newComponents = normalizeDateComponents(
            typeof unit === 'object' ? unit : {[unit]: amount},
        );

        const settingWeekStuff =
            newComponents.weekYear !== undefined ||
            newComponents.weekNumber !== undefined ||
            newComponents.day !== undefined ||
            newComponents.isoWeekNumber !== undefined ||
            newComponents.isoWeekday !== undefined;

        const containsYearOrMonthDay =
            newComponents.year !== undefined ||
            newComponents.month !== undefined ||
            newComponents.date !== undefined;

        if (settingWeekStuff && containsYearOrMonthDay) {
            throw new Error("Can't mix weekYear/weekNumber units with year/month/day");
        }

        let mixed;
        if (settingWeekStuff) {
            let date = dayjs.utc(objToTS(dateComponents));
            const toDayjsUnit = {
                // weekYear: 'isoWeekYear',
                weekNumber: 'week',
                day: 'day',
                isoWeekNumber: 'isoWeek',
                isoWeekday: 'isoWeekday',
            } as const;
            for (const u of ['weekNumber', 'day', 'isoWeekNumber', 'isoWeekday'] as const) {
                const v = newComponents[u];
                if (v !== undefined) {
                    date = date[toDayjsUnit[u]](v) as dayjs.Dayjs;
                }
            }
            mixed = tsToObject(date.valueOf(), 0);
        } else {
            mixed = {...dateComponents, ...newComponents};

            if (newComponents.day === undefined) {
                mixed.date = Math.min(daysInMonth(mixed.year, mixed.month), mixed.date);
            }
        }

        let ts = objToTS(mixed);
        if (this._timeZone === UtcTimeZone) {
            ts -= this._offset * 60 * 1000;
        } else {
            ts = fixOffset(ts, this._offset, this._timeZone)[0];
        }

        return createDateTime({
            input: ts,
            timeZone: this._timeZone,
            offset: this._offset,
            locale: this._locale,
        });
    }

    date(): number;
    date(value: number): DateTime;
    date(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('date', value);
        }
        return this._date.date();
    }
    month(): number;
    month(value: number): DateTime;
    month(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('month', value);
        }
        return this._date.month();
    }
    quarter(): number;
    quarter(value: number): DateTime;
    quarter(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('quarter', value);
        }
        return this._date.quarter();
    }
    year(): number;
    year(value: number): DateTime;
    year(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('year', value);
        }
        return this._date.year();
    }
    day(): number;
    day(value: number): DateTime;
    day(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('day', value);
        }
        return this._date.day();
    }

    isoWeekday(): number;
    isoWeekday(day: number): DateTime;
    isoWeekday(day?: number): number | DateTime {
        if (day === undefined) {
            return this._date.isoWeekday();
        }

        return this.day(this.day() % 7 ? day : day - 7);
    }

    hour(): number;
    hour(value: number): DateTime;
    hour(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('hour', value);
        }
        return this._date.hour();
    }
    minute(): number;
    minute(value: number): DateTime;
    minute(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('minute', value);
        }
        return this._date.minute();
    }
    second(): number;
    second(value: number): DateTime;
    second(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('second', value);
        }
        return this._date.second();
    }
    millisecond(): number;
    millisecond(value: number): DateTime;
    millisecond(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('millisecond', value);
        }
        return this._date.millisecond();
    }
    week(): number;
    week(value: number): DateTime;
    week(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('week', value);
        }
        return this._date.week();
    }
    isoWeek(): number;
    isoWeek(value: number): DateTime;
    isoWeek(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('isoWeek', value);
        }
        return this._date.isoWeek();
    }

    toString(): string {
        return this._date.toString();
    }
}

function addSubtract(
    instance: DateTime,
    amount: DateTimeInput,
    unit: DurationUnit | undefined,
    sign: 1 | -1,
) {
    const duration = getDuration(amount, unit);
    const dateComponents = tsToObject(instance.valueOf(), instance.utcOffset());

    const monthsInput = absRound(duration.months);
    const daysInput = absRound(duration.days);

    let ts = instance.valueOf();

    if (monthsInput || daysInput) {
        const month = dateComponents.month + sign * monthsInput;
        const date =
            Math.min(dateComponents.date, daysInMonth(dateComponents.year, month)) +
            sign * daysInput;
        ts = objToTS({...dateComponents, month, date});
        if (instance.timeZone() === UtcTimeZone) {
            ts -= instance.utcOffset() * 60 * 1000;
        } else {
            ts = fixOffset(ts, instance.utcOffset(), instance.timeZone())[0];
        }
    }
    ts += sign * duration.milliseconds;

    return createDateTime({
        input: ts,
        timeZone: instance.timeZone(),
        offset: instance.utcOffset(),
        locale: instance.locale(),
    });
}

function absRound(v: number) {
    const sign = v < 0 ? -1 : 1;
    return Math.round(sign * v) * sign;
}

function createDateTime({
    input,
    timeZone,
    offset,
    locale,
}: {
    input: number;
    timeZone?: string;
    offset?: number;
    locale: string | undefined;
}): DateTime {
    const utcOffset = timeZone === UtcTimeZone && offset !== 0 ? offset : undefined;
    return new DateTimeImpl({input, timeZone, utcOffset, locale});
}

/**
 * Checks if value is DateTime.
 * @param {unknown} value - value to check.
 */
export const isDateTime = (value: unknown): value is DateTime => {
    return DateTimeImpl.isDateTime(value);
};

/**
 * Creates a DateTime instance.
 * @param opt
 * @param {DateTimeInput=} opt.input - input to parse.
 * @param {string=} opt.format - strict {@link https://dayjs.gitee.io/docs/en/display/format format} for parsing user's input.
 * @param {string=} opt.timeZone - specified {@link https://dayjs.gitee.io/docs/en/timezone/timezone time zone}.
 * @param {string=} opt.lang - specified locale.
 */
export const dateTime = (opt?: {
    input?: DateTimeInput;
    format?: FormatInput;
    timeZone?: TimeZone;
    lang?: string;
}): DateTime => {
    const {input, format, timeZone, lang} = opt || {};

    const date = new DateTimeImpl({input, format, timeZone, locale: lang});

    return date;
};
