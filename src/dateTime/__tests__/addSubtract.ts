import {dateTime} from '../dateTime';

test('add short reverse args', () => {
    let a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect((a = a.add({ms: 50})).millisecond()).toBe(550);
    expect((a = a.add({s: 1})).second()).toBe(9);
    expect((a = a.add({m: 1})).minute()).toBe(8);
    expect((a = a.add({h: 1})).hour()).toBe(7);
    expect((a = a.add({d: 1})).date()).toBe(13);
    expect((a = a.add({w: 1})).date()).toBe(20);
    expect((a = a.add({M: 1})).month()).toBe(10);
    expect((a = a.add({y: 1})).year()).toBe(2012);
    expect((a = a.add({Q: 1})).month()).toBe(1);

    const b = dateTime({input: [2010, 0, 31]}).add({M: 1});
    expect(b.month()).toBe(1);
    expect(b.date()).toBe(28);

    const c = dateTime({input: [2010, 1, 28]}).subtract({M: 1});
    expect(c.month()).toBe(0);
    expect(c.date()).toBe(28);

    const d = dateTime({input: [2010, 1, 28]}).subtract({Q: 1});
    expect(d.month()).toBe(10);
    expect(d.date()).toBe(28);
    expect(d.year()).toBe(2009);
});

test('add long reverse args', () => {
    let a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect((a = a.add({milliseconds: 50})).millisecond()).toBe(550);
    expect((a = a.add({seconds: 1})).second()).toBe(9);
    expect((a = a.add({minutes: 1})).minute()).toBe(8);
    expect((a = a.add({hours: 1})).hour()).toBe(7);
    expect((a = a.add({days: 1})).date()).toBe(13);
    expect((a = a.add({weeks: 1})).date()).toBe(20);
    expect((a = a.add({months: 1})).month()).toBe(10);
    expect((a = a.add({years: 1})).year()).toBe(2012);
    expect((a = a.add({quarters: 1})).month()).toBe(1);
});

test('add long singular reverse args', () => {
    let a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect((a = a.add({millisecond: 50})).millisecond()).toBe(550);
    expect((a = a.add({second: 1})).second()).toBe(9);
    expect((a = a.add({minute: 1})).minute()).toBe(8);
    expect((a = a.add({hour: 1})).hour()).toBe(7);
    expect((a = a.add({day: 1})).date()).toBe(13);
    expect((a = a.add({week: 1})).date()).toBe(20);
    expect((a = a.add({month: 1})).month()).toBe(10);
    expect((a = a.add({year: 1})).year()).toBe(2012);
    expect((a = a.add({quarter: 1})).month()).toBe(1);
});

test('add string long', () => {
    let a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect((a = a.add(50, 'milliseconds')).millisecond()).toBe(550);
    expect((a = a.add(1, 'seconds')).second()).toBe(9);
    expect((a = a.add(1, 'minutes')).minute()).toBe(8);
    expect((a = a.add(1, 'hours')).hour()).toBe(7);
    expect((a = a.add(1, 'days')).date()).toBe(13);
    expect((a = a.add(1, 'weeks')).date()).toBe(20);
    expect((a = a.add(1, 'months')).month()).toBe(10);
    expect((a = a.add(1, 'years')).year()).toBe(2012);
    expect((a = a.add(1, 'quarters')).month()).toBe(1);
});

test('add string long singular', () => {
    let a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect((a = a.add(50, 'millisecond')).millisecond()).toBe(550);
    expect((a = a.add(1, 'second')).second()).toBe(9);
    expect((a = a.add(1, 'minute')).minute()).toBe(8);
    expect((a = a.add(1, 'hour')).hour()).toBe(7);
    expect((a = a.add(1, 'day')).date()).toBe(13);
    expect((a = a.add(1, 'week')).date()).toBe(20);
    expect((a = a.add(1, 'month')).month()).toBe(10);
    expect((a = a.add(1, 'year')).year()).toBe(2012);
    expect((a = a.add(1, 'quarter')).month()).toBe(1);
});

test('add string short', () => {
    let a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect((a = a.add(50, 'ms')).millisecond()).toBe(550);
    expect((a = a.add(1, 's')).second()).toBe(9);
    expect((a = a.add(1, 'm')).minute()).toBe(8);
    expect((a = a.add(1, 'h')).hour()).toBe(7);
    expect((a = a.add(1, 'd')).date()).toBe(13);
    expect((a = a.add(1, 'w')).date()).toBe(20);
    expect((a = a.add(1, 'M')).month()).toBe(10);
    expect((a = a.add(1, 'y')).year()).toBe(2012);
    expect((a = a.add(1, 'Q')).month()).toBe(1);
});

