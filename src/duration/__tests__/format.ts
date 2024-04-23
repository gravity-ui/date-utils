// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import {duration} from '..';
import {settings} from '../../settings';

const dur = () =>
    duration({
        years: 1,
        months: 2,
        weeks: 1,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
        milliseconds: 7,
    });

//------
// #toISOString()
//------

test('Duration#toISOString fills out every field', () => {
    expect(dur().toISOString()).toBe('P1Y2M1W3DT4H5M6.007S');
});

test('Duration#toISOString fills out every field with fractional', () => {
    const dur = duration({
        years: 1.1,
        months: 2.2,
        weeks: 1.1,
        days: 3.3,
        hours: 4.4,
        minutes: 5.5,
        seconds: 6.6,
        milliseconds: 7,
    });
    expect(dur.toISOString()).toBe('P1.1Y2.2M1.1W3.3DT4.4H5.5M6.607S');
});

test('Duration#toISOString creates a minimal string', () => {
    expect(duration({years: 3, seconds: 45}).toISOString()).toBe('P3YT45S');
    expect(duration({months: 4, seconds: 45}).toISOString()).toBe('P4MT45S');
    expect(duration({months: 5}).toISOString()).toBe('P5M');
    expect(duration({minutes: 5}).toISOString()).toBe('PT5M');
});

test('Duration#toISOString handles negative durations', () => {
    expect(duration({years: -3, seconds: -45}).toISOString()).toBe('P-3YT-45S');
});

test('Duration#toISOString handles mixed negative/positive durations', () => {
    expect(duration({years: 3, seconds: -45}).toISOString()).toBe('P3YT-45S');
    expect(duration({years: 0, seconds: -45}).toISOString()).toBe('PT-45S');
    expect(duration({years: -5, seconds: 34}).toISOString()).toBe('P-5YT34S');
});

test('Duration#toISOString handles zero durations', () => {
    expect(duration(0).toISOString()).toBe('PT0S');
});

// test('Duration#toISOString returns null for invalid durations', () => {
//     expect(Duration.invalid('because').toISOString()).toBe(null);
// });

test('Duration#toISOString handles milliseconds duration', () => {
    expect(duration({milliseconds: 7}).toISOString()).toBe('PT0.007S');
});

test('Duration#toISOString handles seconds/milliseconds duration', () => {
    expect(duration({seconds: 17, milliseconds: 548}).toISOString()).toBe('PT17.548S');
});

test('Duration#toISOString handles negative seconds/milliseconds duration', () => {
    expect(duration({seconds: -17, milliseconds: -548}).toISOString()).toBe('PT-17.548S');
});

test('Duration#toISOString handles mixed negative/positive numbers in seconds/milliseconds durations', () => {
    expect(duration({seconds: 17, milliseconds: -548}).toISOString()).toBe('PT16.452S');
    expect(duration({seconds: -17, milliseconds: 548}).toISOString()).toBe('PT-16.452S');
});

//------
// #toJSON()
//------

test('Duration#toJSON returns the ISO representation', () => {
    expect(dur().toJSON()).toBe(dur().toISOString());
});

//------
// #toString()
//------

test('Duration#toString returns the ISO representation', () => {
    expect(dur().toString()).toBe(dur().toISOString());
});
//------
// #humanizeIntl()
//------

test('Duration#humanizeIntl formats out a list', () => {
    expect(dur().humanizeIntl()).toEqual(
        '1 year, 2 months, 1 week, 3 days, 4 hours, 5 minutes, 6 seconds, 7 milliseconds',
    );
});

test('Duration#humanizeIntl only shows the units you have', () => {
    expect(duration({years: 3, hours: 4}).humanizeIntl()).toEqual('3 years, 4 hours');
});

test('Duration#humanizeIntl accepts a listStyle', () => {
    expect(dur().humanizeIntl({listStyle: 'long'})).toEqual(
        '1 year, 2 months, 1 week, 3 days, 4 hours, 5 minutes, 6 seconds, and 7 milliseconds',
    );
});

test('Duration#humanizeIntl accepts number format opts', () => {
    expect(dur().humanizeIntl({unitDisplay: 'short'})).toEqual(
        '1 yr, 2 mths, 1 wk, 3 days, 4 hr, 5 min, 6 sec, 7 ms',
    );
});

test('Duration#humanizeIntl works in differt languages', () => {
    expect(dur().locale('fr').humanizeIntl()).toEqual(
        '1 an, 2 mois, 1 semaine, 3 jours, 4 heures, 5 minutes, 6 secondes, 7 millisecondes',
    );
});

//------
// #humanize()
//------

test('Duration#humanize', () => {
    expect(duration({seconds: 44}).humanize()).toBe('a few seconds');
    expect(duration({seconds: 45}).humanize()).toBe('a minute');
    expect(duration({seconds: 89}).humanize()).toBe('a minute');
    expect(duration({seconds: 90}).humanize()).toBe('2 minutes');
    expect(duration({minutes: 44}).humanize()).toBe('44 minutes');
    expect(duration({minutes: 45}).humanize()).toBe('an hour');
    expect(duration({minutes: 89}).humanize()).toBe('an hour');
    expect(duration({minutes: 90}).humanize()).toBe('2 hours');
    expect(duration({hours: 5}).humanize()).toBe('5 hours');
    expect(duration({hours: 21}).humanize()).toBe('21 hours');
    expect(duration({hours: 22}).humanize()).toBe('a day');
    expect(duration({hours: 35}).humanize()).toBe('a day');
    expect(duration({hours: 36}).humanize()).toBe('2 days');
    expect(duration({days: 1}).humanize()).toBe('a day');
    expect(duration({days: 5}).humanize()).toBe('5 days');
    expect(duration({weeks: 1}).humanize()).toBe('7 days');
    expect(duration({days: 25}).humanize()).toBe('25 days');
    expect(duration({days: 26}).humanize()).toBe('a month');
    expect(duration({days: 30}).humanize()).toBe('a month');
    expect(duration({days: 45}).humanize()).toBe('a month');
    expect(duration({days: 46}).humanize()).toBe('2 months');
    expect(duration({days: 74}).humanize()).toBe('2 months');
    expect(duration({days: 77}).humanize()).toBe('3 months');
    expect(duration({months: 1}).humanize()).toBe('a month');
    expect(duration({months: 5}).humanize()).toBe('5 months');
    expect(duration({days: 344}).humanize()).toBe('a year');
    expect(duration({days: 345}).humanize()).toBe('a year');
    expect(duration({days: 547}).humanize()).toBe('a year');
    expect(duration({days: 548}).humanize()).toBe('2 years');
    expect(duration({years: 1}).humanize()).toBe('a year');
    expect(duration({years: 5}).humanize()).toBe('5 years');
    expect(duration(7200000).humanize()).toBe('2 hours');
});

test('Duration#humanize with suffix', () => {
    expect(duration({seconds: 44}).humanize(true)).toBe('in a few seconds');
    expect(duration({seconds: -44}).humanize(true)).toBe('a few seconds ago');
    expect(duration({seconds: +44}).humanize(true)).toBe('in a few seconds');
});

test('Duration#humanize ru language', async () => {
    await settings.loadLocale('ru');
    expect(duration({seconds: 44}, {lang: 'ru'}).humanize(true)).toBe('через несколько секунд');
    expect(duration({seconds: -44}, {lang: 'ru'}).humanize(true)).toBe('несколько секунд назад');
    expect(duration({seconds: +44}, {lang: 'ru'}).humanize(true)).toBe('через несколько секунд');
});
