// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import {duration} from '../';

test('Duration sets all the values', () => {
    const dur = duration({
        years: 1,
        months: 2,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
        milliseconds: 7,
    });
    expect(dur.years()).toBe(1);
    expect(dur.months()).toBe(2);
    expect(dur.days()).toBe(3);
    expect(dur.hours()).toBe(4);
    expect(dur.minutes()).toBe(5);
    expect(dur.seconds()).toBe(6);
    expect(dur.milliseconds()).toBe(7);
});

test('Duration sets all the fractional values', () => {
    const dur = duration({
        years: 1,
        months: 2,
        days: 3,
        hours: 4.5,
        minutes: 5,
    });
    expect(dur.years()).toBe(1);
    expect(dur.months()).toBe(2);
    expect(dur.days()).toBe(3);
    expect(dur.hours()).toBe(4.5);
    expect(dur.minutes()).toBe(5);
    expect(dur.seconds()).toBe(0);
    expect(dur.milliseconds()).toBe(0);
});

test('Duration sets all the values from the object having string type values', () => {
    const dur = duration({
        years: '1',
        months: '2',
        days: '3',
        hours: '4',
        minutes: '5',
        seconds: '6',
        milliseconds: '7',
    });
    expect(dur.years()).toBe(1);
    expect(dur.months()).toBe(2);
    expect(dur.days()).toBe(3);
    expect(dur.hours()).toBe(4);
    expect(dur.minutes()).toBe(5);
    expect(dur.seconds()).toBe(6);
    expect(dur.milliseconds()).toBe(7);
});

test('Duration({}) constructs zero duration', () => {
    const dur = duration({});
    expect(dur.years()).toBe(0);
    expect(dur.months()).toBe(0);
    expect(dur.days()).toBe(0);
    expect(dur.hours()).toBe(0);
    expect(dur.minutes()).toBe(0);
    expect(dur.seconds()).toBe(0);
    expect(dur.milliseconds()).toBe(0);
});

test('Duration throws if the initial object has invalid keys', () => {
    // @ts-expect-error
    expect(() => duration({foo: 0})).toThrow();
    // @ts-expect-error
    expect(() => duration({years: 1, foo: 0})).toThrow();
});

test('Duration throws if the initial object has invalid values', () => {
    // @ts-expect-error
    expect(() => duration({years: {}})).toThrow();
    expect(() => duration({months: 'some'})).toThrow();
    expect(() => duration({days: NaN})).toThrow();
    // @ts-expect-error
    expect(() => duration({hours: true})).toThrow();
    // @ts-expect-error
    expect(() => duration({minutes: false})).toThrow();
    expect(() => duration({seconds: ''})).toThrow();
});

it('Duration returns passed Duration', () => {
    const durFromObject = duration({hours: 1});
    const dur = duration(durFromObject);
    expect(dur).toStrictEqual(durFromObject);
});

it('Duration throws on invalid input', () => {
    expect(() => duration('foo')).toThrow();
});
