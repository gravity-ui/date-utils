import dayjs from '../dayjs';
import type {UpdateLocaleConfig} from './types';

class Settings {
    // 'en' - preloaded locale in dayjs
    private loadedLocales = new Set(['en']);

    constructor() {
        this.updateLocale({weekStart: 1});
    }

    async loadLocale(locale: string) {
        if (!this.isLocaleLoaded(locale)) {
            try {
                const localeInLowerCase = locale.toLocaleLowerCase();
                // https://github.com/iamkun/dayjs/issues/792#issuecomment-639961997
                await import(`dayjs/locale/${localeInLowerCase}.js`);
                this.loadedLocales.add(localeInLowerCase);
            } catch (error) {
                throw new Error(
                    `Can't load locale "${locale}". Either it does not exist, or there was a connection problem. Check the dayjs locations list: https://github.com/iamkun/dayjs/tree/dev/src/locale`,
                );
            }
        }
    }

    getLocale() {
        return dayjs.locale();
    }

    setLocale(locale: string) {
        if (!this.isLocaleLoaded(locale)) {
            throw new Error(
                `Seems you are trying to set an unloaded locale "${locale}". Load it first by calling settings.loadLocale('${locale}'). Check the dayjs locations list: https://github.com/iamkun/dayjs/tree/dev/src/locale`,
            );
        }

        dayjs.locale(locale);
    }

    updateLocale(config: UpdateLocaleConfig) {
        const locale = this.getLocale();
        dayjs.updateLocale(locale, config);
    }

    private isLocaleLoaded(locale: string) {
        const localeInLowerCase = locale.toLocaleLowerCase();
        return this.loadedLocales.has(localeInLowerCase);
    }
}

/**
 * Settings to manage Dayjs customization
 */
export const settings = new Settings();
