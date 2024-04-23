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

// @ts-expect-error
const listFormatCache = new Map<string, Intl.ListFormat>();
// @ts-expect-error
export function getListFormat(locale: string, options: Intl.ListFormatOptions = {}) {
    const key = JSON.stringify([locale, options]);
    let listFormat = listFormatCache.get(key);
    if (!listFormat) {
        // @ts-expect-error
        listFormat = new Intl.ListFormat(locale, options);
        listFormatCache.set(key, listFormat);
    }
    return listFormat;
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
