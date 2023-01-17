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
});
