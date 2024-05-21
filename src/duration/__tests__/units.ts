// Copyright 2019 JS Foundation and other contributors
// Copyright 2024 YANDEX LLC

import {duration} from '..';

//------
// #shiftTo()

//-------
test('Duration#shiftTo rolls milliseconds up hours and minutes', () => {
    const dur = duration(5760000);
    expect(dur.shiftTo(['hours']).hours()).toBe(1.6);

    const mod = dur.shiftTo(['hours', 'minutes']);
    expect(mod.toObject()).toEqual({hours: 1, minutes: 36});
});

test('Duration#shiftTo boils hours down milliseconds', () => {
    const dur = duration({hours: 1}).shiftTo(['milliseconds']);
    expect(dur.milliseconds()).toBe(3600000);
});

test('Duration boils hours down shiftTo minutes and milliseconds', () => {
    const dur = duration({hours: 1, seconds: 30}).shiftTo(['minutes', 'milliseconds']);
    expect(dur.toObject()).toEqual({minutes: 60, milliseconds: 30000});
});

test('Duration#shiftTo boils down and then rolls up', () => {
    const dur = duration({years: 2, hours: 5000}).shiftTo(['months', 'days', 'minutes'], {
        roundUp: true,
    });
    expect(dur.toObject()).toEqual({months: 30, days: 25, minutes: 1025});
});

test('Duration#shiftTo throws on invalid units', () => {
    expect(() => {
        // @ts-expect-error
        duration({years: 2, hours: 5000}).shiftTo('months', 'glorp');
    }).toThrow();
});

test('Duration#shiftTo tacks decimals onto the end', () => {
    const dur = duration({minutes: 73}).shiftTo(['hours']);
    expect(dur.isValid()).toBe(true);
    expect(dur.hours()).toBeCloseTo(1.217, 3);
});

test('Duration#shiftTo deconstructs decimal inputs', () => {
    const dur = duration({hours: 2.3}).shiftTo(['hours', 'minutes']);
    expect(dur.isValid()).toBe(true);
    expect(dur.hours()).toBe(2);
    expect(dur.minutes()).toBeCloseTo(18, 8);
});

test('Duration#shiftTo deconstructs in cascade and tacks decimal onto the end', () => {
    const dur = duration({hours: 1.17}).shiftTo(['hours', 'minutes', 'seconds']);

    expect(dur.isValid()).toBe(true);
    expect(dur.hours()).toBe(1);
    expect(dur.minutes()).toBe(10);
    expect(dur.seconds()).toBeCloseTo(12, 8);
});

test('Duration#shiftTo without any units no-ops', () => {
    const dur = duration({years: 3}).shiftTo([]);
    expect(dur.isValid()).toBe(true);
    expect(dur.toObject()).toEqual({years: 3});
});

test('Duration#shiftTo accumulates when rolling up', () => {
    expect(
        duration({minutes: 59, seconds: 183}).shiftTo(['hours', 'minutes', 'seconds']).toObject(),
    ).toEqual({hours: 1, minutes: 2, seconds: 3});
});

test('Duration#shiftTo keeps unnecessary higher-order negative units 0', () => {
    expect(
        duration({milliseconds: -100}).shiftTo(['hours', 'minutes', 'seconds']).toObject(),
    ).toEqual({hours: 0, minutes: 0, seconds: -0.1});
});

test('Duration#shiftTo does not normalize values', () => {
    // Normalizing would convert to { quarters: 4, months: 1, days: 10 }
    // which would be converted back to 404 days instead
    expect(duration({quarters: 0, months: 0, days: 400}).shiftTo(['days']).toObject()).toEqual({
        days: 400,
    });
});

test('Duration#shiftTo boils hours down to hours and minutes', () => {
    const dur = duration({hour: 2.4});
    expect(dur.shiftTo(['hours', 'minutes']).toObject()).toEqual({
        hours: 2,
        minutes: 24,
    });
});

test('Duration#shiftTo handles mixed units', () => {
    const dur = duration({weeks: -1, days: 14});
    expect(dur.shiftTo(['years', 'months', 'weeks']).toObject()).toEqual({
        years: 0,
        months: 0,
        weeks: 1,
    });
});

test('Duration#shiftTo does not produce unnecessary fractions in higher order units', () => {
    const dur = duration({years: 2.5, weeks: -1});
    const shifted = dur.shiftTo(['years', 'weeks', 'minutes']).toObject();
    expect(shifted.years).toBe(2);
    expect(shifted.weeks).toBe(25);
    expect(shifted.minutes).toBeCloseTo(894.6, 5);
});

//------
// #normalize()
//-------
test('Duration#normalize rebalances negative units', () => {
    const dur = duration({years: 2, days: -2}).normalize({roundUp: true});
    expect(dur.toObject()).toEqual({years: 1, days: 363});
});

