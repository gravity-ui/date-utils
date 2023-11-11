import {dateTime} from '../dateTime';

test('local to utc, keepLocalTime = true', () => {
    const m = dateTime();
    const fmt = 'YYYY-DD-MM HH:mm:ss';
    expect(m.utc(true).format(fmt)).toBe(m.format(fmt));
});

test('local to utc, keepLocalTime = false', () => {
    const m = dateTime();
    expect(m.utc().valueOf()).toBe(m.valueOf());
    expect(m.utc(false).valueOf()).toBe(m.valueOf());
});

test('local to zone, keepLocalTime = true', () => {
    const m = dateTime();
    const fmt = 'YYYY-DD-MM HH:mm:ss';

    // Apparently there is -12:00 and +14:00
    // https://en.wikipedia.org/wiki/UTC+14:00
    // https://en.wikipedia.org/wiki/UTC-12:00
    for (let z = -12; z <= 14; ++z) {
        expect(m.utcOffset(z * 60, true).format(fmt)).toBe(m.format(fmt));
    }
});

test('local to zone, keepLocalTime = false', () => {
    const m = dateTime();

    // Apparently there is -12:00 and +14:00
    // https://en.wikipedia.org/wiki/UTC+14:00
    // https://en.wikipedia.org/wiki/UTC-12:00
    for (let z = -12; z <= 14; ++z) {
        expect(m.utcOffset(z * 60).valueOf()).toBe(m.valueOf());
        expect(m.utcOffset(z * 60, false).valueOf()).toBe(m.valueOf());
    }
});

test('utc to local, keepLocalTime = true', () => {
    const um = dateTime().utc();
    const fmt = 'YYYY-DD-MM HH:mm:ss';

    expect(um.local(true).format(fmt)).toBe(um.format(fmt));
});

test('utc to local, keepLocalTime = false', () => {
    const um = dateTime().utc();
    expect(um.local().valueOf()).toBe(um.valueOf());
    expect(um.local(false).valueOf()).toBe(um.valueOf());
});

test('zone to local, keepLocalTime = true', () => {
    const m = dateTime();
    const fmt = 'YYYY-DD-MM HH:mm:ss';

    // Apparently there is -12:00 and +14:00
    // https://en.wikipedia.org/wiki/UTC+14:00
    // https://en.wikipedia.org/wiki/UTC-12:00
    for (let z = -12; z <= 14; ++z) {
        const tz = m.utcOffset(z * 60);

        expect(tz.local(true).format(fmt)).toBe(tz.format(fmt));
    }
});

test('zone to local, keepLocalTime = false', () => {
    const m = dateTime();

    // Apparently there is -12:00 and +14:00
    // https://en.wikipedia.org/wiki/UTC+14:00
    // https://en.wikipedia.org/wiki/UTC-12:00
    for (let z = -12; z <= 14; ++z) {
        const tz = m.utcOffset(z * 60);

        expect(tz.local().valueOf()).toBe(tz.valueOf());
        expect(tz.local(false).valueOf()).toBe(tz.valueOf());
    }
});
