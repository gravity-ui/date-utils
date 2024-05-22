import cloneDeep from 'lodash/cloneDeep';

import {isLikeRelative, parse} from '../datemath';
import dayjs from '../dayjs';
import {normalizeTimeZone} from '../timeZone';

import {localeLoaders} from './locales';
import type {Locale, Parser, PublicSettings, UpdateLocaleConfig} from './types';

class Settings implements PublicSettings {
    // 'en' - preloaded locale in dayjs
    private loadedLocales = new Set(['en']);
    private defaultLocale = 'en';
    private defaultTimeZone = 'system';
    private parser: Parser = {parse, isLikeRelative};

    constructor() {
        this.updateLocale({
            weekStart: 1, // First day of week is Monday
            yearStart: 1, // First week of year must contain 1 January
        });
    }

    async loadLocale(locale: string) {
        if (!this.isLocaleLoaded(locale)) {
            try {
                const localeInLowerCase = locale.toLocaleLowerCase();
                const localeLoader = localeLoaders[localeInLowerCase];
                await localeLoader();
                this.loadedLocales.add(localeInLowerCase);
            } catch (error) {
                throw new Error(
                    `Can't load locale "${locale}". Either it does not exist, or there was a connection problem. Check the dayjs locations list: https://github.com/iamkun/dayjs/tree/dev/src/locale`,
                );
            }
        }
    }

    getLocale() {
        return this.defaultLocale;
    }

    getLocaleData(): Locale {
        const locales = dayjs.Ls;

        let localeObject = locales[this.getLocale()];
        if (!localeObject) {
            localeObject = locales.en;
        }

        if (!localeObject) {
            throw new Error('There is something really wrong happening. Locale data is absent.');
        }

        return cloneDeep(localeObject) as Locale;
    }

    setLocale(locale: string) {
        if (!this.isLocaleLoaded(locale)) {
            throw new Error(
                `Seems you are trying to set an unloaded locale "${locale}". Load it first by calling settings.loadLocale('${locale}'). Check the dayjs locations list: https://github.com/iamkun/dayjs/tree/dev/src/locale`,
            );
        }

        this.defaultLocale = locale;
    }

    updateLocale(config: UpdateLocaleConfig) {
        const locale = this.getLocale();
        dayjs.updateLocale(locale, config);
    }

    setDefaultTimeZone(zone: 'system' | (string & {})) {
        this.defaultTimeZone = normalizeTimeZone(zone, 'system');
    }

    getDefaultTimeZone() {
        return this.defaultTimeZone;
    }

    setRelativeParser(parser: Parser) {
        this.parser = parser;
    }

    getRelativeParser() {
        return this.parser;
    }

    private isLocaleLoaded(locale: string) {
        const localeInLowerCase = locale.toLocaleLowerCase();
        return this.loadedLocales.has(localeInLowerCase);
    }
}

/**
 * Settings to manage DateTime customization
 */
export const settings = new Settings();
