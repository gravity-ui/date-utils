import {INVALID_DATE_STRING, UtcTimeZone} from '../constants';
import {duration} from '../duration';
import {LocaleImpl} from '../locale/locale';
import type {Locale} from '../locale/types';
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
    computeOrdinal,
    daysInMonth,
    gregorianToWeek,
    monthDiff,
    normalizeComponent,
    normalizeDateComponents,
    normalizeDurationUnit,
    objToTS,
    offsetFromString,
    tsToObject,
    uncomputeOrdinal,
    weekToGregorian,
    weeksInWeekYear,
} from '../utils';
import type {DateObject} from '../utils';

import {formatDate} from './format';
import {parseDateStringWithFormat} from './formatParse';
import {getTimestampFromArray, getTimestampFromObject} from './parse';
import {parseDateString} from './regexParse';
import {fromTo} from './relative';

const IS_DATE_TIME = Symbol('isDateTime');
class DateTimeImpl implements DateTime {
    static isDateTime(o: unknown): o is DateTime {
        return (
            (typeof o === 'object' && o && IS_DATE_TIME in o && o[IS_DATE_TIME] === true) || false
        );
    }

    [IS_DATE_TIME]: boolean;

    private _timestamp: number;
    private _timezone: string;
    private _offset: number;
    private _c: DateObject;
    private _weekInfo: ReturnType<typeof gregorianToWeek> | null = null;
    private _locale: Locale;
    private _isValid: boolean;

    constructor(opt: {
        ts: number;
        timezone: TimeZone;
        offset: number;
        locale: Locale;
        isValid: boolean;
    }) {
        this[IS_DATE_TIME] = true;

        this._timestamp = opt.ts;
        this._timezone = opt.timezone;
        this._offset = opt.offset;
        this._c = tsToObject(opt.ts, opt.offset);
        this._locale = opt.locale;
        this._isValid = opt.isValid;
    }

    format(formatInput?: FormatInput): string {
        if (!this.isValid()) {
            return INVALID_DATE_STRING; // this._locale.invalidDate || INVALID_DATE_STRING;
        }

        if (formatInput === undefined && this._offset === 0) {
            return this.format('YYYY-MM-DDTHH:mm:ss[Z]');
        }
        return formatDate(this, formatInput, this._locale);
    }

    toISOString(keepOffset?: boolean): string {
        // invalid date throws an error
        if (keepOffset) {
            return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                .toISOString()
                .replace('Z', this.format('Z'));
        }
        return this.toDate().toISOString();
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
                timezone: UtcTimeZone,
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
            return this._timezone === 'system' ? guessUserTimeZone() : this._timezone;
        }

        if (!this.isValid()) {
            return this;
        }

        const zone = normalizeTimeZone(timeZone, settings.getDefaultTimeZone());
        let ts = this.valueOf();
        let offset = timeZoneOffset(zone, ts);
        if (keepLocalTime) {
            ts += this._offset * 60 * 1000;
            [ts, offset] = fixOffset(ts, offset, zone);
        }

