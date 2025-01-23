import {settings} from '../settings';

import {LocaleIntl} from './intl';
import {getLocaleOptions} from './localeOptions';
import type {
    DateTimeFormatter,
    Locale,
    NumberFormatter,
    RelativeNumberFormatter,
    WeekInfo,
} from './types';

export class LocaleImpl implements Locale {
    #localeIntl: LocaleIntl;
    #weekInfo: WeekInfo | null;

    constructor(
        locale = settings.getDefaultLocale(),
        opts: {
            weekInfo?: WeekInfo;
        } = {},
    ) {
        this.#localeIntl = LocaleIntl.create(locale);
        this.#weekInfo = validateWeekSettings(opts.weekInfo) ?? settings.getDefaultWeekSettings();
    }

    get locale() {
        return this.#localeIntl.locale;
    }

    get longDateFormat() {
        return getLocaleOptions(this.#localeIntl.locale).longDateFormat;
    }

    get relativeTime() {
        return getLocaleOptions(this.#localeIntl.locale).relativeTime;
    }

    months(length: 'long' | 'short' | 'narrow', isStandalone?: boolean): string[] {
        return this.#localeIntl.months(length, isStandalone);
    }

    weekdays(length: 'long' | 'short' | 'narrow', isStandalone?: boolean) {
        return this.#localeIntl.weekdays(length, isStandalone);
    }

    eras(length: 'long' | 'short' | 'narrow') {
        return this.#localeIntl.eras(length);
    }

    meridiems(length: 'long' | 'short') {
        return this.#localeIntl.meridiems(length);
    }

    meridiem(hour: number, length: 'long' | 'short') {
        return this.#localeIntl.meridiem(hour, length);
    }

    weekInfo() {
        if (this.#weekInfo) {
            return this.#weekInfo;
        }
        return this.#localeIntl.weekInfo();
    }

    ordinal(
        n: number,
        unit: 'date' | 'weekday' | 'dayOfYear' | 'weekNumber' | 'month' | 'quarter',
    ): string {
        return getLocaleOptions(this.#localeIntl.locale).ordinal(n, unit);
    }

    ordinalParseUnit(unit: 'date' | 'weekday' | 'dayOfYear' | 'weekNumber' | 'month' | 'quarter') {
        return getLocaleOptions(this.#localeIntl.locale).ordinalParseUnit(unit);
    }

    dateTimeFormatter(): DateTimeFormatter {
        throw new Error('Not implemented');
    }

    numberFormatter(): NumberFormatter {
        throw new Error('Not implemented');
    }

    relativeNumberFormatter(): RelativeNumberFormatter {
        throw new Error('Not implemented');
    }
}
export function validateWeekSettings(weekInfo: WeekInfo | null | undefined) {
    if (weekInfo === null || weekInfo === undefined) {
        return null;
    }
    if (typeof weekInfo !== 'object') {
        throw new Error('Week settings must be an object');
    }

    if (
        !Number.isInteger(weekInfo.firstDay) ||
        weekInfo.firstDay < 1 ||
        weekInfo.firstDay > 7 ||
        !Number.isInteger(weekInfo.minimalDays) ||
        weekInfo.minimalDays < 1 ||
        weekInfo.minimalDays > 7 ||
        !Array.isArray(weekInfo.weekend) ||
        weekInfo.weekend.some((v) => !Number.isInteger(v) || v < 1 || v > 7)
    ) {
        throw new Error('Invalid week settings');
    }
    return {
        firstDay: weekInfo.firstDay,
        minimalDays: weekInfo.minimalDays,
        weekend: Array.from(weekInfo.weekend),
    };
}
