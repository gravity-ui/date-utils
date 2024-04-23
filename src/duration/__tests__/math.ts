// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import {duration} from '..';

//------
// #add()

//------
test('Duration#add add straightforward durations', () => {
    const first = duration({hours: 4, minutes: 12, seconds: 2}),
        second = duration({hours: 1, seconds: 6, milliseconds: 14}),
        result = first.add(second);

    expect(result.hours()).toBe(5);
    expect(result.minutes()).toBe(12);
    expect(result.seconds()).toBe(8);
    expect(result.milliseconds()).toBe(14);
});

test('Duration#add add fractional durations', () => {
    const first = duration({hours: 4.2, minutes: 12, seconds: 2}),
        second = duration({hours: 1, seconds: 6.8, milliseconds: 14}),
        result = first.add(second);

    expect(result.hours()).toBeCloseTo(5.2, 8);
    expect(result.minutes()).toBe(12);
    expect(result.seconds()).toBeCloseTo(8.8, 8);
    expect(result.milliseconds()).toBe(14);
});

test('Duration#add noops empty druations', () => {
    const first = duration({hours: 4, minutes: 12, seconds: 2}),
        second = duration({}),
        result = first.add(second);

    expect(result.hours()).toBe(4);
    expect(result.minutes()).toBe(12);
    expect(result.seconds()).toBe(2);
});

test('Duration#add adds negatives', () => {
    const first = duration({hours: 4, minutes: -12, seconds: -2}),
        second = duration({hours: -5, seconds: 6, milliseconds: 14}),
        result = first.add(second);

    expect(result.hours()).toBe(-1);
    expect(result.minutes()).toBe(-12);
    expect(result.seconds()).toBe(4);
    expect(result.milliseconds()).toBe(14);
});

test('Duration#add adds single values', () => {
    const first = duration({hours: 4, minutes: 12, seconds: 2}),
        result = first.add({minutes: 5});

    expect(result.hours()).toBe(4);
    expect(result.minutes()).toBe(17);
    expect(result.seconds()).toBe(2);
});

test('Duration#add adds number as milliseconds', () => {
    const first = duration({minutes: 11, seconds: 22}),
        result = first.add(333);

    expect(result.minutes()).toBe(11);
    expect(result.seconds()).toBe(22);
    expect(result.milliseconds()).toBe(333);
});

// test('Duration#add maintains invalidity', () => {
//     const dur = Duration.invalid('because').add({minutes: 5});
//     expect(dur.isValid).toBe(false);
//     expect(dur.invalidReason).toBe('because');
// });

test('Duration#add results in the superset of units', () => {
    let dur = duration({hours: 1, minutes: 0}).add({seconds: 3, milliseconds: 0});
    expect(dur.toObject()).toEqual({hours: 1, minutes: 0, seconds: 3, milliseconds: 0});

    dur = duration({hours: 1, minutes: 0}).add({});
    expect(dur.toObject()).toEqual({hours: 1, minutes: 0});
});

test('Duration#add throws with invalid parameter', () => {
    expect(() => duration({}).add('invalid')).toThrow();
});

//------
// #subtract()
//------
test('Duration#subtract subtracts durations', () => {
    const first = duration({hours: 4, minutes: 12, seconds: 2}),
        second = duration({hours: 1, seconds: 6, milliseconds: 14}),
        result = first.subtract(second);

    expect(result.hours()).toBe(3);
    expect(result.minutes()).toBe(12);
    expect(result.seconds()).toBe(-4);
    expect(result.milliseconds()).toBe(-14);
});

test('Duration#subtract subtracts fractional durations', () => {
    const first = duration({hours: 4.2, minutes: 12, seconds: 2}),
        second = duration({hours: 1, seconds: 6, milliseconds: 14}),
        result = first.subtract(second);

    expect(result.hours()).toBeCloseTo(3.2, 8);
    expect(result.minutes()).toBe(12);
    expect(result.seconds()).toBe(-4);
    expect(result.milliseconds()).toBe(-14);
});

test('Duration#subtract subtracts single values', () => {
    const first = duration({hours: 4, minutes: 12, seconds: 2}),
        result = first.subtract({minutes: 5});

    expect(result.hours()).toBe(4);
    expect(result.minutes()).toBe(7);
    expect(result.seconds()).toBe(2);
});

//------
// #negate()
//------

test('Duration#negate flips all the signs', () => {
    const dur = duration({hours: 4, minutes: -12, seconds: 2}),
        result = dur.negate();
    expect(result.hours()).toBe(-4);
    expect(result.minutes()).toBe(12);
    expect(result.seconds()).toBe(-2);
});

test("Duration#negate doesn't mutate", () => {
    const orig = duration({hours: 8});
    orig.negate();
    expect(orig.hours()).toBe(8);
});
