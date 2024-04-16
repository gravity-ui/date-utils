import {STRICT, UtcTimeZone} from '../constants';
import dayjs from '../dayjs';
import {duration} from '../duration';
import {settings} from '../settings';
import {fixOffset, guessUserTimeZone, normalizeTimeZone, timeZoneOffset} from '../timeZone';
import type {
    AllUnit,
    DateTime,
    DateTimeInput,
    DurationInput,
    DurationUnit,
    FormatInput,
    SetObject,
    StartOfUnit,
    TimeZone,
} from '../typings';
import {
    daysInMonth,
    normalizeComponent,
    normalizeDateComponents,
    objToTS,
    offsetFromString,
    tsToObject,
} from '../utils';

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

    constructor(opt: {
        ts: number;
        timeZone: TimeZone;
        offset: number;
        locale: string;
        date: dayjs.Dayjs;
    }) {
        this[IS_DATE_TIME] = true;

        this._timestamp = opt.ts;
        this._locale = opt.locale;
        this._timeZone = opt.timeZone;
        this._offset = opt.offset;
        this._date = opt.date;
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
                ts,
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
            return this._timeZone === 'system' ? guessUserTimeZone() : this._timeZone;
        }

        const zone = normalizeTimeZone(timeZone, settings.getDefaultTimeZone());
        let ts = this.valueOf();
        let offset = timeZoneOffset(zone, ts);
        if (keepLocalTime) {
            ts += this._offset * 60 * 1000;
            [ts, offset] = fixOffset(ts, offset, zone);
        }

        return createDateTime({ts, timeZone: zone, offset, locale: this._locale});
    }

    add(amount: DurationInput, unit?: DurationUnit): DateTime {
        return this.addSubtract(amount, unit, 1);
    }

    subtract(amount: DurationInput, unit?: DurationUnit): DateTime {
        return this.addSubtract(amount, unit, -1);
    }

    startOf(unitOfTime: StartOfUnit | 'weekNumber' | 'isoWeekNumber' | 'isoWeekday') {
        if (!this.isValid()) {
            return this;
        }

        const dateComponents: Partial<
            Record<'year' | 'month' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond', number>
        > = {};
        const unit = normalizeComponent(unitOfTime);
        /* eslint-disable no-fallthrough */
        switch (unit) {
            case 'year':
            case 'quarter':
                if (unit === 'quarter') {
                    dateComponents.month = this.month() - (this.month() % 3);
                } else {
                    dateComponents.month = 0;
                }
            case 'month':
            case 'weekNumber':
            case 'isoWeekNumber':
                if (unit === 'weekNumber') {
                    dateComponents.date = this.date() - this.weekday();
                } else if (unit === 'isoWeekNumber') {
                    dateComponents.date = this.date() - (this.isoWeekday() - 1);
                } else {
                    dateComponents.date = 1;
                }
            case 'day':
            case 'date':
            case 'isoWeekday':
                dateComponents.hour = 0;
            case 'hour':
                dateComponents.minute = 0;
            case 'minute':
                dateComponents.second = 0;
            case 'second': {
                dateComponents.millisecond = 0;
            }
        }
        /* eslint-enable no-fallthrough */

        return this.set(dateComponents);
    }

    endOf(unitOfTime: StartOfUnit | 'weekNumber' | 'isoWeekNumber' | 'isoWeekday'): DateTime {
        if (!this.isValid()) {
            return this;
        }

        const dateComponents: Partial<
            Record<'year' | 'month' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond', number>
        > = {};
        const unit = normalizeComponent(unitOfTime);
        /* eslint-disable no-fallthrough */
        switch (unit) {
            case 'year':
            case 'quarter':
                if (unit === 'quarter') {
                    dateComponents.month = this.month() - (this.month() % 3) + 2;
                } else {
                    dateComponents.month = 11;
                }
            case 'month':
            case 'weekNumber':
            case 'isoWeekNumber':
                if (unit === 'weekNumber') {
                    dateComponents.date = this.date() - this.weekday() + 6;
                } else if (unit === 'isoWeekNumber') {
                    dateComponents.date = this.date() - (this.isoWeekday() - 1) + 6;
                } else {
                    dateComponents.date = daysInMonth(
                        this.year(),
                        dateComponents.month ?? this.month(),
                    );
                }
            case 'day':
            case 'date':
            case 'isoWeekday':
                dateComponents.hour = 23;
            case 'hour':
                dateComponents.minute = 59;
            case 'minute':
                dateComponents.second = 59;
            case 'second': {
                dateComponents.millisecond = 999;
            }
        }
        /* eslint-enable no-fallthrough */

        return this.set(dateComponents);
    }

    local(keepLocalTime?: boolean): DateTime {
        return this.timeZone('system', keepLocalTime);
    }

    valueOf(): number {
        return this._timestamp;
    }

    isSame(input?: DateTimeInput, granularity?: DurationUnit): boolean {
        const ts = getTimestamp(input);
        if (!this.isValid() || isNaN(ts)) {
            return false;
        }
        return !this.isBefore(ts, granularity) && !this.isAfter(ts, granularity);
    }

    isBefore(input?: DateTimeInput, granularity?: DurationUnit): boolean {
        const ts = getTimestamp(input);
        if (!this.isValid() || isNaN(ts)) {
            return false;
        }
        const unit = normalizeComponent(granularity ?? 'millisecond');
        const localTs = unit === 'millisecond' ? this.valueOf() : this.endOf(unit).valueOf();
        return localTs < ts;
    }

    isAfter(input?: DateTimeInput, granularity?: DurationUnit): boolean {
        const ts = getTimestamp(input);
        if (!this.isValid() || isNaN(ts)) {
            return false;
        }
        const unit = normalizeComponent(granularity ?? 'millisecond');
        const localTs = unit === 'millisecond' ? this.valueOf() : this.startOf(unit).valueOf();
        return localTs > ts;
    }

    isValid(): boolean {
        return this._date.isValid();
    }

    diff(
        amount: DateTimeInput,
        unit?: DurationUnit | undefined,
        asFloat?: boolean | undefined,
    ): number {
        const value = DateTimeImpl.isDateTime(amount) ? amount.valueOf() : amount;
        return this._date.diff(value, unit, asFloat);
    }
    fromNow(withoutSuffix?: boolean | undefined): string {
        return this._date.fromNow(withoutSuffix);
    }
    from(formaInput: DateTimeInput, withoutSuffix?: boolean): string {
        const value = DateTimeImpl.isDateTime(formaInput) ? formaInput.valueOf() : formaInput;
        return this._date.from(value, withoutSuffix);
    }
    locale(): string;
    locale(locale: string): DateTime;
    locale(locale?: string): DateTime | string {
        if (!locale) {
            return this._locale;
        }
        return createDateTime({
            ts: this.valueOf(),
            timeZone: this._timeZone,
            offset: this._offset,
            locale: dayjs.locale(locale, undefined, true),
        });
    }
    toDate(): Date {
        return new Date(this.valueOf());
    }
    unix(): number {
        return Math.floor(this.valueOf() / 1000);
    }
    utc(keepLocalTime?: boolean | undefined): DateTime {
        return this.timeZone(UtcTimeZone, keepLocalTime);
    }
    daysInMonth(): number {
        return this._date.daysInMonth();
    }

    set(unit: AllUnit | SetObject, amount?: number): DateTime {
        const dateComponents = tsToObject(this._timestamp, this._offset);
        const newComponents = normalizeDateComponents(
            typeof unit === 'object' ? unit : {[unit]: amount},
            normalizeComponent,
        );

        const settingWeekStuff =
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
            let date = dayjs.utc(objToTS({...dateComponents, ...newComponents}));
            const toDayjsUnit = {
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

            if (newComponents.date === undefined) {
                mixed.date = Math.min(daysInMonth(mixed.year, mixed.month), mixed.date);
            }
        }

        let ts = objToTS(mixed);
        let offset = this._offset;
        if (this._timeZone === UtcTimeZone) {
            ts -= offset * 60 * 1000;
        } else {
            [ts, offset] = fixOffset(ts, offset, this._timeZone);
        }

        return createDateTime({
            ts,
            timeZone: this._timeZone,
            offset,
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
    weekday(): number {
        // @ts-expect-error get locale object
        const weekStart = this._date.$locale().weekStart || 0;
        const day = this.day();
        const weekday = (day < weekStart ? day + 7 : day) - weekStart;
        return weekday;
    }

    toString(): string {
        return this._date.toString();
    }
    private addSubtract(amount: DurationInput, unit: DurationUnit | undefined, sign: 1 | -1) {
        if (!this.isValid()) {
            return this;
        }

        const timeZone = this._timeZone;
        let ts = this.valueOf();
        let offset = this._offset;

        const dur = duration(amount, unit);
        const dateComponents = tsToObject(ts, offset);

        const monthsInput = absRound(dur.months() + dur.quarters() * 3 + dur.years() * 12);
        const daysInput = absRound(dur.days() + dur.weeks() * 7);
        const milliseconds =
            dur.milliseconds() +
            dur.seconds() * 1000 +
            dur.minutes() * 60 * 1000 +
            dur.hours() * 60 * 60 * 1000;

        if (monthsInput || daysInput) {
            const month = dateComponents.month + sign * monthsInput;
            const date =
                Math.min(dateComponents.date, daysInMonth(dateComponents.year, month)) +
                sign * daysInput;
            ts = objToTS({...dateComponents, month, date});
            if (timeZone === UtcTimeZone) {
                ts -= offset * 60 * 1000;
            } else {
                [ts, offset] = fixOffset(ts, offset, timeZone);
            }
        }

        if (milliseconds) {
            ts += sign * milliseconds;
            if (timeZone !== UtcTimeZone) {
                offset = timeZoneOffset(timeZone, ts);
            }
        }

        return createDateTime({
            ts,
            timeZone,
            offset,
            locale: this._locale,
        });
    }
}

function absRound(v: number) {
    const sign = v < 0 ? -1 : 1;
    return Math.round(sign * v) * sign;
}

function createDateTime({
    ts,
    timeZone,
    offset,
    locale,
}: {
    ts: number;
    timeZone: string;
    offset: number;
    locale: string;
}): DateTime {
    let date: dayjs.Dayjs;
    if (timeZone === 'system') {
        date = dayjs(ts, {locale});
    } else {
        let localOffset = timeZoneOffset('system', ts);
        let newTs = ts;
        if (offset !== 0 && localOffset !== offset) {
            newTs += offset * 60 * 1000;
            [newTs, localOffset] = fixOffset(newTs, localOffset, 'system');
        }
        date = dayjs(newTs, {
            locale,
            utc: offset === 0,
            // @ts-expect-error private fields used by utc and timezone plugins
            $offset: offset ? offset : undefined,
            x: {$timezone: timeZone, $localOffset: -localOffset},
        });
    }

    return new DateTimeImpl({ts, timeZone, offset, locale, date});
}

function getTimestamp(input: DateTimeInput, format?: string, lang?: string) {
    const locale = dayjs.locale(lang || settings.getLocale(), undefined, true);

    let ts: number;
    if (DateTimeImpl.isDateTime(input) || typeof input === 'number' || input instanceof Date) {
        ts = Number(input);
    } else {
        const localDate = format
            ? dayjs(input, format, locale, STRICT)
            : dayjs(input, undefined, locale);

        ts = localDate.valueOf();
    }
    return ts;
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
export function dateTime(opt?: {
    input?: DateTimeInput;
    format?: FormatInput;
    timeZone?: TimeZone;
    lang?: string;
}): DateTime {
    const {input, format, timeZone, lang} = opt || {};

    const timeZoneOrDefault = normalizeTimeZone(timeZone, settings.getDefaultTimeZone());
    const locale = dayjs.locale(lang || settings.getLocale(), undefined, true);

    const ts = getTimestamp(input, format, lang);

    const offset = timeZoneOffset(timeZoneOrDefault, ts);

    const date = createDateTime({
        ts,
        timeZone: timeZoneOrDefault,
        offset,
        locale,
    });

    return date;
}

export function dateTimeUtc(opt?: {input?: DateTimeInput; format?: FormatInput; lang?: string}) {
    const {input, format, lang} = opt || {};

    const locale = dayjs.locale(lang || settings.getLocale(), undefined, true);

    let ts: number;
    if (DateTimeImpl.isDateTime(input) || typeof input === 'number' || input instanceof Date) {
        ts = Number(input);
    } else {
        ts = dayjs.utc(input, format, STRICT).valueOf();
    }

    const date = createDateTime({
        ts,
        timeZone: UtcTimeZone,
        offset: 0,
        locale,
    });

    return date;
}
