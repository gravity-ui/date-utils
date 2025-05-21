import MockDate from 'mockdate';

import {DEFAULT_SYSTEM_DATE_FORMAT} from '../constants';
import {settings} from '../settings';
import type {DurationUnit} from '../typings';

import {dateTime, isDateTime} from './dateTime';

const MOCKED_DATE = '2021-08-07T12:10:00';

beforeEach(() => {
    MockDate.set(MOCKED_DATE);
});

afterEach(() => {
    MockDate.reset();
    settings.updateLocale({weekStart: 1, yearStart: 1});
});

describe('DateTime', () => {
    const TESTED_DATE_STRING = '2021-08-07';

    describe('isDateTime', () => {
        it('should return true in case of DateTime checking', () => {
            const date = dateTime();
            const result = isDateTime(date);
            expect(result).toEqual(true);
        });

        it('should return false in case of string checking', () => {
            const result = isDateTime(TESTED_DATE_STRING);
            expect(result).toEqual(false);
        });
    });

    describe('dateTime', () => {
        it('should return now date in case of absence of input arg', () => {
            const date = dateTime();
            const now = new Date();
            expect(date.toISOString()).toEqual(now.toISOString());
        });

        it('should return DateTime in case of correct input arg', () => {
            const date = dateTime({input: TESTED_DATE_STRING}).format(DEFAULT_SYSTEM_DATE_FORMAT);
            expect(date).toEqual(TESTED_DATE_STRING);
        });

        it('should return DateTime with specified timeZone', () => {
            const date = dateTime({timeZone: 'Asia/Tokyo'}).format('Z');
            expect(date).toEqual('+09:00');
        });

        it('should return offset as number of minutes for specified timeZone', () => {
            const date = dateTime({timeZone: 'Asia/Tokyo'});
            const offset = date.utcOffset();
            expect(offset).toEqual(9 * 60);
        });

        test.each<[string | undefined, string]>([
            ['ru', '07 авг. 2021'],
            ['en', '07 Aug 2021'],
            ['incorrectLang', '07 Aug 2021'],
            [undefined, '07 Aug 2021'],
        ])('lang option (%p)', (lang, expected) => {
            const date = dateTime({input: TESTED_DATE_STRING, lang}).format('DD MMM YYYY');
            expect(date).toEqual(expected);
        });

        it('first day of week changed according to locale config', async () => {
            let date = dateTime({input: TESTED_DATE_STRING})
                .startOf('week')
                .format(DEFAULT_SYSTEM_DATE_FORMAT);
            expect(date).toEqual('2021-08-02');
            settings.updateLocale({weekStart: 0});
            date = dateTime({input: TESTED_DATE_STRING})
                .startOf('week')
                .format(DEFAULT_SYSTEM_DATE_FORMAT);
            expect(date).toEqual('2021-08-01');
        });

        it('should set/get hours, minutes, seconds, millisecond', () => {
            let date = dateTime({input: TESTED_DATE_STRING});
            expect(date.millisecond()).toEqual(0);
            expect(date.second()).toEqual(0);
            expect(date.minute()).toEqual(0);
            expect(date.hour()).toEqual(0);
            date = date.hour(10).minute(10).second(10).millisecond(999);
            expect(date.millisecond()).toEqual(999);
            expect(date.second()).toEqual(10);
            expect(date.minute()).toEqual(10);
            expect(date.hour()).toEqual(10);
        });

        test.each<[{amount: string; unit: DurationUnit; durationUnit: DurationUnit}, string]>([
            [{amount: '-24', unit: 'h', durationUnit: 'm'}, '2020-02-13T22:34:59.999Z'],
            [{amount: '-300', unit: 's', durationUnit: 's'}, '2020-02-14T22:29:55.999Z'],
        ])('endOf (%j)', ({amount, unit, durationUnit}, expected) => {
            MockDate.set('2020-02-14T22:34:55.359Z');
            const date = dateTime({timeZone: 'UTC'}).add(amount, unit).endOf(durationUnit);
            expect(date.toISOString()).toEqual(expected);
        });

        test.each<[{amount: string; unit: DurationUnit; durationUnit: DurationUnit}, string]>([
            [{amount: '+60', unit: 'm', durationUnit: 's'}, '2020-02-14T23:34:55.000Z'],
        ])('startOf (%j)', ({amount, unit, durationUnit}, expected) => {
            MockDate.set('2020-02-14T22:34:55.359Z');
            const date = dateTime({timeZone: 'UTC'}).add(amount, unit).startOf(durationUnit);
            expect(date.toISOString()).toEqual(expected);
        });

        it('isSame', () => {
            const nativeDate = new Date(Date.UTC(2023, 0, 15));
            const date1 = dateTime({input: nativeDate, timeZone: 'Europe/Amsterdam'});
            const date2 = dateTime({input: nativeDate, timeZone: 'America/New_York'});
            expect(date1.isSame(date2)).toBe(true);
            expect(date1.isSame(date2.add(1, 'ms'))).toBe(false);
            expect(date1.isSame(date2.add(1, 'ms'), 's')).toBe(true);
        });

        it('input without timezone', () => {
            const date = dateTime({input: MOCKED_DATE, timeZone: 'Europe/Amsterdam'});
            const amsterdamOffset = 120;

            expect(date.format()).toBe(
                dateTime({input: MOCKED_DATE, timeZone: 'UTC'}).utcOffset(amsterdamOffset).format(),
            );
        });

        it('change timeZone', () => {
            const date = dateTime({input: '2023-10-29T00:00:00Z', timeZone: 'Europe/Moscow'});
            expect(date.format()).toBe('2023-10-29T03:00:00+03:00');
            expect(date.add(1, 'hour').format()).toBe('2023-10-29T04:00:00+03:00');
            expect(date.timeZone('Europe/Amsterdam').format()).toBe('2023-10-29T02:00:00+02:00');
            expect(date.timeZone('Europe/Amsterdam').add(1, 'hour').format()).toBe(
                '2023-10-29T02:00:00+01:00',
            );
            expect(date.timeZone('Europe/Amsterdam', true).format()).toBe(
                '2023-10-29T03:00:00+01:00',
            );
            expect(date.timeZone('Europe/Amsterdam', true).subtract(1, 'hour').format()).toBe(
                '2023-10-29T02:00:00+01:00',
            );
            expect(date.timeZone('Europe/Amsterdam', true).subtract(2, 'hour').format()).toBe(
                '2023-10-29T02:00:00+02:00',
            );
        });

        it('0 offset timeZone', () => {
            const date = dateTime({input: '2023-01-01T00:00:00Z', timeZone: 'Europe/London'});
            expect(date.format()).toBe('2023-01-01T00:00:00Z');
            expect(date.add(5, 'months').format()).toBe('2023-06-01T00:00:00+01:00');
            expect(date.add(5, 'months').subtract({M: 4, d: 5}).format()).toBe(
                '2023-01-27T00:00:00Z',
            );

            const dateUtc = dateTime({input: '2023-01-01T00:00:00Z', timeZone: 'utc'});
            expect(dateUtc.format()).toBe('2023-01-01T00:00:00Z');
            expect(dateUtc.add(5, 'months').format()).toBe('2023-06-01T00:00:00Z');
            expect(dateUtc.add(5, 'months').subtract({M: 4, d: 5}).format()).toBe(
                '2023-01-27T00:00:00Z',
            );
        });

        it('examples from issues', () => {
            let date = dateTime({input: '2000-01-01T00:00:00Z', timeZone: 'utc'});
            expect(date.format('D MMMM YYYY HH:mm z')).toBe('1 January 2000 00:00 UTC');
            expect(date.toString()).toBe('Sat, 01 Jan 2000 00:00:00 GMT');

            expect(dateTime({input: '2000-01-01T00:00:00', timeZone: 'UTC'}).toISOString()).toBe(
                dateTime({input: '2000-01-01T00:00:00', timeZone: 'Europe/Moscow'}).toISOString(),
            );

            date = dateTime({input: '2023-11-06T00:00:00', timeZone: 'UTC'});
            expect(date.format('z Z')).toBe('UTC +00:00');
            expect(date.add({day: 1}).format('z Z')).toBe('UTC +00:00');
            expect(date.utcOffset(60).format('z Z')).toBe('UTC +01:00');

            const nativeDate = new Date('2023-11-06T00:00:00');
            nativeDate.setDate(7);
            expect(date.add({day: 1}).toISOString()).toBe(nativeDate.toISOString());
            expect(date.add({day: 1}).toString()).toBe(nativeDate.toUTCString());

            date = dateTime({input: '2023-11-06T00:00:00', timeZone: 'Europe/London'});
            expect(date.add({day: 1}).toISOString()).toBe(nativeDate.toISOString());
            expect(date.add({day: 1}).toString()).toBe(nativeDate.toUTCString());

            expect(
                dateTime({
                    input: new Date(Date.UTC(2023, 0, 26, 0, 0, 0)),
                    timeZone: 'UTC',
                })
                    .utcOffset(4 * 24 * 60)
                    .add(1, 'month')
                    .format(),
            ).toBe('2023-02-28T00:00:00+96:00');
            expect(
                dateTime({
                    input: '2023-01-30T22:00:00Z',
                    timeZone: 'Europe/Amsterdam',
                })
                    .add(6, 'month')
                    .format(),
            ).toBe('2023-07-30T23:00:00+02:00');
            expect(
                dateTime({
                    input: '2023-08-30T22:00:00Z',
                    timeZone: 'Europe/Amsterdam',
                })
                    .set('week', 3)
                    .format(),
            ).toBe('2023-01-12T00:00:00+01:00');

            expect(dateTime({input: '20130531', format: 'YYYYMMDD'}).month(3).month()).toBe(3);
        });

        it('should work with years >= 0 and < 100 ', () => {
            let date = dateTime({input: '0001-01-12T00:00:00Z', timeZone: 'Europe/Amsterdam'});
            expect(date.toISOString()).toBe('0001-01-12T00:00:00.000Z');
            expect(date.startOf('s').toISOString()).toBe('0001-01-12T00:00:00.000Z');
            expect(date.startOf('s').valueOf()).toBe(date.valueOf());
            expect(date.set({year: 2, month: 1, date: 20}).toISOString()).toBe(
                '0002-02-20T00:00:00.000Z',
            );
            expect(date.add(1, 'year').toISOString()).toBe('0002-01-12T00:00:00.000Z');
            expect(date.subtract(1, 'year').toISOString()).toBe('0000-01-12T00:00:00.000Z');

            expect(date.isSame(date)).toBe(true);
            expect(date.valueOf()).toBe(date.startOf('ms').valueOf());

            date = dateTime({input: '2023-01-01T00:00:00.000Z', timeZone: 'Europe/Moscow'});
            const date2 = date.set('y', 2);
            const date3 = date2.set({h: date2.hour(), m: date2.minute(), s: date2.second()});
            expect(date3.toISOString()).toBe(date2.toISOString());

            expect(
                dateTime({
                    input: '0002-01-01T00:00:00.000Z',
                    timeZone: 'Europe/Moscow',
                }).toISOString(),
            ).toBe('0002-01-01T00:00:00.000Z');
        });

        describe('European date format parsing', () => {
            test.each<[string, [number, number, number, number, number, number, number]]>([
                ['13.05.1997', [1997, 4, 13, 0, 0, 0, 0]], // dot
                ['13/05/1997', [1997, 4, 13, 0, 0, 0, 0]], // slash
                ['13-05-1997', [1997, 4, 13, 0, 0, 0, 0]], // dash
                ['13 05 1997', [1997, 4, 13, 0, 0, 0, 0]], // space
                ['13.05.1997 14:30', [1997, 4, 13, 14, 30, 0, 0]],
                ['13.05.1997 14:30:45', [1997, 4, 13, 14, 30, 45, 0]],
                ['13.05.1997 14:30:45.123', [1997, 4, 13, 14, 30, 45, 123]],
                // Single digit day and month
                ['1.5.1997', [1997, 4, 1, 0, 0, 0, 0]],
                ['1.5.1997 23:59:59.999', [1997, 4, 1, 23, 59, 59, 999]],
                ['1.5.1997 7:8:9.100', [1997, 4, 1, 7, 8, 9, 100]],
            ])('should correctly parse European date format %s', (input, expected) => {
                const date = dateTime({input, format: undefined});
                expect([
                    date.year(),
                    date.month(),
                    date.date(),
                    date.hour(),
                    date.minute(),
                    date.second(),
                    date.millisecond(),
                ]).toEqual(expected);
                expect(date.isValid()).toEqual(true);
            });
        });
    });
});