test('add strings string short', () => {
    let a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect((a = a.add('50', 'ms')).millisecond()).toBe(550);
    expect((a = a.add('1', 's')).second()).toBe(9);
    expect((a = a.add('1', 'm')).minute()).toBe(8);
    expect((a = a.add('1', 'h')).hour()).toBe(7);
    expect((a = a.add('1', 'd')).date()).toBe(13);
    expect((a = a.add('1', 'w')).date()).toBe(20);
    expect((a = a.add('1', 'M')).month()).toBe(10);
    expect((a = a.add('1', 'y')).year()).toBe(2012);
    expect((a = a.add('1', 'Q')).month()).toBe(1);
});

test('add no string with milliseconds default', () => {
    const a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect(a.add(50).millisecond()).toBe(550);
});

test('subtract strings string short', () => {
    let a = dateTime().year(2011).month(9).date(12).hour(6).minute(7).second(8).millisecond(500);

    expect((a = a.subtract('50', 'ms')).millisecond()).toBe(450);
    expect((a = a.subtract('1', 's')).second()).toBe(7);
    expect((a = a.subtract('1', 'm')).minute()).toBe(6);
    expect((a = a.subtract('1', 'h')).hour()).toBe(5);
    expect((a = a.subtract('1', 'd')).date()).toBe(11);
    expect((a = a.subtract('1', 'w')).date()).toBe(4);
    expect((a = a.subtract('1', 'M')).month()).toBe(8);
    expect((a = a.subtract('1', 'y')).year()).toBe(2010);
    expect((a = a.subtract('1', 'Q')).month()).toBe(5);
});

test('add across DST', () => {
    const a = dateTime({input: '2023-11-05T05:00:00Z', timeZone: 'America/New_York'});

    expect(a.hour()).toBe(1);
    expect(a.utcOffset()).toBe(-4 * 60);

    const b = a.add(24, 'hours');
    expect(b.hour()).toBe(0); // adding hours should respect DST difference
    expect(b.utcOffset()).toBe(-5 * 60);

    // adding days over DST difference should result in the same hour
    const c = a.add(1, 'day');
    expect(c.hour()).toBe(1);
    expect(c.utcOffset()).toBe(-5 * 60);

    // adding months over DST difference should result in the same hour
    const d = a.add(1, 'month');
    expect(d.hour()).toBe(1);
    expect(d.utcOffset()).toBe(-5 * 60);

    // adding quarters over DST difference should result in the same hour
    const e = a.add(1, 'quarter');
    expect(e.hour()).toBe(1);
    expect(e.utcOffset()).toBe(-5 * 60);
});

test('add decimal values of days and months', () => {
    expect(
        dateTime({input: [2016, 3, 3]})
            .add(1.5, 'days')
            .date(),
    ).toBe(5);
    expect(
        dateTime({input: [2016, 3, 3]})
            .add(-1.5, 'days')
            .date(),
    ).toBe(1);
    expect(
        dateTime({input: [2016, 3, 1]})
            .add(-1.5, 'days')
            .date(),
    ).toBe(30);
    expect(
        dateTime({input: [2016, 3, 3]})
            .add(1.5, 'months')
            .month(),
    ).toBe(5);
    expect(
        dateTime({input: [2016, 3, 3]})
            .add(-1.5, 'months')
            .month(),
    ).toBe(1);
    expect(
        dateTime({input: [2016, 0, 3]})
            .add(-1.5, 'months')
            .month(),
    ).toBe(10);
    expect(
        dateTime({input: [2016, 3, 3]})
            .subtract(1.5, 'days')
            .date(),
    ).toBe(1);
    expect(
        dateTime({input: [2016, 3, 2]})
            .subtract(1.5, 'days')
            .date(),
    ).toBe(31);
    expect(
        dateTime({input: [2016, 1, 1]})
            .subtract(1.1, 'days')
            .date(),
    ).toBe(31);
    expect(
        dateTime({input: [2016, 3, 3]})
            .subtract(-1.5, 'days')
            .date(),
    ).toBe(5);
    expect(
        dateTime({input: [2016, 3, 30]})
            .subtract(-1.5, 'days')
            .date(),
    ).toBe(2);
    expect(
        dateTime({input: [2016, 3, 3]})
            .subtract(1.5, 'months')
            .month(),
    ).toBe(1);
    expect(
        dateTime({input: [2016, 3, 3]})
            .subtract(-1.5, 'months')
            .month(),
    ).toBe(5);
    expect(
        dateTime({input: [2016, 11, 31]})
            .subtract(-1.5, 'months')
            .month(),
    ).toBe(1);
    expect(
        dateTime({input: [2016, 0, 1]})
            .add(1.5, 'years')
            .format('YYYY-MM-DD'),
    ).toBe('2017-07-01');
    expect(
        dateTime({input: [2016, 0, 1]})
            .add(1.6, 'years')
            .format('YYYY-MM-DD'),
    ).toBe('2017-08-01');
    expect(
        dateTime({input: [2016, 0, 1]})
            .add(1.1, 'quarters')
            .format('YYYY-MM-DD'),
    ).toBe('2016-04-01');
});