test('Duration#normalize de-overflows', () => {
    const dur = duration({years: 2, days: 5000}).normalize({roundUp: true});
    expect(dur.years()).toBe(15);
    expect(dur.days()).toBe(252);
    expect(dur.toObject()).toEqual({years: 15, days: 252});
});

test('Duration#normalize handles fully negative durations', () => {
    const dur = duration({years: -2, days: -5000}).normalize({roundUp: true});
    expect(dur.toObject()).toEqual({years: -15, days: -252});
});

test('Duration#normalize handles the full grid partially negative durations', () => {
    const sets = [
        [
            {months: 1, days: 32},
            {months: 2, days: 2},
        ],
        [
            {months: 1, days: 28},
            {months: 1, days: 28},
        ],
        [
            {months: 1, days: -32},
            {months: 0, days: -2},
        ],
        [
            {months: 1, days: -28},
            {months: 0, days: 2},
        ],
        [
            {months: -1, days: 32},
            {months: 0, days: 2},
        ],
        [
            {months: -1, days: 28},
            {months: 0, days: -2},
        ],
        [
            {months: -1, days: -32},
            {months: -2, days: -2},
        ],
        [
            {months: -1, days: -28},
            {months: -1, days: -28},
        ],
        [
            {months: 0, days: 32},
            {months: 1, days: 2},
        ],
        [
            {months: 0, days: 28},
            {months: 0, days: 28},
        ],
        [
            {months: 0, days: -32},
            {months: -1, days: -2},
        ],
        [
            {months: 0, days: -28},
            {months: 0, days: -28},
        ],
        [
            {hours: 96, minutes: 0, seconds: -10},
            {hours: 95, minutes: 59, seconds: 50},
        ],
    ];

    sets.forEach(([from, to]) => {
        expect(duration(from).normalize({roundUp: true}).toObject()).toEqual(to);
    });
});

test('Duration#normalize can convert all unit pairs', () => {
    const units = [
        'years',
        'quarters',
        'months',
        'weeks',
        'days',
        'hours',
        'minutes',
        'seconds',
        'milliseconds',
    ] as const;

    for (let i = 0; i < units.length; i++) {
        for (let j = i + 1; j < units.length; j++) {
            const dur = duration({[units[i]]: 1, [units[j]]: 2});
            const normalizedDuration = dur.normalize().toObject();
            expect(normalizedDuration[units[i]]).not.toBe(NaN);
            expect(normalizedDuration[units[j]]).not.toBe(NaN);
        }
    }
});

test('Duration#normalize moves fractions to lower-order units', () => {
    expect(duration({years: 2.5, days: 0, hours: 0}).normalize({roundUp: true}).toObject()).toEqual(
        {
            years: 2,
            days: 182,
            hours: 15,
        },
    );
    expect(
        duration({years: -2.5, days: 0, hours: 0}).normalize({roundUp: true}).toObject(),
    ).toEqual({
        years: -2,
        days: -182,
        hours: -15,
    });
    expect(
        duration({years: 2.5, days: 12, hours: 0}).normalize({roundUp: true}).toObject(),
    ).toEqual({
        years: 2,
        days: 194,
        hours: 15,
    });
    expect(
        duration({years: 2.5, days: 12.25, hours: 0}).normalize({roundUp: true}).toObject(),
    ).toEqual({
        years: 2,
        days: 194,
        hours: 21,
    });
});

test('Duration#normalize does not produce fractions in higher order units when rolling up negative lower order unit values', () => {
    const normalized = duration({years: 100, months: 0, weeks: -1, days: 0}).normalize().toObject();
    expect(normalized.years).toBe(99);
    expect(normalized.months).toBe(11);
    expect(normalized.weeks).toBe(3);
    expect(normalized.days).toBeCloseTo(2.436875, 7);
});

//------
// #rescale()
//-------
test('Duration#rescale normalizes, shifts to all units and remove units with a value of 0', () => {
    const sets = [
        [{milliseconds: 90000}, {minutes: 1, seconds: 30}],
        [
            {minutes: 70, milliseconds: 12100},
            {hours: 1, minutes: 10, seconds: 12, milliseconds: 100},
        ],
        [{months: 2, days: -146097.0 / 4800}, {months: 1}],
    ];

    sets.forEach(([from, to]) => {
        expect(duration(from).rescale().toObject()).toEqual(to);
    });
});

//------
// #as()
//-------

test('Duration#as shifts to one unit and returns it', () => {
    const dur = duration(5760000);
    expect(dur.as('hours')).toBe(1.6);
});

//------
// #valueOf()
//-------

test('Duration#valueOf value of zero duration', () => {
    const dur = duration({});
    expect(dur.valueOf()).toBe(0);
});

test('Duration#valueOf returns as millisecond value (lower order units)', () => {
    const dur = duration({hours: 1, minutes: 36, seconds: 0});
    expect(dur.valueOf()).toBe(5760000);
});

test('Duration#valueOf value of the duration with lower and higher order units', () => {
    const dur = duration({days: 2, seconds: 1});
    expect(dur.valueOf()).toBe(172801000);
});
