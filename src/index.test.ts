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
        expect(date.locale('en').startOf('Q').format('L')).toBe('01/01/2000');
        expect(date.locale('ru').startOf('Q').format('L')).toBe('01.01.2000');

        expect(date.locale('en').startOf('Q').format('LL')).toBe('January 1, 2000');
        expect(date.locale('ru').startOf('Q').format('LL')).toBe('1 января 2000 г.');

        expect(date.locale('en').startOf('Q').format('LT')).toBe('12:00 AM');
        expect(date.locale('ru').startOf('Q').format('LT')).toBe('0:00');

        expect(date.locale('en').startOf('Q').format('LTS')).toBe('12:00:00 AM');
        expect(date.locale('ru').startOf('Q').format('LTS')).toBe('0:00:00');
    });
});
