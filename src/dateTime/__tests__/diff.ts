import type {DateTimeInput, DurationUnit} from '../../typings';
import {dateTime} from '../dateTime';

function dstForYear(year: number) {
    let end = dateTime({input: [year + 1]});
    let current = dateTime({input: [year]});
    let last;

    while (current < end) {
        last = current;
        current = current.add(24, 'hour');
        if (last.utcOffset() !== current.utcOffset()) {
            end = current;
            current = last;
            break;
        }
    }

    while (current < end) {
        last = current;
        current = current.add(1, 'hour');
        if (last.utcOffset() !== current.utcOffset()) {
            return {
                dateTime: last,
                diff: -(current.utcOffset() - last.utcOffset()) / 60,
            };
        }
    }

    return undefined;
}

test('diff', () => {
    expect(dateTime({input: 1000}).diff(0)).toBe(1000); // '1 second - 0 = 1000'
    expect(dateTime({input: 1000}).diff(500)).toBe(500); // '1 second - 0.5 seconds = 500'
    expect(dateTime({input: 0}).diff(1000)).toBe(-1000); // '0 - 1 second = -1000'
    expect(dateTime({input: new Date(1000)}).diff(1000)).toBe(0); // '1 second - 1 second = 0'
    const oneHourDate = new Date(2015, 5, 21);
    const nowDate = new Date(Number(oneHourDate));
    oneHourDate.setHours(oneHourDate.getHours() + 1);
    expect(dateTime({input: oneHourDate}).diff(nowDate)).toBe(60 * 60 * 1000); // '1 hour from now = 3600000'
});

test.each<[{date: DateTimeInput; unit: DurationUnit}, number]>([
    [{date: [2011], unit: 'year'}, -1],
    [{date: [2010, 2], unit: 'month'}, -2],
    [{date: [2010, 0, 7], unit: 'week'}, 0],
    [{date: [2010, 0, 8], unit: 'week'}, -1],
    [{date: [2010, 0, 21], unit: 'week'}, -2],
    [{date: [2010, 0, 22], unit: 'week'}, -3],
    [{date: [2010, 0, 4], unit: 'day'}, -3],
    [{date: [2010, 0, 1, 0, 5], unit: 'minute'}, -5],
    [{date: [2010, 0, 1, 0, 0, 6], unit: 'second'}, -6],
])('diff key after, (%j)', ({date, unit}, expected) => {
    expect(dateTime({input: [2010]}).diff(date, unit)).toBe(expected);
});

test.each<[{date: DateTimeInput; unit: DurationUnit}, number]>([
    [{date: [2011], unit: 'year'}, 1],
    [{date: [2010, 2], unit: 'month'}, 2],
    [{date: [2010, 0, 7], unit: 'week'}, 0],
    [{date: [2010, 0, 8], unit: 'week'}, 1],
    [{date: [2010, 0, 21], unit: 'week'}, 2],
    [{date: [2010, 0, 22], unit: 'week'}, 3],
    [{date: [2010, 0, 4], unit: 'day'}, 3],
    [{date: [2010, 0, 1, 0, 5], unit: 'minute'}, 5],
    [{date: [2010, 0, 1, 0, 0, 6], unit: 'second'}, 6],
])('diff key before, (%j)', ({date, unit}, expected) => {
    expect(dateTime({input: date}).diff([2010], unit)).toBe(expected);
});

test('diff month', () => {
    expect(dateTime({input: [2011, 0, 31]}).diff([2011, 2, 1], 'months')).toBe(-1);
});

test('end of month diff', () => {
    expect(dateTime({input: '2016-02-29'}).diff('2016-01-30', 'months')).toBe(1); // 'Feb 29 to Jan 30 should be 1 month'
    expect(dateTime({input: '2016-02-29'}).diff('2016-01-31', 'months')).toBe(1); // 'Feb 29 to Jan 31 should be 1 month'
    expect(dateTime({input: '2016-05-31'}).add(1, 'month').diff('2016-05-31', 'month')).toBe(1); // '(May 31 plus 1 month) to May 31 should be 1 month diff',
});

test('end of month diff with time behind', () => {
    expect(dateTime({input: '2017-03-31'}).diff('2017-02-28', 'months')).toBe(1); // 'Feb 28 to March 31 should be 1 month',
    expect(dateTime({input: '2017-02-28'}).diff('2017-03-31', 'months')).toBe(-1); //'Feb 28 to March 31 should be 1 month',
});

