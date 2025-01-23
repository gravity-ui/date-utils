import type {WeekInfo} from './types';

const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();
export function getDateTimeFormat(locale: string, options: Intl.DateTimeFormatOptions = {}) {
    const key = JSON.stringify([locale, options]);
    let dateTimeFormat = dateTimeFormatCache.get(key);
    if (!dateTimeFormat) {
        dateTimeFormat = new Intl.DateTimeFormat(locale, options);
        dateTimeFormatCache.set(key, dateTimeFormat);
    }
    return dateTimeFormat;
}

const numberFormatCache = new Map<string, Intl.NumberFormat>();
export function getNumberFormat(locale: string, options: Intl.NumberFormatOptions = {}) {
    const key = JSON.stringify([locale, options]);
    let numberFormat = numberFormatCache.get(key);
    if (!numberFormat) {
        numberFormat = new Intl.NumberFormat(locale, options);
        numberFormatCache.set(key, numberFormat);
    }
    return numberFormat;
}

const relativeTimeFormatCache = new Map<string, Intl.RelativeTimeFormat>();
export function getRelativeTimeFormat(
    locale: string,
    options: Intl.RelativeTimeFormatOptions = {},
) {
    const key = JSON.stringify([locale, options]);
    let relativeTimeFormat = relativeTimeFormatCache.get(key);
    if (!relativeTimeFormat) {
        relativeTimeFormat = new Intl.RelativeTimeFormat(locale, options);
        relativeTimeFormatCache.set(key, relativeTimeFormat);
    }
    return relativeTimeFormat;
}

const listFormatCache = new Map<string, Intl.ListFormat>();
export function getListFormat(locale: string, options: Intl.ListFormatOptions = {}) {
    const key = JSON.stringify([locale, options]);
    let listFormat = listFormatCache.get(key);
    if (!listFormat) {
        listFormat = new Intl.ListFormat(locale, options);
        listFormatCache.set(key, listFormat);
    }
    return listFormat;
}

const fallbackWeekInfo: WeekInfo = {
    firstDay: 1,
    minimalDays: 4,
    weekend: [6, 7],
};

const weekInfoCache = new Map<string, WeekInfo>();
export function getWeekInfo(locale: string) {
    let weekInfo = weekInfoCache.get(locale);
    if (!weekInfo) {
        try {
            const localeInstance = new Intl.Locale(locale);
            weekInfo =
                'getWeekInfo' in localeInstance
                    ? // @ts-expect-error
                      localeInstance.getWeekInfo()
                    : // @ts-expect-error
                      localeInstance.weekInfo;
        } catch {}

        if (!weekInfo) {
            weekInfo = fallbackWeekInfo;
        }
        weekInfoCache.set(locale, weekInfo as WeekInfo);
    }

    return weekInfo;
}

let systemLocaleCache: string | undefined;
export function getSystemLocale() {
    if (systemLocaleCache) {
        return systemLocaleCache;
    }
    systemLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
    return systemLocaleCache;
}
