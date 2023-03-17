import dayjs from 'dayjs';

import arraySupport from 'dayjs/plugin/arraySupport';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import objectSupport from 'dayjs/plugin/objectSupport';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(arraySupport);
dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
// advancedFormat requires timezone plugin
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
// the modifications made in objectSupport would preserve other plugins behavior
// but not vice versa, therefore it should come last
dayjs.extend(objectSupport);

export default dayjs;

export type {ConfigTypeMap, ConfigType} from 'dayjs';
export type {
    arraySupport,
    customParseFormat,
    isoWeek,
    quarterOfYear,
    relativeTime,
    timezone,
    utc,
    localizedFormat,
    updateLocale,
    objectSupport,
};
