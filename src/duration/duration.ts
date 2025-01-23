// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import {fromTo} from '../dateTime/relative';
import {getListFormat, getNumberFormat} from '../locale/cache';
import {LocaleImpl} from '../locale/locale';
import type {Locale} from '../locale/types';
import type {
    Duration,
    DurationInput,
    DurationInputObject,
    DurationUnit,
    FormatOptions,
} from '../typings';
import {normalizeDateComponents, normalizeDurationUnit} from '../utils';

import {createDuration} from './createDuration';
import {normalizeValues, orderedUnits, rescale, shiftTo} from './normalize';

const IS_DURATION = Symbol('isDuration');

export type NormalizedUnit = (typeof orderedUnits)[number];

export type DurationValues = Partial<Record<NormalizedUnit, number>>;

export class DurationImpl implements Duration {
    static isDuration(o: unknown): o is Duration {
        return (typeof o === 'object' && o && IS_DURATION in o && o[IS_DURATION] === true) || false;
    }

    [IS_DURATION] = true;
    private _values: DurationValues;
    private _locale: Locale;
    private _isValid: boolean;

    constructor(options: {values: DurationValues; locale?: string; isValid?: boolean}) {
        this._values = options.values;
        this._locale = new LocaleImpl(options.locale);
        this._isValid = options.isValid || true;
    }

    get(unit: DurationUnit): number {
        if (!this.isValid()) {
            return NaN;
        }
        const name = normalizeDurationUnit(unit);

        return this._values[name] || 0;
    }

    set(values: DurationInputObject): Duration {
        if (!this.isValid()) {
            return this;
        }
        const newValues = {
            ...this._values,
            ...normalizeDateComponents(values, normalizeDurationUnit),
        };
        return new DurationImpl({values: newValues, locale: this._locale.locale});
    }

    as(unit: DurationUnit): number {
        if (!this.isValid()) {
            return NaN;
        }
        const name = normalizeDurationUnit(unit);

        // handle milliseconds separately because of floating point math errors
        const days =
            this.days() +
            this.weeks() * 7 +
            this.hours() / 24 +
            this.minutes() / 1440 +
            this.seconds() / 86400;
        const months = this.months() + this.quarters() * 3 + this.years() * 12;
        const milliseconds = this.milliseconds();
        if (name === 'months' || name === 'quarters' || name === 'years') {
            const monthsWithDays = months + daysToMonths(days + milliseconds / 86400000);
            switch (name) {
                case 'months':
                    return monthsWithDays;
                case 'quarters':
                    return monthsWithDays / 3;
                case 'years':
                    return monthsWithDays / 12;
            }
        }
        const daysWithMonths = days + monthsToDays(months);
        switch (name) {
            case 'weeks':
                return daysWithMonths / 7 + milliseconds / 6048e5;
            case 'days':
                return daysWithMonths + milliseconds / 864e5;
            case 'hours':
                return daysWithMonths * 24 + milliseconds / 36e5;
            case 'minutes':
                return daysWithMonths * 1440 + milliseconds / 6e4;
            case 'seconds':
                return daysWithMonths * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'milliseconds':
                return Math.floor(daysWithMonths * 864e5) + milliseconds;
            default:
                throw new Error('Unknown unit ' + name);
        }
    }

