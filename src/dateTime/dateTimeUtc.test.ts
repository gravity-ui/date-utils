import MockDate from 'mockdate';

import {settings} from '../settings';

import {dateTimeUtc, isDateTime} from './dateTime';

const MOCKED_DATE = '2021-08-07T12:10:00';

beforeEach(() => {
    MockDate.set(MOCKED_DATE);
});

afterEach(() => {
    MockDate.reset();
    settings.updateLocale({weekStart: 1, yearStart: 1});
});

describe('DateTimeUtc', () => {
    describe('isDateTime', () => {
        it('should return true in case of DateTime checking', () => {
            const date = dateTimeUtc();
            const result = isDateTime(date);
            expect(result).toEqual(true);
        });
    });

    describe('dateTimeUtc', () => {
        it('should return now date in case of absence of input arg', () => {
            const date = dateTimeUtc();
            const now = new Date();
            expect(date.toISOString()).toEqual(now.toISOString());
        });

        it('should return DateTime with UTC timeZone', () => {
            const zone = dateTimeUtc().timeZone();
            expect(zone).toEqual('UTC');
        });

        it('should return 0 offset', () => {
            const date = dateTimeUtc();
            const offset = date.utcOffset();
            expect(offset).toEqual(0);
        });

        test.each<[string, string]>([
            ['2023-12-31', '2023-12-31T00:00:00.000Z'],
            ['2023-12-31T01:00', '2023-12-31T01:00:00.000Z'],
            ['2023-12-31T01:00Z', '2023-12-31T01:00:00.000Z'],
            ['2023-12-31T03:00+02:00', '2023-12-31T01:00:00.000Z'],
        ])('input option (%p)', (input, expected) => {
            const date = dateTimeUtc({input}).toISOString();
            expect(date).toEqual(expected);
        });

        test.each<[string, string, string]>([
            ['31.12.2023', 'DD.MM.YYYY', '2023-12-31T00:00:00.000Z'],
            ['31.12.2023 01:00', 'DD.MM.YYYY HH:mm', '2023-12-31T01:00:00.000Z'],
        ])('input (%p) format (%p)', (input, format, expected) => {
            const date = dateTimeUtc({input, format}).toISOString();
            expect(date).toEqual(expected);
        });
    });
});
