import dayjs from '../dayjs';
import {UtcTimeZone} from '../constants';
import {TimeZone, TimeZoneOptions} from '../typings';

export const getTimeZone = <T extends TimeZoneOptions>(options?: T): TimeZone => {
    return options?.timeZone ?? UtcTimeZone;
};

/**
 * Returns the user's time zone.
 */
export const guessUserTimeZone = () => dayjs.tz.guess();

/**
 * Returns all time zones.
 */
// remove when Intl definition is extended
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/49231
export const getTimeZonesList = (): string[] => Intl.supportedValuesOf?.('timeZone') || [];
