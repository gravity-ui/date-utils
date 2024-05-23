import type {LongDateFormat} from '../settings/types';

export const DEFAULT_SYSTEM_DATE_FORMAT = 'YYYY-MM-DD';
export const INVALID_DATE_STRING = 'Invalid Date';
export const englishFormats = {
    LTS: 'h:mm:ss A',
    LT: 'h:mm A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A',
} as const satisfies LongDateFormat;
