import {dateTime} from '../dateTime';

test('from', () => {
    const start = dateTime();
    expect(start.from(start.add(5, 'seconds'))).toBe('a few seconds ago');
    expect(start.from(start.add(1, 'minute'))).toBe('a minute ago');
    expect(start.from(start.add(5, 'minutes'))).toBe('5 minutes ago');

    expect(start.from(start.subtract(5, 'seconds'))).toBe('in a few seconds');
    expect(start.from(start.subtract(1, 'minute'))).toBe('in a minute');
    expect(start.from(start.subtract(5, 'minutes'))).toBe('in 5 minutes');
});

test('from with absolute duration', () => {
    const start = dateTime();
    expect(start.from(start.add(5, 'seconds'), true)).toBe('a few seconds');
    expect(start.from(start.add(1, 'minute'), true)).toBe('a minute');
    expect(start.from(start.add(5, 'minutes'), true)).toBe('5 minutes');

    expect(start.from(start.subtract(5, 'seconds'), true)).toBe('a few seconds');
    expect(start.from(start.subtract(1, 'minute'), true)).toBe('a minute');
    expect(start.from(start.subtract(5, 'minutes'), true)).toBe('5 minutes');
});

test('default thresholds fromNow', () => {
    let a = dateTime();

    // Seconds to minutes threshold
    a = a.subtract(44, 'seconds');
    expect(a.fromNow()).toBe('a few seconds ago'); //'Below default seconds to minutes threshold'
    a = a.subtract(1, 'seconds');
    expect(a.fromNow()).toBe('a minute ago'); // 'Above default seconds to minutes threshold'

    // Minutes to hours threshold
    a = dateTime();
    a = a.subtract(44, 'minutes');
    expect(a.fromNow()).toBe('44 minutes ago'); //'Below default minute to hour threshold'
    a = a.subtract(1, 'minutes');
    expect(a.fromNow()).toBe('an hour ago'); // 'Above default minute to hour threshold'

    // Hours to days threshold
    a = dateTime();
    a = a.subtract(21, 'hours');
    expect(a.fromNow()).toBe('21 hours ago'); // 'Below default hours to day threshold'
    a = a.subtract(1, 'hours');
    expect(a.fromNow()).toBe('a day ago'); // 'Above default hours to day threshold'

    // Days to month threshold
    a = dateTime();
    a = a.subtract(25, 'days');
    expect(a.fromNow()).toBe('25 days ago'); // 'Below default days to month (singular) threshold'
    a = a.subtract(1, 'days');
    expect(a.fromNow()).toBe('a month ago'); // 'Above default days to month (singular) threshold'

    // months to year threshold
    a = dateTime();
    a = a.subtract(10, 'months');
    expect(a.fromNow()).toBe('10 months ago'); // 'Below default days to years threshold'
    a = a.subtract(1, 'month');
    expect(a.fromNow()).toBe('a year ago'); // 'Above default days to years threshold'
});
