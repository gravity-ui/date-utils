import MockDate from 'mockdate';

import {UtcTimeZone} from '../constants';

import {dateTime} from './dateTime';

const MOCKED_DATE = '2021-08-07T12:10:00';

beforeEach(() => {
    MockDate.set(MOCKED_DATE);
});

afterEach(() => {
    MockDate.reset();
});

describe('DateTimeUtc', () => {
    describe('dateTimeUtc', () => {
        it('should return now date in case of absence of input arg', () => {
            const date = dateTime({timeZone: UtcTimeZone});
            const now = new Date();
            expect(date.toISOString()).toEqual(now.toISOString());
        });

        it('should return DateTime with UTC timeZone', () => {
            const zone = dateTime({timeZone: UtcTimeZone}).timeZone();
            expect(zone).toEqual('UTC');
        });

        it('should return 0 offset', () => {
            const date = dateTime({timeZone: UtcTimeZone});
            const offset = date.utcOffset();
            expect(offset).toEqual(0);
        });

        test.each<[string, string]>([
            ['2023-12-31', '2023-12-31T00:00:00.000Z'],
            ['2023-12-31T01:00', '2023-12-31T01:00:00.000Z'],
            ['2023-12-31T01:00Z', '2023-12-31T01:00:00.000Z'],
            ['2023-12-31T03:00+02:00', '2023-12-31T01:00:00.000Z'],
        ])('input option (%p)', (input, expected) => {
            const date = dateTime({input, timeZone: UtcTimeZone}).toISOString();
            expect(date).toEqual(expected);
        });

        test.each<[string, string, string]>([
            ['31.12.2023', 'DD.MM.YYYY', '2023-12-31T00:00:00.000Z'],
            ['31.12.2023 01:00', 'DD.MM.YYYY HH:mm', '2023-12-31T01:00:00.000Z'],
        ])('input (%p) format (%p)', (input, format, expected) => {
            const date = dateTime({input, format, timeZone: UtcTimeZone}).toISOString();
            expect(date).toEqual(expected);
        });

        test.each<[string, string]>([
            ['2023-12-31', '2023-12-31T00:00:00.000+02:30'],
            ['2023-12-31T01:00', '2023-12-31T01:00:00.000+02:30'],
            ['2023-12-31T01:00Z', '2023-12-31T01:00:00.000+02:30'],
            ['2023-12-31T03:00+02:00', '2023-12-31T01:00:00.000+02:30'],
        ])('input option (%p) with offset', (input, expected) => {
            const date = dateTime({input, offset: 150});
            expect(date.timeZone()).toBe(UtcTimeZone);
            expect(date.utcOffset()).toBe(150);
            expect(date.toISOString(true)).toEqual(expected);
        });

        test.each<[string, string, string]>([
            ['31.12.2023', 'DD.MM.YYYY', '2023-12-31T00:00:00.000+02:30'],
            ['31.12.2023 01:00', 'DD.MM.YYYY HH:mm', '2023-12-31T01:00:00.000+02:30'],
        ])('input (%p) format (%p) with offset', (input, format, expected) => {
            const date = dateTime({input, format, offset: 150});
            expect(date.timeZone()).toBe(UtcTimeZone);
            expect(date.utcOffset()).toBe(150);
            expect(date.toISOString(true)).toEqual(expected);
        });
    });
});