    milliseconds(): number {
        return this.isValid() ? this._values.milliseconds || 0 : NaN;
    }
    asMilliseconds(): number {
        return this.as('milliseconds');
    }
    seconds(): number {
        return this.isValid() ? this._values.seconds || 0 : NaN;
    }
    asSeconds(): number {
        return this.as('seconds');
    }
    minutes(): number {
        return this.isValid() ? this._values.minutes || 0 : NaN;
    }
    asMinutes(): number {
        return this.as('minutes');
    }
    hours(): number {
        return this.isValid() ? this._values.hours || 0 : NaN;
    }
    asHours(): number {
        return this.as('hours');
    }
    days(): number {
        return this.isValid() ? this._values.days || 0 : NaN;
    }
    asDays(): number {
        return this.as('days');
    }
    weeks(): number {
        return this.isValid() ? this._values.weeks || 0 : NaN;
    }
    asWeeks(): number {
        return this.as('weeks');
    }
    months(): number {
        return this.isValid() ? this._values.months || 0 : NaN;
    }
    asMonths(): number {
        return this.as('months');
    }
    quarters(): number {
        return this.isValid() ? this._values.quarters || 0 : NaN;
    }
    asQuarters(): number {
        return this.as('quarters');
    }
    years(): number {
        return this.isValid() ? this._values.years || 0 : NaN;
    }
    asYears(): number {
        return this.as('years');
    }

    add(amount: DurationInput, unit?: DurationUnit | undefined): Duration {
        if (!this.isValid()) {
            return this;
        }

        const newValues = this.toObject();
        const addValues = createDuration(amount, unit).toObject();
        for (const [key, value] of Object.entries(addValues)) {
            const k = key as keyof DurationValues;
            newValues[k] = (newValues[k] || 0) + value;
        }

        return new DurationImpl({values: newValues, locale: this._locale.locale});
    }

    subtract(amount: DurationInput, unit?: DurationUnit | undefined): Duration {
        const subtractDuration = createDuration(amount, unit).negate();
        return this.add(subtractDuration);
    }

    negate() {
        const values: DurationValues = {};
        for (const [key, value] of Object.entries(this._values)) {
            values[key as keyof DurationValues] = value ? -value : 0;
        }

        return new DurationImpl({values, locale: this._locale.locale});
    }

    normalize(options?: {roundUp?: boolean}): Duration {
        if (!this.isValid()) {
            return this;
        }
        return new DurationImpl({
            values: normalizeValues(this._values, options),
            locale: this._locale.locale,
        });
    }

    shiftTo(units: DurationUnit[], options?: {roundUp?: boolean}) {
        if (!this.isValid()) {
            return this;
        }
        const normalizedUnits = units.map((u) => normalizeDurationUnit(u));
        return new DurationImpl({
            values: shiftTo(this._values, normalizedUnits, options),
            locale: this._locale.locale,
        });
    }

    rescale(options?: {roundUp?: boolean}) {
        if (!this.isValid()) {
            return this;
        }
        return new DurationImpl({
            values: rescale(this._values, options),
            locale: this._locale.locale,
        });
    }

    toISOString(): string {
        if (!this.isValid()) {
            return 'Invalid Duration';
        }

        let s = 'P';
        if (this.years() !== 0) {
            s += this.years() + 'Y';
        }
        if (this.months() !== 0 || this.quarters() !== 0) {
            s += this.months() + this.quarters() * 3 + 'M';
        }
        if (this.weeks() !== 0) {
            s += this.weeks() + 'W';
        }
        if (this.days() !== 0) {
            s += this.days() + 'D';
        }
        if (
            this.hours() !== 0 ||
            this.minutes() !== 0 ||
            this.seconds() !== 0 ||
            this.milliseconds() !== 0
        ) {
            s += 'T';
        }
        if (this.hours() !== 0) {
            s += this.hours() + 'H';
        }
        if (this.minutes() !== 0) {
            s += this.minutes() + 'M';
        }
        if (this.seconds() !== 0 || this.milliseconds() !== 0) {
            s += Math.round(1000 * this.seconds() + this.milliseconds()) / 1000 + 'S';
        }
        if (s === 'P') s += 'T0S';
        return s;
    }

    toJSON(): string {
        return this.toISOString();
    }

    toObject() {
        if (!this.isValid()) {
            return {};
        }

        return {...this._values};
    }

    toString(): string {
        return this.toISOString();
    }

    valueOf(): number {
        return this.asMilliseconds();
    }

    /**
     * Returns a string representation of this Duration appropriate for the REPL.
     * @return {string}
     */
    [Symbol.for('nodejs.util.inspect.custom')]() {
        if (this.isValid()) {
            return `Duration { values: ${JSON.stringify(this._values)} }`;
        } else {
            return `Duration { Invalid Duration }`;
        }
    }