        return createDateTime({ts, timezone: zone, offset, locale: this._locale});
    }

    add(amount: DurationInput, unit?: DurationUnit): DateTime {
        return this.addSubtract(amount, unit, 1);
    }

    subtract(amount: DurationInput, unit?: DurationUnit): DateTime {
        return this.addSubtract(amount, unit, -1);
    }

    startOf(
        unitOfTime:
            | StartOfUnit
            | 'weekNumber'
            | 'isoWeekNumber'
            | 'weekday'
            | 'isoWeekday'
            | 'dayOfYear',
    ) {
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
            case 'weekday':
            case 'isoWeekday':
            case 'dayOfYear':
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

    endOf(
        unitOfTime:
            | StartOfUnit
            | 'weekNumber'
            | 'isoWeekNumber'
            | 'weekday'
            | 'isoWeekday'
            | 'dayOfYear',
    ): DateTime {
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
            case 'weekday':
            case 'isoWeekday':
            case 'dayOfYear':
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
        return this.isValid() ? this._timestamp : NaN;
    }

    isSame(input?: DateTimeInput, granularity?: DurationUnit): boolean {
        const [ts] = getTimestamp({input, timezone: 'system', locale: this._locale});
        if (!this.isValid() || isNaN(ts)) {
            return false;
        }
        return !this.isBefore(ts, granularity) && !this.isAfter(ts, granularity);
    }

    isBefore(input?: DateTimeInput, granularity?: DurationUnit): boolean {
        const [ts] = getTimestamp({input, timezone: 'system', locale: this._locale});
        if (!this.isValid() || isNaN(ts)) {
            return false;
        }
        const unit = normalizeDurationUnit(granularity ?? 'millisecond');
        const localTs = unit === 'milliseconds' ? this.valueOf() : this.endOf(unit).valueOf();
        return localTs < ts;
    }

    isAfter(input?: DateTimeInput, granularity?: DurationUnit): boolean {
        const [ts] = getTimestamp({input, timezone: 'system', locale: this._locale});
        if (!this.isValid() || isNaN(ts)) {
            return false;
        }
        const unit = normalizeDurationUnit(granularity ?? 'millisecond');
        const localTs = unit === 'milliseconds' ? this.valueOf() : this.startOf(unit).valueOf();
        return localTs > ts;
    }

    isValid(): boolean {
        return this._isValid;
    }

    diff(
        amount: DateTimeInput,
        unit?: DurationUnit | undefined,
        asFloat?: boolean | undefined,
    ): number {
        if (!this.isValid()) {
            return NaN;
        }
        const value = DateTimeImpl.isDateTime(amount)
            ? amount.timeZone(this._timezone)
            : createDateTime({
                  ts: getTimestamp({input: amount, timezone: 'system', locale: this._locale})[0],
                  timezone: this._timezone,
                  locale: this._locale,
                  offset: this._offset,
              });
        if (!value.isValid()) {
            return NaN;
        }

        const unitType = normalizeDurationUnit(unit || 'millisecond');
        const zoneDelta = (value.utcOffset() - this.utcOffset()) * 60_000;
        let output = 0;
        switch (unitType) {
            case 'years': {
                output = monthDiff(this, value) / 12;
                break;
            }
            case 'quarters': {
                output = monthDiff(this, value) / 3;
                break;
            }
            case 'months': {
                output = monthDiff(this, value);
                break;
            }
            case 'weeks': {
                output = (this.valueOf() - value.valueOf() - zoneDelta) / 604_800_000;
                break;
            }
            case 'days': {
                output = (this.valueOf() - value.valueOf() - zoneDelta) / 86_400_000;
                break;
            }
            case 'hours': {
                output = (this.valueOf() - value.valueOf()) / 3_600_000;
                break;
            }
            case 'minutes': {
                output = (this.valueOf() - value.valueOf()) / 60_000;
                break;
            }
            case 'seconds': {
                output = (this.valueOf() - value.valueOf()) / 1_000;
                break;
            }
            default: {
                output = this.valueOf() - value.valueOf();
            }
        }
        return asFloat ? output : Math.floor(Math.abs(output)) * Math.sign(output) || 0;
    }
    fromNow(withoutSuffix?: boolean | undefined): string {
        return this.from(
            dateTime({timeZone: this._timezone, lang: this._locale.locale}),
            withoutSuffix,
        );
    }
    from(fromInput: DateTimeInput, withoutSuffix?: boolean): string {
        if (!this.isValid()) {
            return INVALID_DATE_STRING; // this._localeData.invalidDate || INVALID_DATE_STRING;
        }

        const value = DateTimeImpl.isDateTime(fromInput)
            ? fromInput.timeZone(this._timezone)
            : createDateTime({
                  ts: getTimestamp({input: fromInput, timezone: 'system', locale: this._locale})[0],
                  timezone: this._timezone,
                  locale: this._locale,
                  offset: this._offset,
              });

        if (!value.isValid()) {
            return INVALID_DATE_STRING; // this._localeData.invalidDate || INVALID_DATE_STRING;
        }

        let a = value;
        let b: DateTime = this;
        let switched = false;
        if (b.isBefore(a)) {
            a = this;
            b = value;
            switched = true;
        }

        let months = b.month() - a.month() + (b.year() - a.year()) * 12;
        if (a.add(months, 'months').isAfter(b)) {
            months--;
        }
        let milliseconds = b.valueOf() - a.add(months, 'months').valueOf();

        if (switched) {
            months = -months;
            milliseconds = -milliseconds;
        }

        return fromTo(duration({months, milliseconds}), this._locale.relativeTime, withoutSuffix);
    }
    locale(): string;
    locale(locale: string): DateTime;
    locale(locale?: string): DateTime | string {
        if (!locale) {
            return this._locale.locale;
        }
        if (!this.isValid()) {
            return this;
        }
        return createDateTime({
            ts: this.valueOf(),
            timezone: this._timezone,
            offset: this._offset,
            locale: new LocaleImpl(locale),
        });
    }
    toDate(): Date {
        return new Date(this.valueOf());
    }
    unix(): number {
        return this.isValid() ? Math.floor(this.valueOf() / 1000) : NaN;
    }
    utc(keepLocalTime?: boolean | undefined): DateTime {
        return this.timeZone(UtcTimeZone, keepLocalTime);
    }
    daysInMonth(): number {
        return this.isValid() ? daysInMonth(this._c.year, this._c.month) : NaN;
    }

    set(unit: AllUnit | SetObject, amount?: number): DateTime {
        if (!this.isValid()) {
            return this;
        }
        const dateComponents = this._c;
        const newComponents = normalizeDateComponents(
            typeof unit === 'object' ? unit : {[unit]: amount},
            normalizeComponent,
        );

        if (newComponents.quarter) {
            newComponents.month = newComponents.quarter * 3 - 1;
        }

        const settingWeekStuff =
            newComponents.day !== undefined ||
            newComponents.weekNumber !== undefined ||
            newComponents.weekYear !== undefined ||
            newComponents.isoWeekNumber !== undefined ||
            newComponents.weekday !== undefined ||
            newComponents.isoWeekday !== undefined ||
            newComponents.isoWeekYear !== undefined;

        const containsDayOfYear = newComponents.dayOfYear !== undefined;
        const containsYear = newComponents.year !== undefined;
        const containsMonthOrDate =
            newComponents.month !== undefined || newComponents.date !== undefined;
        const containsYearOrMonthDay = containsYear || containsMonthOrDate;

        if (settingWeekStuff && (containsYearOrMonthDay || containsDayOfYear)) {
            throw new Error("Can't mix weekYear/weekNumber units with year/month/day");
        }

        if (containsDayOfYear && containsMonthOrDate) {
            throw new Error("Can't mix day of year with month/day");
        }

        let mixed;
        if (settingWeekStuff) {
            const {weekday, weekNumber, weekYear, isoWeekday, isoWeekNumber, isoWeekYear, day} =
                newComponents;
            const hasLocalWeekData =
                weekday !== undefined || weekNumber !== undefined || weekYear !== undefined;
            const hasIsoWeekData =
                isoWeekday !== undefined ||
                isoWeekNumber !== undefined ||
                isoWeekYear !== undefined ||
                day !== undefined;
            if (hasLocalWeekData && hasIsoWeekData) {
                throw new Error("Can't mix local week with ISO week");
            }
            const weekInfo = this.weekInfo();
            if (hasLocalWeekData) {
                const {minimalDays, firstDay} = this._locale.weekInfo();
                const weekData = {
                    weekday: (weekday ?? weekInfo.weekday) + 1,
                    weekNumber: weekNumber ?? weekInfo.weekNumber,
                    weekYear: weekYear ?? weekInfo.weekYear,
                };
                mixed = {
                    ...dateComponents,
                    ...newComponents,
                    ...weekToGregorian(weekData, minimalDays, firstDay),
                };
            } else {
                const weekData = {
                    weekday: isoWeekday ?? (day === undefined ? weekInfo.isoWeekday : day || 7),
                    weekNumber: isoWeekNumber ?? weekInfo.isoWeekNumber,
                    weekYear: isoWeekYear ?? weekInfo.isoWeekYear,
                };
                mixed = {...dateComponents, ...newComponents, ...weekToGregorian(weekData, 4, 1)};
            }
        } else if (containsDayOfYear) {
            mixed = {
                ...dateComponents,
                ...newComponents,
                ...uncomputeOrdinal({
                    ordinal: this.dayOfYear(),
                    ...dateComponents,
                    ...newComponents,
                }),
            };
        } else {
            mixed = {...dateComponents, ...newComponents};

            if (newComponents.date === undefined) {
                mixed.date = Math.min(daysInMonth(mixed.year, mixed.month), mixed.date);
            }
        }

        let ts = objToTS(mixed);
        let offset = this._offset;
        if (this._timezone === UtcTimeZone) {
            ts -= offset * 60 * 1000;
        } else {
            [ts, offset] = fixOffset(ts, offset, this._timezone);
        }

        return createDateTime({
            ts,
            timezone: this._timezone,
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
        return this.isValid() ? this._c.date : NaN;
    }
    month(): number;
    month(value: number): DateTime;
    month(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('month', value);
        }
        return this.isValid() ? this._c.month : NaN;
    }
    quarter(): number;
    quarter(value: number): DateTime;
    quarter(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('quarter', value);
        }
        return this.isValid() ? Math.ceil((this._c.month + 1) / 3) : NaN;
    }
    year(): number;
    year(value: number): DateTime;
    year(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('year', value);
        }
        return this.isValid() ? this._c.year : NaN;
    }
    day(): number;
    day(value: number): DateTime;
    day(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('day', value);
        }
        return this.isValid() ? this.weekInfo().day : NaN;
    }

    isoWeekday(): number;
    isoWeekday(value: number): DateTime;
    isoWeekday(value?: number): number | DateTime {
        if (typeof value === 'number') {
            // return this.day(this.day() % 7 ? day : day - 7);
            return this.set('isoWeekday', value);
        }

        return this.isValid() ? this.weekInfo().isoWeekday : NaN;
    }

    hour(): number;
    hour(value: number): DateTime;
    hour(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('hour', value);
        }
        return this.isValid() ? this._c.hour : NaN;
    }
    minute(): number;
    minute(value: number): DateTime;
    minute(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('minute', value);
        }
        return this.isValid() ? this._c.minute : NaN;
    }
    second(): number;
    second(value: number): DateTime;
    second(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('second', value);
        }
        return this.isValid() ? this._c.second : NaN;
    }
    millisecond(): number;
    millisecond(value: number): DateTime;
    millisecond(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('millisecond', value);
        }
        return this.isValid() ? this._c.millisecond : NaN;
    }
    week(): number;
    week(value: number): DateTime;
    week(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('week', value);
        }
        return this.isValid() ? this.weekInfo().weekNumber : NaN;
    }
    weekYear(): number;
    weekYear(value: number): DateTime;
    weekYear(value?: unknown): number | DateTime {
        if (typeof value === 'number') {
            return this.set('weekYear', value);
        }
        return this.isValid() ? this.weekInfo().weekYear : NaN;
    }
    weeksInYear(): number {
        const {minimalDays, firstDay} = this._locale.weekInfo();
        return this.isValid() ? weeksInWeekYear(this.year(), minimalDays, firstDay) : NaN;
    }
    isoWeek(): number;
    isoWeek(value: number): DateTime;
    isoWeek(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('isoWeek', value);
        }
        return this.isValid() ? this.weekInfo().isoWeekNumber : NaN;
    }
    isoWeekYear(): number;
    isoWeekYear(value: number): DateTime;
    isoWeekYear(value?: unknown): number | DateTime {
        if (typeof value === 'number') {
            return this.set('isoWeekYear', value);
        }
        return this.isValid() ? this.weekInfo().isoWeekYear : NaN;
    }
    isoWeeksInYear(): number {
        return this.isValid() ? weeksInWeekYear(this.year(), 4, 1) : NaN;
    }
    weekday(): number;
    weekday(value: number): DateTime;
    weekday(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('weekday', value);
        }
        return this.isValid() ? this.weekInfo().weekday : NaN;
    }

    dayOfYear(value: number): DateTime;
    dayOfYear(): number;
    dayOfYear(value?: number): number | DateTime {
        if (typeof value === 'number') {
            return this.set('dayOfYear', value);
        }
        return this.isValid() ? computeOrdinal(this._c) : NaN;
    }

    toString(): string {
        return this.isValid() ? this.toDate().toUTCString() : INVALID_DATE_STRING; // this._localeData.invalidDate || INVALID_DATE_STRING;
    }

    toJSON(): string | null {
        return this.isValid() ? this.toISOString() : null;
    }

    /**
     * Returns a string representation of this DateTime appropriate for the REPL.
     * @return {string}
     */
    [Symbol.for('nodejs.util.inspect.custom')]() {
        if (this.isValid()) {
            return `DateTime { ts: ${this.toISOString()}, zone: ${this.timeZone()}, offset: ${this.utcOffset()}, locale: ${this.locale()} }`;
        } else {
            return `DateTime { ${INVALID_DATE_STRING} }`;
        }
    }

    private addSubtract(amount: DurationInput, unit: DurationUnit | undefined, sign: 1 | -1) {
        if (!this.isValid()) {
            return this;
        }

        const timezone = this._timezone;
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
            if (timezone === UtcTimeZone) {
                ts -= offset * 60 * 1000;
            } else {
                [ts, offset] = fixOffset(ts, offset, timezone);
            }
        }

        if (milliseconds) {
            ts += sign * milliseconds;
            if (timezone !== UtcTimeZone) {
                offset = timeZoneOffset(timezone, ts);
            }
        }

        return createDateTime({
            ts,
            timezone,
            offset,
            locale: this._locale,
        });
    }
    private weekInfo() {
        if (!this._weekInfo) {
            const {minimalDays, firstDay} = this._locale.weekInfo();
            this._weekInfo = gregorianToWeek(this._c, minimalDays, firstDay);
        }
        return this._weekInfo;
    }
}

