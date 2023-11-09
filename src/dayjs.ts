import dayjs from 'dayjs';

import arraySupport from 'dayjs/plugin/arraySupport';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import objectSupport from 'dayjs/plugin/objectSupport';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import {fixOffset, timeZoneOffset} from './timeZone';

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

dayjs.extend((_, Dayjs, d) => {
    const proto = Dayjs.prototype;

    proto.tz = function (timeZone: string, keepLocalTime = false) {
        let ts = this.valueOf();
        let offset = timeZoneOffset(timeZone, ts);

        if (keepLocalTime) {
            const oldOffset = this.utcOffset();
            ts += oldOffset * 60 * 1000;
            [ts, offset] = fixOffset(ts, offset, timeZone);
        }

        const target = new Date(ts).toLocaleString('en-US', {timeZone});
        // @ts-expect-error
        const ins = d(target, {locale: this.$L}).$set('millisecond', ts % 1000);
        ins.$offset = offset;
        ins.$u = offset === 0;
        ins.$x.$timezone = timeZone;
        return ins;
    };
});

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