    humanize(withSuffix?: boolean) {
        if (!this.isValid()) {
            return 'Invalid Duration';
        }
        return fromTo(this, this._locale.relativeTime, !withSuffix);
    }

    humanizeIntl(
        options: {
            listStyle?: 'long' | 'short' | 'narrow';
            unitDisplay?: Intl.NumberFormatOptions['unitDisplay'];
        } = {},
    ): string {
        if (!this.isValid()) {
            return 'Invalid Duration';
        }
        const l = orderedUnits
            .map((unit) => {
                const val = this._values[unit];
                if (val === undefined) {
                    return null;
                }
                return getNumberFormat(this._locale.locale, {
                    style: 'unit',
                    unitDisplay: 'long',
                    ...options,
                    unit: unit.slice(0, -1),
                }).format(val);
            })
            .filter(Boolean) as string[];

        return getListFormat(this._locale.locale, {
            type: 'conjunction',
            style: options.listStyle || 'narrow',
        }).format(l);
    }

    format(formatInput: string, options: FormatOptions & {forceSimple?: boolean} = {}): string {
        if (!this.isValid()) {
            return 'Invalid Duration';
        }

        const formattingTokens = /(\[[^[]*\])|y+|M+|w+|d+|h+|m+|s+|S+|./g;
        const tokens: Array<
            {literal: true; value: string} | {literal: false; padTo: number; unit: DurationUnit}
        > = [];
        const units: DurationUnit[] = [];
        let match: RegExpMatchArray | null;
        while ((match = formattingTokens.exec(formatInput))) {
            const value = match[0];
            const escaped = match[1];
            const unit = tokenToField(value[0]);
            if (unit) {
                tokens.push({literal: false, padTo: value.length, unit});
                units.push(unit);
            } else if (escaped) {
                tokens.push({literal: true, value: escaped.slice(1, -1)});
            } else {
                tokens.push({literal: true, value});
            }
        }

        const dur = this.shiftTo(units);
        let result = '';

        const {floor = true, forceSimple, ...other} = options;
        const useIntlFormatter = !forceSimple || Object.keys(other).length > 0;

        for (const token of tokens) {
            if (token.literal) {
                result += token.value;
            } else {
                const val = dur.get(token.unit);

                if (useIntlFormatter) {
                    const formatter = getNumberFormat(this._locale.locale, {
                        useGrouping: false,
                        ...other,
                        minimumIntegerDigits: token.padTo,
                    });
                    const fixed = floor ? Math.floor(val) : val;
                    result += formatter.format(fixed);
                } else {
                    const fixed = floor ? Math.floor(val) : Math.round(val * 1000) / 1000;
                    result += `${fixed < 0 ? '-' : ''}${Math.abs(fixed)
                        .toString()
                        .padStart(token.padTo, '0')}`;
                }
            }
        }
        return result;
    }

    isValid(): boolean {
        return this._isValid;
    }

    locale(): string;
    locale(locale: string): Duration;
    locale(locale?: string): string | Duration {
        if (!locale) {
            return this._locale.locale;
        }
        return new DurationImpl({values: this._values, locale});
    }
}

export function isDuration(value: unknown): value is Duration {
    return DurationImpl.isDuration(value);
}

function daysToMonths(days: number) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return (days * 4800) / 146097;
}

function monthsToDays(months: number) {
    // the reverse of daysToMonths
    return (months * 146097) / 4800;
}

function tokenToField(token: string) {
    switch (token[0]) {
        case 'S':
            return 'millisecond';
        case 's':
            return 'second';
        case 'm':
            return 'minute';
        case 'h':
            return 'hour';
        case 'd':
            return 'day';
        case 'w':
            return 'week';
        case 'M':
            return 'month';
        case 'y':
            return 'year';
        default:
            return null;
    }
}
