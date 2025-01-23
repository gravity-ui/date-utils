import {getDateTimeFormat, getWeekInfo} from './cache';
import * as english from './english';

type ListCache = Partial<Record<'long' | 'short' | 'narrow', string[]>>;
interface ListsCache {
    format: ListCache;
    standalone: ListCache;
}

const localeCache = new Map<string, LocaleIntl>();

interface LocaleData {
    locale: string;
    baseName: string;
    language: string;
    numberingSystem?: string;
    calendar?: string;
}

export class LocaleIntl {
    #locale: string;
    #baseName = 'en';
    #language = 'en';
    #numberingSystem;
    #calendar;
    #weekdaysCache: ListsCache = {format: {}, standalone: {}};
    #monthsCache: ListsCache = {format: {}, standalone: {}};
    #erasCache: ListCache = {};
    #meridiemsCache: ListCache = {};

    static create(locale: string, opts: {numberingSystem?: string; calendar?: string} = {}) {
        const data = parseLocale(locale, opts);

        let cached = localeCache.get(data.locale);
        if (!cached) {
            cached = new LocaleIntl(data);
            localeCache.set(data.locale, cached);
        }

        return cached;
    }

    private constructor(data: LocaleData) {
        this.#locale = data.locale;
        this.#baseName = data.baseName;
        this.#language = data.language;
        this.#numberingSystem = data.numberingSystem ?? 'latn';
        this.#calendar = data.calendar ?? 'gregory';
    }

    get locale() {
        return this.#locale;
    }

    get baseName() {
        return this.#baseName;
    }

    get language() {
        return this.#language;
    }

    get numberingSystem() {
        return this.#numberingSystem;
    }

    get calendar() {
        return this.#calendar;
    }
    months(length: 'long' | 'short' | 'narrow', isStandalone?: boolean): string[] {
        return list(this, length, english.months, () => {
            const cache = this.#monthsCache[isStandalone ? 'standalone' : 'format'];
            if (cache[length]) {
                return cache[length];
            }
            const intlOptions: Intl.DateTimeFormatOptions = isStandalone
                ? {month: length}
                : {month: length, day: 'numeric'};
            const dtf = getDateTimeFormat(this.#locale, intlOptions);
            const months: string[] = [];
            for (let i = 0; i < 12; i++) {
                months.push(extract(Date.UTC(2016, i, 1), dtf, 'month') || '');
            }
            cache[length] = months;
            return months;
        });
    }

    weekdays(length: 'long' | 'short' | 'narrow', isStandalone = false) {
        return list(this, length, english.weekdays, () => {
            const cache = this.#weekdaysCache[isStandalone ? 'standalone' : 'format'];
            if (cache[length]) {
                return cache[length];
            }
            const intlOptions: Intl.DateTimeFormatOptions = isStandalone
                ? {weekday: length}
                : {weekday: length, year: 'numeric', month: 'long', day: 'numeric'};
            const dtf = getDateTimeFormat(this.#locale, intlOptions);
            const weekdays: string[] = [];
            for (let i = 0; i < 7; i++) {
                weekdays.push(extract(Date.UTC(2016, 10, 13 + i), dtf, 'weekday') || '');
            }
            cache[length] = weekdays;
            return weekdays;
        });
    }

    eras(length: 'long' | 'short' | 'narrow') {
        return list(this, length, english.eras, () => {
            const cache = this.#erasCache;
            if (cache[length]) {
                return cache[length];
            }
            const dtf = getDateTimeFormat(this.#locale, {era: length});
            const eras = [Date.UTC(-40, 0, 1), Date.UTC(2017, 0, 1)].map(
                (d) => extract(d, dtf, 'era') || '',
            );
            cache[length] = eras;
            return eras;
        });
    }

    meridiems(length: 'long' | 'short') {
        return list(this, length, english.meridiems, () => {
            const cache = this.#meridiemsCache;
            if (cache[length]) {
                return cache[length];
            }
            const dtf = getDateTimeFormat(this.#locale, {
                ...(length === 'short' ? {hour: 'numeric'} : {dayPeriod: 'short'}),
                hourCycle: 'h12',
                timeZone: 'UTC',
            });
            const meridiems = new Set<string>();
            for (let i = 0; i < 24; i++) {
                meridiems.add(extract(Date.UTC(2016, 11, 13, i), dtf, 'dayPeriod') || '');
            }
            cache[length] = Array.from(meridiems);
            return Array.from(meridiems);
        });
    }

    meridiem(hour: number, length: 'long' | 'short') {
        const mode = listingMode(this);
        if (mode === 'en') {
            return english.meridiem(hour, length);
        }

        const dtf = getDateTimeFormat(this.#locale, {
            ...(length === 'short' ? {hour: 'numeric'} : {dayPeriod: 'short'}),
            hourCycle: 'h12',
            timeZone: 'UTC',
        });

        return extract(Date.UTC(2016, 11, 13, hour), dtf, 'dayPeriod') || '';
    }

    weekInfo() {
        return getWeekInfo(this.#locale);
    }

    toString(): string {
        return `LocaleIntl(${this.#locale}, ${this.#numberingSystem}, ${this.#calendar})`;
    }
}

function list<T>(
    locale: LocaleIntl,
    length: T,
    englishData: (length: T) => string[],
    intlData: (length: T) => string[],
) {
    const mode = listingMode(locale);

    if (mode === 'intl') {
        return intlData(length);
    }

    return englishData(length);
}

function listingMode(locale: LocaleIntl) {
    const isEnglish = locale.locale === 'en' || locale.locale.toLowerCase() === 'en-us';
    const allStandard = locale.numberingSystem === 'latn' && locale.calendar === 'gregory';
    return isEnglish && allStandard ? 'en' : 'intl';
}

function extract(
    date: Date | number,
    dtf: Intl.DateTimeFormat,
    field: keyof Intl.DateTimeFormatPartTypesRegistry,
) {
    const formatted = dtf.formatToParts(date);
    return formatted.find((m) => m.type === field)?.value;
}

export function parseLocale(
    locale: string,
    opts: {numberingSystem?: string; calendar?: string} = {},
) {
    const l = new Intl.Locale(locale, opts);
    const {baseName, language, numberingSystem, calendar} = l;

    const intlLocale = new Intl.Locale(baseName, {numberingSystem, calendar}).toString();

    return {
        locale: intlLocale,
        baseName,
        language,
        numberingSystem,
        calendar,
    };
}
