// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import {duration} from '..';

const dur = () =>
    duration({
        years: 1,
        months: 1,
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        milliseconds: 1,
    });

test('Duration#set sets the values', () => {
    expect(dur().set({years: 2}).years()).toBe(2);
    expect(dur().set({months: 2}).months()).toBe(2);
    expect(dur().set({days: 2}).days()).toBe(2);
    expect(dur().set({hours: 4}).hours()).toBe(4);
    expect(dur().set({hours: 4.5}).hours()).toBe(4.5);
    expect(dur().set({minutes: 16}).minutes()).toBe(16);
    expect(dur().set({seconds: 45}).seconds()).toBe(45);
    expect(dur().set({milliseconds: 86}).milliseconds()).toBe(86);
});

test('Duration#set throws for metadata', () => {
    // @ts-expect-error
    expect(() => dur.set({locale: 'be'})).toThrow();
    // @ts-expect-error
    expect(() => dur.set({numberingSystem: 'thai'})).toThrow();
    // @ts-expect-error
    expect(() => dur.set({invalid: 42})).toThrow();
});
