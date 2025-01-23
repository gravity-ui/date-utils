import type {LongDateFormat} from '../locale/types';

export const DEFAULT_SYSTEM_DATE_FORMAT = 'YYYY-MM-DD';
export const INVALID_DATE_STRING = 'Invalid Date';
export const englishFormats = {
    LTS: 'h:mm:ss a',
    LT: 'h:mm a',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm a',
    LLLL: 'dddd, MMMM D, YYYY h:mm a',
} as const satisfies LongDateFormat;

export const HTML5_INPUT_FORMATS = {
    DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
    DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
    DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
    DATE: 'YYYY-MM-DD', // <input type="date" />
    TIME: 'HH:mm', // <input type="time" />
    TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
    TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
    WEEK: 'GGGG-[W]WW', // <input type="week" />
    MONTH: 'YYYY-MM', // <input type="month" />
} as const;
