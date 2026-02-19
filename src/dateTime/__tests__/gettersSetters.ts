import {dateTime} from '../dateTime';

const dt = dateTime({input: new Date(1982, 4, 25, 9, 23, 54, 123)});

test('getters', () => {
    const a = dateTime({input: [2011, 9, 12, 6, 7, 8, 9]});
    expect(a.year()).toBe(2011);
    expect(a.month()).toBe(9);
    expect(a.date()).toBe(12);
    expect(a.day()).toBe(3);
    expect(a.hour()).toBe(6);
    expect(a.minute()).toBe(7);
    expect(a.second()).toBe(8);
    expect(a.millisecond()).toBe(9);
});

test.each<[string, number[], number]>([
    ['Feb  4 1985 is Q1', [1985, 1, 4], 1],
    ['Sep 18 2029 is Q3', [2029, 8, 18], 3],
    ['Apr 24 2013 is Q2', [2013, 3, 24], 2],
    ['Mar  5 2015 is Q1', [2015, 2, 5], 1],
    ['Jan  2 1970 is Q1', [1970, 0, 2], 1],
    ['Dec 12 2001 is Q4', [2001, 11, 12], 4],
    ['Jan  2 2000 is Q1', [2000, 0, 2], 1],
])('quarter getter (%s)', (_, input, expected) => {
    expect(dateTime({input}).quarter()).toBe(expected);
});

test('DateTime#set() sets Gregorian fields', () => {
    expect(dt.set({year: 2012}).year()).toBe(2012);
    expect(dt.set({month: 1}).month()).toBe(1);
    expect(dt.set({month: 1}).hour()).toBe(9); // this will cross a DST for many people
    expect(dt.set({date: 5}).date()).toBe(5);
    expect(dt.set({hour: 4}).hour()).toBe(4);
    expect(dt.set({minute: 16}).minute()).toBe(16);
    expect(dt.set({second: 45}).second()).toBe(45);
    expect(dt.set({millisecond: 86}).millisecond()).toBe(86);
});

test("DateTime#set({ month }) doesn't go to the wrong month", () => {
    const end = dateTime({input: new Date(1983, 4, 31)}),
        moved = end.set({month: 3});
    expect(moved.month()).toBe(3);
    expect(moved.date()).toBe(30);
});

test("DateTime#set({ year }) doesn't wrap leap years", () => {
    const end = dateTime({input: new Date(2012, 1, 29)}),
        moved = end.set({year: 2013});
    expect(moved.month()).toBe(1);
    expect(moved.date()).toBe(28);
});

test('DateTime#set({ weekYear }) sets the date to the same weekNumber/weekday of the target weekYear', () => {
    const modified = dt.set({weekYear: 2017});
    expect(modified.day()).toBe(2); // still tuesday
    expect(modified.week()).toBe(22);
    expect(modified.year()).toBe(2017);
    expect(modified.month()).toBe(4);
    expect(modified.date()).toBe(23); // 2017-W21-2 is the 23
    expect(modified.hour()).toBe(9);
    expect(modified.minute()).toBe(23);
    expect(modified.second()).toBe(54);
    expect(modified.millisecond()).toBe(123);
});

test('DateTime#set({ week }) sets the date to the same weekday of the target weekNumber', () => {
    const modified = dt.set({week: 2});
    expect(modified.day()).toBe(2); // still tuesday
    expect(modified.year()).toBe(1982);
    expect(modified.month()).toBe(0);
    expect(modified.date()).toBe(5);
    expect(modified.hour()).toBe(9);
    expect(modified.minute()).toBe(23);
    expect(modified.second()).toBe(54);
    expect(modified.millisecond()).toBe(123);
});

test("DateTime#set({ day }) sets the weekday to this week's matching day", () => {
    const modified = dt.set({day: 1});
    expect(modified.day()).toBe(1);
    expect(modified.year()).toBe(1982);
    expect(modified.month()).toBe(4);
    expect(modified.date()).toBe(24); // monday is the previous day
    expect(modified.hour()).toBe(9);
    expect(modified.minute()).toBe(23);
    expect(modified.second()).toBe(54);
    expect(modified.millisecond()).toBe(123);
});

test.each<[string, string]>([
    ['2016-01-02', '2016-01-03'],
    ['2016-12-29', '2017-01-01'],
    ['2021-01-01', '2021-01-03'],
    ['2028-01-01', '2028-01-02'],
])('DateTime#set({ day }) handles week year edge cases', (input, expectedInput) => {
    const start = dateTime({input});
    const expected = dateTime({input: expectedInput});
    expect(start.set({day: 0})).toEqual(expected);
});

test('quarter setter', () => {
    const m = dateTime({input: [2014, 4, 11]});
    expect(m.quarter(2).month()).toBe(4);
    expect(m.quarter(3).month()).toBe(7);
    expect(m.quarter(1).month()).toBe(1);
    expect(m.quarter(4).month()).toBe(10);
});
