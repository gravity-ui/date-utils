import {isLikeRelative, parse} from '../datemath';
import {parseLocale} from '../locale/intl';
import {validateWeekSettings} from '../locale/locale';
import {getLocaleOptions, setLocaleOptions} from '../locale/localeOptions';
import type {LocaleOptions, WeekInfo} from '../locale/types';
import {normalizeTimeZone} from '../timeZone';

import type {Parser, PublicSettings} from './types';

class Settings implements PublicSettings {
    private defaultLocale = 'en';
    private defaultTimeZone = 'system';
    private parser: Parser = {parse, isLikeRelative};
    private defaultWeekSettings: WeekInfo | null = null;
    private twoDigitCutoffYear = 60;

    constructor() {
        this.defaultLocale = 'en';
    }

    getDefaultLocale() {
        return this.defaultLocale;
    }

    getDefaultLocaleOptions(): LocaleOptions {
        return getLocaleOptions(this.defaultLocale);
    }

    setDefaultLocale(locale: string): void {
        this.defaultLocale = parseLocale(locale).locale;
    }

    updateLocaleOptions(locale: string, options: Partial<LocaleOptions>) {
        const localeOptions = getLocaleOptions(locale);
        setLocaleOptions(locale, {
            ...localeOptions,
            ...options,
        });
    }

    getDefaultWeekSettings(): WeekInfo | null {
        return this.defaultWeekSettings;
    }

    setDefaultWeekSettings(weekSettings: WeekInfo | null): void {
        this.defaultWeekSettings = validateWeekSettings(weekSettings);
    }

    setDefaultTimeZone(zone: 'system' | (string & {})) {
        this.defaultTimeZone = normalizeTimeZone(zone, 'system');
    }

    getDefaultTimeZone() {
        return this.defaultTimeZone;
    }

    setTwoDigitCutoffYear(cutoffYear: number): void {
        this.twoDigitCutoffYear = cutoffYear % 100;
    }

    getTwoDigitCutoffYear(): number {
        return this.twoDigitCutoffYear;
    }

    setRelativeParser(parser: Parser) {
        this.parser = parser;
    }

    getRelativeParser() {
        return this.parser;
    }
}

/**
 * Settings to manage DateTime customization
 */
export const settings = new Settings();
