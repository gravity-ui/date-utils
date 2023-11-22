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

    // override `tz` method from timezone plugin
    // dayjs incorrectly transform dates to timezone if user local timezone use DST
    // and date near a switching time. For example, if local timezone `Europe/Amsterdam` then dayjs gives incorrect result:
    //   dayjs('2023-10-29T00:00:00Z').valueOf() !== dayjs('2023-10-29T00:00:00Z').tz('Europe/Moscow').valueOf()
    // and
    //   dayjs('2023-10-29T00:00:00Z').tz('Europe/Moscow').format() === '2023-10-29T03:00:00+04:00'
    // but should be '2023-10-29T03:00:00+03:00'
    proto.tz = function (timeZone: string, keepLocalTime = false) {
        const ts = this.valueOf();
        let localOffset = timeZoneOffset('system', ts);
        let offset = timeZoneOffset(timeZone, ts);
        let target: number | string = ts;

        const oldOffset = this.utcOffset();
        if (keepLocalTime && oldOffset !== offset) {
            target += oldOffset * 60 * 1000;
            [target, offset] = fixOffset(target, offset, timeZone);
        }

        if (offset !== 0 && localOffset !== offset) {
            target += offset * 60 * 1000;
            [target, localOffset] = fixOffset(target, localOffset, 'system');
        }

        const ins = d(target, {
            // @ts-expect-error get locale from current instance
            locale: this.$L,
            utc: offset === 0,
            // @ts-expect-error private fields used by utc and timezone plugins
            $offset: offset ? offset : undefined,
            x: {$timezone: timeZone, $localOffset: -localOffset},
        });
        return ins;
    };

    // @ts-expect-error used internally by DateTimeImpl
    d.createDayjs = function (ts: number, timeZone: string, offset: number, locale: string) {
        if (timeZone === 'system') {
            return d(ts, {locale});
        }

        let localOffset = timeZoneOffset('system', ts);
        let newTs = ts;
        if (offset !== 0 && localOffset !== offset) {
            newTs += offset * 60 * 1000;
            [newTs, localOffset] = fixOffset(newTs, localOffset, 'system');
        }
        const ins = d(newTs, {
            locale,
            utc: offset === 0,
            // @ts-expect-error private fields used by utc and timezone plugins
            $offset: offset ? offset : undefined,
            x: {$timezone: timeZone, $localOffset: -localOffset},
        });
        return ins;
    };
});

declare module 'dayjs' {
    interface LocalDate {
        (ts: number, timeZone: string, offset: number, locale: string): dayjs.Dayjs;
    }

    const createDayjs: LocalDate;
}

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
