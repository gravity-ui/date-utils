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
    expect(duration({days: 550}).humanize()).toBe('2 years');
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

//------
// #format()
//------

test("Duration#format('S') returns milliseconds", () => {
    expect(dur().format('S')).toBe('37695150007');

    const lil = duration(5);
    expect(lil.format('S')).toBe('5');
    expect(lil.format('SS')).toBe('05');
    expect(lil.format('SSSSS')).toBe('00005');
});

test("Duration#format('s') returns seconds", () => {
    expect(dur().format('s')).toBe('37695150');
    expect(dur().format('s', {floor: false})).toBe('37695150.007');
    expect(dur().format('s.SSS')).toBe('37695150.007');

    const lil = duration({seconds: 6});
    expect(lil.format('s')).toBe('6');
    expect(lil.format('ss')).toBe('06');
    expect(lil.format('sss')).toBe('006');
    expect(lil.format('ssss')).toBe('0006');
});

test("Duration#format('m') returns minutes", () => {
    expect(dur().format('m')).toBe('628252');
    expect(dur().format('m', {floor: false})).toBe('628252.5');
    expect(dur().format('m:ss')).toBe('628252:30');
    expect(dur().format('m:ss.SSS')).toBe('628252:30.007');

    const lil = duration({minutes: 6});
    expect(lil.format('m')).toBe('6');
    expect(lil.format('mm')).toBe('06');
    expect(lil.format('mmm')).toBe('006');
    expect(lil.format('mmmm')).toBe('0006');
});

test("Duration#format('h') returns hours", () => {
    expect(dur().format('h')).toBe('10470');
    expect(dur().format('h', {floor: false})).toBe('10470.875');
    expect(dur().format('h:ss')).toBe('10470:3150');
    expect(dur().format('h:mm:ss.SSS')).toBe('10470:52:30.007');

    const lil = duration({hours: 6});
    expect(lil.format('h')).toBe('6');
    expect(lil.format('hh')).toBe('06');
    expect(lil.format('hhh')).toBe('006');
    expect(lil.format('hhhh')).toBe('0006');
});

test("Duration#format('d') returns days", () => {
    expect(dur().format('d')).toBe('436');
    expect(dur().format('d', {floor: false})).toBe('436.286');
    expect(dur().format('d:h:ss')).toBe('436:6:3150');
    expect(dur().format('d:h:mm:ss.SSS')).toBe('436:6:52:30.007');

    const lil = duration({days: 6});
    expect(lil.format('d')).toBe('6');
    expect(lil.format('dd')).toBe('06');
    expect(lil.format('ddd')).toBe('006');
    expect(lil.format('dddd')).toBe('0006');
});

test("Duration#format('w') returns weeks", () => {
    expect(dur().format('w')).toBe('62');
    expect(dur().format('w', {floor: false})).toBe('62.327');
    expect(dur().format('w:s')).toBe('62:197550');
    expect(dur().format('w:dd:h:mm:ss.SSS')).toBe('62:02:6:52:30.007');

    const lil = duration({weeks: 6});
    expect(lil.format('w')).toBe('6');
    expect(lil.format('ww')).toBe('06');
    expect(lil.format('www')).toBe('006');
    expect(lil.format('wwww')).toBe('0006');
});

test("Duration#format('M') returns months", () => {
    expect(dur().format('M')).toBe('14');
    expect(dur().format('M', {floor: false})).toBe('14.334');
    expect(dur().format('M:s')).toBe('14:878706');
    expect(dur().format('M:dd:h:mm:ss.SSS')).toBe('14:10:4:05:06.007');

    const lil = duration({months: 6});
    expect(lil.format('M')).toBe('6');
    expect(lil.format('MM')).toBe('06');
    expect(lil.format('MMM')).toBe('006');
    expect(lil.format('MMMM')).toBe('0006');
});

test("Duration#format('y') returns years", () => {
    expect(dur().format('y')).toBe('1');
    expect(dur().format('y', {floor: false})).toBe('1.195');
    expect(dur().format('y:m')).toBe('1:102303');
    expect(dur().format('y:M:dd:h:mm:ss.SSS')).toBe('1:2:10:4:05:06.007');

    const lil = duration({years: 5});
    expect(lil.format('y')).toBe('5');
    expect(lil.format('yy')).toBe('05');
    expect(lil.format('yyyyy')).toBe('00005');
});

test('Duration#format leaves in zeros', () => {
    const tiny = duration({seconds: 5});
    expect(tiny.format('hh:mm:ss')).toBe('00:00:05');
    expect(tiny.format('hh:mm:ss.SSS')).toBe('00:00:05.000');
});

test('Duration#format rounds down', () => {
    const tiny = duration({seconds: 5.7});
    expect(tiny.format('s')).toBe('5');

    const unpromoted = duration({seconds: 59.7});
    expect(unpromoted.format('mm:ss')).toBe('00:59');
});

test('Duration#format localizes the numbers', async () => {
    await settings.loadLocale('bn');
    expect(dur().locale('bn').format('yy:MM:dd:h:mm:ss.SSS')).toBe('০১:০২:১০:৪:০৫:০৬.০০৭');
});
