import type {DurationUnit} from '../../typings';
import {dateTime} from '../dateTime';

test.each<[{method: 'add' | 'subtract'; amount: number; unit: DurationUnit}, string]>([
    [{method: 'add', amount: 5, unit: 'seconds'}, 'a few seconds ago'],
    [{method: 'add', amount: 1, unit: 'minute'}, 'a minute ago'],
    [{method: 'add', amount: 5, unit: 'minutes'}, '5 minutes ago'],
    [{method: 'subtract', amount: 5, unit: 'seconds'}, 'in a few seconds'],
    [{method: 'subtract', amount: 1, unit: 'minute'}, 'in a minute'],
    [{method: 'subtract', amount: 5, unit: 'minutes'}, 'in 5 minutes'],
])('from (%j)', ({method, amount, unit}, expected) => {
    const start = dateTime({lang: 'en'});
    expect(start.from(start[method](amount, unit))).toBe(expected);
});

test.each<[{method: 'add' | 'subtract'; amount: number; unit: DurationUnit}, string]>([
    [{method: 'add', amount: 5, unit: 'seconds'}, 'a few seconds'],
    [{method: 'add', amount: 1, unit: 'minute'}, 'a minute'],
    [{method: 'add', amount: 5, unit: 'minutes'}, '5 minutes'],
    [{method: 'subtract', amount: 5, unit: 'seconds'}, 'a few seconds'],
    [{method: 'subtract', amount: 1, unit: 'minute'}, 'a minute'],
    [{method: 'subtract', amount: 5, unit: 'minutes'}, '5 minutes'],
])('from with absolute duration(%j)', ({method, amount, unit}, expected) => {
    const start = dateTime({lang: 'en'});
    expect(start.from(start[method](amount, unit), true)).toBe(expected);
});
