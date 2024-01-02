import {dateTime} from '../dateTime';

test('start of year', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('year');
    const ms = dateTime({input: new Date(2011, 7, 2, 3, 4, 5, 6)}).startOf('years');
    const ma = dateTime({input: new Date(2011, 11, 2, 3, 4, 5, 6)}).startOf('y');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(0); // 'strip out the month'
    expect(m.date()).toBe(1); // 'strip out the day'
    expect(m.hour()).toBe(0); // 'strip out the hours'
    expect(m.minute()).toBe(0); // 'strip out the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of year', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('year');
    const ms = dateTime({input: new Date(2011, 7, 2, 3, 4, 5, 6)}).endOf('years');
    const ma = dateTime({input: new Date(2011, 11, 2, 3, 4, 5, 6)}).endOf('y');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(11); // 'set the month'
    expect(m.date()).toBe(31); // 'set the day'
    expect(m.hour()).toBe(23); // 'set the hours'
    expect(m.minute()).toBe(59); // 'set the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the seconds'
});

test('start of quarter', () => {
    const m = dateTime({input: new Date(2011, 4, 2, 3, 4, 5, 6)}).startOf('quarter');
    const ms = dateTime({input: new Date(2011, 4, 2, 3, 4, 5, 6)}).startOf('quarters');
    const ma = dateTime({input: new Date(2011, 4, 2, 3, 4, 5, 6)}).startOf('Q');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.quarter()).toBe(2); // 'keep the quarte
    expect(m.month()).toBe(3); // 'strip out the month'
    expect(m.date()).toBe(1); // 'strip out the day'
    expect(m.hour()).toBe(0); // 'strip out the hours'
    expect(m.minute()).toBe(0); // 'strip out the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of quarter', () => {
    const m = dateTime({input: new Date(2011, 4, 2, 3, 4, 5, 6)}).endOf('quarter');
    const ms = dateTime({input: new Date(2011, 4, 2, 3, 4, 5, 6)}).endOf('quarters');
    const ma = dateTime({input: new Date(2011, 4, 2, 3, 4, 5, 6)}).endOf('Q');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.quarter()).toBe(2); // 'keep the quarter'
    expect(m.month()).toBe(5); // 'set the month'
    expect(m.date()).toBe(30); // 'set the day'
    expect(m.hour()).toBe(23); // 'set the hours'
    expect(m.minute()).toBe(59); // 'set the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the seconds'
});

test('start of month', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('month');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('months');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('M');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(1); // 'strip out the day'
    expect(m.hour()).toBe(0); // 'strip out the hours'
    expect(m.minute()).toBe(0); // 'strip out the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of month', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('month');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('months');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('M');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work')
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work')
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(28); // 'set the day'
    expect(m.hour()).toBe(23); // 'set the hours'
    expect(m.minute()).toBe(59); // 'set the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the seconds'
});

test('start of week', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('week');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('weeks');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('w');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work')
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work')
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(0); // 'rolls back to January'
    expect(m.day()).toBe(1); // 'set day of week'
    expect(m.date()).toBe(31); // 'set correct date'
    expect(m.hour()).toBe(0); // 'strip out the hours'
    expect(m.minute()).toBe(0); // 'strip out the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of week', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('week');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('weeks');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('w');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.day()).toBe(0); // 'set the day of the week'
    expect(m.date()).toBe(6); // 'set the day'
    expect(m.hour()).toBe(23); // 'set the hours'
    expect(m.minute()).toBe(59); // 'set the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the seconds'
});

test('start of iso-week', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('isoWeek');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('isoWeeks');
    // const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('W');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    // expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(0); // 'rollback to January'
    expect(m.isoWeekday()).toBe(1); // 'set day of iso-week'
    expect(m.date()).toBe(31); // 'set correct date'
    expect(m.hour()).toBe(0); // 'strip out the hours'
    expect(m.minute()).toBe(0); // 'strip out the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of iso-week', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('isoWeek');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('isoWeeks');
    // const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('W');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    // expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.isoWeekday()).toBe(7); // 'set the day of the week'
    expect(m.date()).toBe(6); // 'set the day'
    expect(m.hour()).toBe(23); // 'set the hours'
    expect(m.minute()).toBe(59); // 'set the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the seconds'
});

test('start of day', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('day');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('days');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('d');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(0); // 'strip out the hours'
    expect(m.minute()).toBe(0); // 'strip out the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of day', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('day');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('days');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('d');
    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(23); // 'set the hours'
    expect(m.minute()).toBe(59); // 'set the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the seconds'
});

test('start of date', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('date');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('dates');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('D');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(0); // 'strip out the hours'
    expect(m.minute()).toBe(0); // 'strip out the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of date', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('date');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('dates');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('D');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(23); // 'set the hours'
    expect(m.minute()).toBe(59); // 'set the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the milliseconds'
});

test('start of hour', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('hour');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('hours');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('h');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(3); // 'keep the hours'
    expect(m.minute()).toBe(0); // 'strip out the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of hour', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('hour');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('hours');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('h');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(3); // 'keep the hours'
    expect(m.minute()).toBe(59); // 'set the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the milliseconds'
});

test('start of minute', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('minute');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('minutes');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('m');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(3); // 'keep the hours'
    expect(m.minute()).toBe(4); // 'keep the minutes'
    expect(m.second()).toBe(0); // 'strip out the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of minute', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('minute');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('minutes');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('m');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(3); // 'keep the hours'
    expect(m.minute()).toBe(4); // 'keep the minutes'
    expect(m.second()).toBe(59); // 'set the seconds'
    expect(m.millisecond()).toBe(999); // 'set the milliseconds'
});

test('start of second', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('second');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('seconds');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).startOf('s');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(3); // 'keep the hours'
    expect(m.minute()).toBe(4); // 'keep the minutes'
    expect(m.second()).toBe(5); // 'keep the seconds'
    expect(m.millisecond()).toBe(0); // 'strip out the milliseconds'
});

test('end of second', () => {
    const m = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('second');
    const ms = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('seconds');
    const ma = dateTime({input: new Date(2011, 1, 2, 3, 4, 5, 6)}).endOf('s');

    expect(Number(m)).toBe(Number(ms)); // 'Plural or singular should work'
    expect(Number(m)).toBe(Number(ma)); // 'Full or abbreviated should work'
    expect(m.year()).toBe(2011); // 'keep the year'
    expect(m.month()).toBe(1); // 'keep the month'
    expect(m.date()).toBe(2); // 'keep the day'
    expect(m.hour()).toBe(3); // 'keep the hours'
    expect(m.minute()).toBe(4); // 'keep the minutes'
    expect(m.second()).toBe(5); // 'keep the seconds'
    expect(m.millisecond()).toBe(999); // 'set the milliseconds'
});
