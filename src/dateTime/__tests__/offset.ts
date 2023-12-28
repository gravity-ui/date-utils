import {dateTime} from '../dateTime';

test('setter / getter', () => {
    const m = dateTime({input: [2010]});

    expect(m.utcOffset(0).utcOffset()).toBe(0);

    expect(m.utcOffset(1).utcOffset()).toBe(60);
    expect(m.utcOffset(60).utcOffset()).toBe(60);
    expect(m.utcOffset('+01:00').utcOffset()).toBe(60);
    expect(m.utcOffset('+0100').utcOffset()).toBe(60);

    expect(m.utcOffset(-1).utcOffset()).toBe(-60);
    expect(m.utcOffset(-60).utcOffset()).toBe(-60);
    expect(m.utcOffset('-01:00').utcOffset()).toBe(-60);
    expect(m.utcOffset('-0100').utcOffset()).toBe(-60);

    expect(m.utcOffset(1.5).utcOffset()).toBe(90);
    expect(m.utcOffset(90).utcOffset()).toBe(90);
    expect(m.utcOffset('+01:30').utcOffset()).toBe(90);
    expect(m.utcOffset('+0130').utcOffset()).toBe(90);

    expect(m.utcOffset(-1.5).utcOffset()).toBe(-90);
    expect(m.utcOffset(-90).utcOffset()).toBe(-90);
    expect(m.utcOffset('-01:30').utcOffset()).toBe(-90);
    expect(m.utcOffset('-0130').utcOffset()).toBe(-90);

    expect(m.utcOffset('+00:10').utcOffset()).toBe(10);
    expect(m.utcOffset('-00:10').utcOffset()).toBe(-10);
    expect(m.utcOffset('+0010').utcOffset()).toBe(10);
    expect(m.utcOffset('-0010').utcOffset()).toBe(-10);
});

test('utcOffset shorthand hours -> minutes', () => {
    let i;
    for (i = -15; i <= 15; ++i) {
        expect(dateTime().utcOffset(i).utcOffset()).toBe(i * 60);
    }

    expect(dateTime().utcOffset(-16).utcOffset()).toBe(-16);
    expect(dateTime().utcOffset(16).utcOffset()).toBe(16);
});

test('change hours when changing the utc offset', () => {
    const m = dateTime({input: [2000, 0, 1, 6]}).utc(true);
    expect(m.hour()).toBe(6);

    // sanity check
    expect(m.utcOffset(0).hour()).toBe(6);

    expect(m.utcOffset(-60).hour()).toBe(5);

    expect(m.utcOffset(60).hour()).toBe(7);
});

test('change minutes when changing the utc offset', () => {
    const m = dateTime({input: Date.UTC(2000, 0, 1, 6, 31)});

    expect(m.utcOffset(0).format('HH:mm')).toBe('06:31');

    expect(m.utcOffset(-30).format('HH:mm')).toBe('06:01');

    expect(m.utcOffset(30).format('HH:mm')).toBe('07:01');

    expect(m.utcOffset(-1380).format('HH:mm')).toBe('07:31');
});
