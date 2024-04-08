import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import arraySupport from 'dayjs/plugin/arraySupport';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import objectSupport from 'dayjs/plugin/objectSupport';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(arraySupport);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
// advancedFormat must be after localizedFormat
dayjs.extend(advancedFormat);
// utc must be after localizedFormat and advancedFormat
dayjs.extend(utc);
dayjs.extend(timezone);
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
