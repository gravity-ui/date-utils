import {englishFormats} from '../constants';

import {ordinal, ordinalParseUnit, relativeTime} from './english';
import type {LocaleOptions} from './types';

const localeOptions = new Map<string, Partial<LocaleOptions>>();

function notImplemented(): never {
    throw new Error('Not Implemented');
}

export function setLocaleOptions(locale: string, options: Partial<LocaleOptions>) {
    localeOptions.set(locale, options);
}

export function getLocaleOptions(locale: string): LocaleOptions {
    const {baseName, language} = new Intl.Locale(locale);
    const options = localeOptions.get(baseName) ?? localeOptions.get(language) ?? {};

    const isEnglish = language === 'en';

    return {
        longDateFormat: options.longDateFormat ?? englishFormats,
        relativeTime: options.relativeTime ?? (isEnglish ? relativeTime : undefined),
        ordinal: options.ordinal ?? (isEnglish ? ordinal : notImplemented),
        ordinalParseUnit:
            options.ordinalParseUnit ?? (isEnglish ? ordinalParseUnit : notImplemented),
    };
}
