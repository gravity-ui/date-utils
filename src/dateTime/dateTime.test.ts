import MockDate from 'mockdate';
import {DEFAULT_SYSTEM_DATE_FORMAT} from '../constants';
import {settings} from '../settings';
import {dateTime, isDateTime} from './dateTime';
import type {DurationUnit} from '../typings';

const MOCKED_DATE = '2021-08-07T12:10:00';

MockDate.set(MOCKED_DATE);

afterEach(() => {
    MockDate.set(MOCKED_DATE);
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
    });
});
