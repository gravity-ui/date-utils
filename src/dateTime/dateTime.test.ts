import MockDate from 'mockdate';
import {DEFAULT_SYSTEM_DATE_FORMAT} from '../constants';
import {settings} from '../settings';
import {dateTime, isDateTime} from './dateTime';

const MOCKED_DATE = '2021-08-07T12:10:00';

MockDate.set(MOCKED_DATE);

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
    });
});