function absRound(v: number) {
    const sign = Math.sign(v);
    return Math.round(sign * v) * sign;
}

function valueOf(o: unknown): number {
    if (o === null || o === undefined) {
        return NaN;
    }

    if (typeof o === 'string') {
        return NaN;
    }

    if (typeof o === 'number' || typeof o === 'bigint') {
        return Number(o);
    }

    if (typeof o === 'object') {
        const v = o.valueOf();
        if (typeof v === 'number' || typeof v === 'bigint') {
            return Number(v);
        }
    }

    return NaN;
}

function createDateTime({
    ts,
    timezone,
    offset,
    locale,
}: {
    ts: number;
    timezone: string;
    offset: number;
    locale: Locale;
}): DateTime {
    const isValid = !isNaN(Number(new Date(ts)));
    return new DateTimeImpl({
        ts,
        timezone,
        offset,
        locale,
        isValid,
    });
}

function getTimestamp({
    input,
    timezone,
    locale,
    format,
    fixedOffset,
    setTimezone,
}: {
    input: DateTimeInput;
    timezone?: string;
    locale: Locale;
    format?: string;
    fixedOffset?: number;
    setTimezone?: boolean;
}): [ts: number, offset: number, timezone: string] {
    let ts: number;
    let offset = fixedOffset;
    let resolvedTimezone =
        typeof fixedOffset === 'number'
            ? UtcTimeZone
            : normalizeTimeZone(timezone, settings.getDefaultTimeZone());
    if (
        isDateTime(input) ||
        typeof input === 'number' ||
        input instanceof Date ||
        !isNaN(valueOf(input))
    ) {
        ts = Number(input);
    } else if (input === null || input === undefined) {
        ts = Date.now();
    } else if (Array.isArray(input)) {
        [ts, offset] = getTimestampFromArray(input, resolvedTimezone, locale, fixedOffset);
    } else if (typeof input === 'object') {
        [ts, offset] = getTimestampFromObject(input, resolvedTimezone, locale, fixedOffset);
    } else {
        const [dateObject, timezoneOrOffset] = format
            ? parseDateStringWithFormat(input, format, locale)
            : parseDateString(input);
        if (Object.keys(dateObject).length === 0) {
            return [NaN, NaN, 'system'];
        }
        [ts] = getTimestampFromObject(
            dateObject,
            typeof timezoneOrOffset === 'string' ? timezoneOrOffset : resolvedTimezone,
            locale,
            typeof timezoneOrOffset === 'number' ? timezoneOrOffset : fixedOffset,
        );

        if (
            setTimezone &&
            timezoneOrOffset !== null &&
            timezone === undefined &&
            fixedOffset === undefined
        ) {
            if (typeof timezoneOrOffset === 'number') {
                resolvedTimezone = UtcTimeZone;
                offset = timezoneOrOffset;
            } else if (typeof timezoneOrOffset === 'string') {
                resolvedTimezone = timezoneOrOffset;
            }
        }
        if (
            fixedOffset !== undefined &&
            timezoneOrOffset !== null &&
            timezoneOrOffset !== fixedOffset
        ) {
            ts -= fixedOffset * 60 * 1000;
        }
    }

    offset = offset ?? timeZoneOffset(resolvedTimezone, ts);
    return [ts, offset, resolvedTimezone];
}