test('diff across DST', () => {
    const dst = dstForYear(2012);
    if (!dst) {
        expect(42).toBe(42); // 'at least one assertion'
        return;
    }

    let a, b;

    a = dst.dateTime;
    b = a.utc().add(12, 'hours').local();
    expect(b.diff(a, 'milliseconds', true)).toBe(12 * 60 * 60 * 1000); // 'ms diff across DST'
    expect(b.diff(a, 'seconds', true)).toBe(12 * 60 * 60); // 'second diff across DST'
    expect(b.diff(a, 'minutes', true)).toBe(12 * 60); // 'minute diff across DST'
    expect(b.diff(a, 'hours', true)).toBe(12); // 'hour diff across DST'
    expect(b.diff(a, 'days', true)).toBe((12 - dst.diff) / 24); // 'day diff across DST'
    // due to floating point math errors, these tests just need to be accurate within 0.00000001
    expect(Math.abs(b.diff(a, 'weeks', true) - (12 - dst.diff) / 24 / 7) < 0.00000001).toBe(true); // 'week diff across DST'
    expect(0.95 / (2 * 31) < b.diff(a, 'months', true)).toBe(true); // 'month diff across DST, lower bound'
    expect(b.diff(a, 'month', true) < 1.05 / (2 * 28)).toBe(true); // 'month diff across DST, upper bound');
    expect(0.95 / (2 * 31 * 12) < b.diff(a, 'years', true)).toBe(true); // 'year diff across DST, lower bound'
    expect(b.diff(a, 'year', true) < 1.05 / (2 * 28 * 12)).toBe(true); // 'year diff across DST, upper bound'

    a = dst.dateTime;
    b = a
        .utc()
        .add(12 + dst.diff, 'hours')
        .local();

    expect(b.diff(a, 'milliseconds', true)).toBe((12 + dst.diff) * 60 * 60 * 1000); // 'ms diff across DST'
    expect(b.diff(a, 'seconds', true)).toBe((12 + dst.diff) * 60 * 60); // 'second diff across DST');
    expect(b.diff(a, 'minutes', true)).toBe((12 + dst.diff) * 60); // 'minute diff across DST'
    expect(b.diff(a, 'hours', true)).toBe(12 + dst.diff); // 'hour diff across DST'
    expect(b.diff(a, 'days', true)).toBe(12 / 24); // 'day diff across DST'
    // due to floating point math errors, these tests just need to be accurate within 0.00000001
    expect(Math.abs(b.diff(a, 'weeks', true) - 12 / 24 / 7) < 0.00000001).toBe(true); // 'week diff across DST'
    expect(0.95 / (2 * 31) < b.diff(a, 'months', true)).toBe(true); // 'month diff across DST, lower bound'
    expect(b.diff(a, 'month', true) < 1.05 / (2 * 28)).toBe(true); // 'month diff across DST, upper bound'
    expect(0.95 / (2 * 31 * 12) < b.diff(a, 'years', true)).toBe(true); // 'year diff across DST, lower bound'
    expect(b.diff(a, 'year', true) < 1.05 / (2 * 28 * 12)).toBe(true); // 'year diff across DST, upper bound'
});

test.each<[{date: DateTimeInput; unit: DurationUnit}, number]>([
    [{date: [2011], unit: 'month'}, 12],
    [{date: [2010, 0, 2], unit: 'hour'}, 24],
    [{date: [2010, 0, 1, 2], unit: 'minute'}, 120],
    [{date: [2010, 0, 1, 0, 4], unit: 'second'}, 240],
])('diff overflow, (%j)', ({date, unit}, expected) => {
    expect(dateTime({input: date}).diff([2010], unit)).toBe(expected);
});

test('diff between utc and local (not Russia)', () => {
    if (dateTime({input: [2012]}).utcOffset() === dateTime({input: [2011]}).utcOffset()) {
        // Russia's utc offset on 1st of Jan 2012 vs 2011 is different
        expect(
            dateTime({input: [2012]})
                .utc()
                .diff([2011], 'years'),
        ).toBe(1);
    }
});

test.each<[{date1: DateTimeInput; date2: DateTimeInput; unit: DurationUnit}, number]>([
    [{date1: [2010, 2, 2], date2: [2010, 0, 2], unit: 'months'}, 2],
    [{date1: [2010, 0, 4], date2: [2010], unit: 'days'}, 3],
    [{date1: [2010, 0, 22], date2: [2010], unit: 'weeks'}, 3],
    [{date1: [2010, 0, 1, 4], date2: [2010], unit: 'hours'}, 4],
    [{date1: [2010, 0, 1, 0, 5], date2: [2010], unit: 'minutes'}, 5],
    [{date1: [2010, 0, 1, 0, 0, 6], date2: [2010], unit: 'seconds'}, 6],
])('diff between utc and local', ({date1, date2, unit}, expected) => {
    expect(dateTime({input: date1}).utc().diff(date2, unit)).toBe(expected);
});

test.each<[{date1: DateTimeInput; date2: DateTimeInput; unit: DurationUnit}, number]>([
    [{date1: [2010, 0, 1, 23], date2: [2010], unit: 'day'}, 0],
    [{date1: [2010, 0, 1, 23, 59], date2: [2010], unit: 'day'}, 0],
    [{date1: [2010, 0, 1, 24], date2: [2010], unit: 'day'}, 1],
    [{date1: [2010, 0, 2], date2: [2011, 0, 1], unit: 'year'}, 0],
    [{date1: [2011, 0, 1], date2: [2010, 0, 2], unit: 'year'}, 0],
    [{date1: [2010, 0, 2], date2: [2011, 0, 2], unit: 'year'}, -1],
    [{date1: [2011, 0, 2], date2: [2010, 0, 2], unit: 'year'}, 1],
])('diff floored, (%j)', ({date1, date2, unit}, expected) => {
    expect(dateTime({input: date1}).diff(date2, unit)).toBe(expected);
});

test('year diff should include date of month', () => {
    expect(
        dateTime({input: [2012, 1, 19]}).diff(dateTime({input: [2002, 1, 20]}), 'years', true) < 10,
    ).toBe(true);
});
