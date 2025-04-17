import type {ParseOptions} from '../datemath';
import type dayjs from '../dayjs';
import type {DateTime} from '../typings';

export interface LongDateFormat {
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;
    LT: string;
    LTS: string;

    l?: string;
    ll?: string;
    lll?: string;
    llll?: string;
    lt?: string;
    lts?: string;
}

type RelativeFormatFunc = (
    v: number,
    withoutSuffix: boolean,
    unit: Exclude<keyof RelativeTime, 'future' | 'past'>,
    isFuture: boolean,
) => string;
export interface RelativeTime {
    future: string | ((v: string) => string);
    past: string | ((v: string) => string);
    s: string | RelativeFormatFunc;
    m: string | RelativeFormatFunc;
    mm: string | RelativeFormatFunc;
    h: string | RelativeFormatFunc;
    hh: string | RelativeFormatFunc;
    d: string | RelativeFormatFunc;
    dd: string | RelativeFormatFunc;
    M: string | RelativeFormatFunc;
    MM: string | RelativeFormatFunc;
    y: string | RelativeFormatFunc;
    yy: string | RelativeFormatFunc;
}

export interface Locale extends Omit<ILocale, 'ordinal' | 'formats' | 'relativeTime'> {
    yearStart?: number;
    meridiem?: (hour: number, minute: number, isLowercase: boolean) => string;
    ordinal?: (n: number, unit: string) => number | string;
    invalidDate?: string;
    formats?: LongDateFormat;
    relativeTime?: RelativeTime;
}

// https://dayjs.gitee.io/docs/ru/customization/customization
export type UpdateLocaleConfig = Parameters<typeof dayjs.updateLocale>[1] | Partial<Locale>;

export interface Parser {
    parse: (text: string, options?: ParseOptions) => DateTime | undefined;
    isLikeRelative: (text: string) => boolean;
}

/**
 * Library settings. The object is implemented as a singleton that manages global configuration for all DateTime instances throughout the application
 *
 * @example
 * ```javascript
 * import {settings} from '@gravity-ui/date-utils';

// Get current locale
const currentLocale = settings.getLocale(); // default is "en"
 * ```
 */
export interface PublicSettings {
    loadLocale(locale: string): Promise<void>;

    getLocale(): string;

    getLocaleData(): Locale;

    setLocale(locale: string): void;

    updateLocale(config: UpdateLocaleConfig): void;

    setDefaultTimeZone(zone: 'system' | (string & {})): void;

    getDefaultTimeZone(): string;

    setRelativeParser(parser: Parser): void;
}