/**
 * Checks if value is DateTime.
 * @param {unknown} value - value to check.
 */
export function isDateTime(value: unknown): value is DateTime {
    return DateTimeImpl.isDateTime(value);
}

/**
 * Creates a DateTime instance.
 * @param opt
 * @param {DateTimeInput=} opt.input - input to parse.
 * @param {string=} opt.format - strict {@link https://dayjs.gitee.io/docs/en/display/format format} for parsing user's input.
 * @param {string=} opt.timeZone - specified {@link https://dayjs.gitee.io/docs/en/timezone/timezone time zone}.
 * @param {number=} opt.offset - set offset to date, if specified timezone will be set to UTC.
 * @param {boolean=} opt.setTimezone - if the input contains timezone/offset information, it will be set to created date.
 * @param {string=} opt.lang - specified locale.
 */
export function dateTime(opt?: {
    input?: DateTimeInput;
    format?: FormatInput;
    offset?: number;
    timeZone?: TimeZone;
    lang?: string;
    setTimezone?: boolean;
}): DateTime {
    const {input, format, timeZone, setTimezone, offset: fixedOffset, lang} = opt || {};

    const locale = new LocaleImpl(lang);

    const [ts, offset, timezone] = getTimestamp({
        input,
        timezone: timeZone,
        fixedOffset,
        locale,
        format,
        setTimezone,
    });

    const date = createDateTime({
        ts,
        timezone,
        offset,
        locale,
    });

    return date;
}
