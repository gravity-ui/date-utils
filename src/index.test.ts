import {DateTime, dateTime, guessUserTimeZone} from './index';

describe('Public API', () => {
    const date = dateTime({input: '2000-02-02'});

    test.each<keyof DateTime>([
        'add',
        'set',
        'diff',
        'endOf',
        'format',
        'fromNow',
        'from',
        'isSame',
        'isBefore',
        'isValid',
        'local',
        'locale',
        'startOf',
        'subtract',
        'toDate',
        'toISOString',
        'isoWeekday',
        'valueOf',
        'unix',
        'utc',
        'utcOffset',
        'daysInMonth',
        'date',
        'month',
        'year',
        'day',
        'hour',
        'minute',
    ])('method %p is supported', (method) => {
        expect(date).toHaveProperty(method);
    });

    it('timezones are supported', () => {
        expect(() => guessUserTimeZone()).not.toThrow();
        expect(typeof guessUserTimeZone()).toBe('string');
    });

    it('year quarters are supported', () => {
        expect(date.startOf('Q').format('YYYY-MM-DD')).toBe('2000-01-01');
    });

    it('localized formats are supported', () => {
        expect(date.locale('en').format('L')).toBe('02/02/2000');
        expect(date.locale('ru').format('L')).toBe('02.02.2000');

        expect(date.locale('en').format('LL')).toBe('February 2, 2000');
        expect(date.locale('ru').format('LL')).toBe('2 февраля 2000 г.');

        expect(date.locale('en').format('LT')).toBe('12:00 AM');
        expect(date.locale('ru').format('LT')).toBe('0:00');

        expect(date.locale('en').format('LTS')).toBe('12:00:00 AM');
        expect(date.locale('ru').format('LTS')).toBe('0:00:00');
    });

    it('timezones abbrevations are suported', () => {
        const dateWithTimezone = dateTime({input: '2000-02-02', timeZone: 'Europe/London'}).locale(
            'en',
        );
        const [_, shortTimezone] = dateWithTimezone.format('L z').split(' ');

        expect(shortTimezone).toBe('GMT');

        const [__, timezone] = dateWithTimezone.format('L zzz').split(' ');

        expect(timezone).toBe('Greenwich');
    });

    it('utc timezone is supported', () => {
        const dateWithTimezone = dateTime({
            input: '2000-02-02T00:00:00.001Z',
            timeZone: 'utc',
        });

        expect(dateWithTimezone.format('L z')).toBe('02/02/2000 UTC');
    });
});
