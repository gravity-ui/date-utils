import {dateTime} from '../dateTime';

test.each<
    [[input: string, format: string], [number, number, number, number, number, number, number]]
>([
    [
        ['1982/05/25 09:10:11.445', 'YYYY/MM/DD HH:mm:ss.SSS'],
        [1982, 4, 25, 9, 10, 11, 445],
    ],
    [
        ['1982/05/03 09:07:05.004', 'Y/M/D H:m:s.SSS'],
        [1982, 4, 3, 9, 7, 5, 4],
    ],
    [
        ['82/5/3 9:7:5.4', 'YY/M/D H:m:s.S'],
        [1982, 4, 3, 9, 7, 5, 400],
    ],
    [
        ['1982/05/25 9 PM', 'YYYY/MM/DD h a'],
        [1982, 4, 25, 21, 0, 0, 0],
    ],
    [
        ['1982/05/25 9 AM', 'YYYY/MM/DD h a'],
        [1982, 4, 25, 9, 0, 0, 0],
    ],
    [
        ['1982/05/25 12 PM', 'YYYY/MM/DD h a'],
        [1982, 4, 25, 12, 0, 0, 0],
    ],
    [
        ['1982/05/25 12 AM', 'YYYY/MM/DD h a'],
        [1982, 4, 25, 0, 0, 0, 0],
    ],
])('DateTime from format (%p)', ([input, format], expected) => {
    const dt = dateTime({input, format});
    expect([
        dt.year(),
        dt.month(),
        dt.date(),
        dt.hour(),
        dt.minute(),
        dt.second(),
        dt.millisecond(),
    ]).toEqual(expected);
});

test('DateTime from format makes dots optional and handles non breakable spaces', () => {
    function parseMeridiem(input: string, isAM: boolean) {
        const d = dateTime({input, format: 'hh:mm a', lang: 'es-ES'});
        expect(d.hour()).toBe(isAM ? 10 : 22);
        expect(d.minute()).toBe(45);
        expect(d.second()).toBe(0);
    }

    // Meridiem for this locale is "a. m." or "p. m.", with a non breakable space
    parseMeridiem('10:45 a. m.', true);
    parseMeridiem('10:45 a. m', true);
    parseMeridiem('10:45 a m.', true);
    parseMeridiem('10:45 a m', true);

    parseMeridiem('10:45 p. m.', false);
    parseMeridiem('10:45 p. m', false);
    parseMeridiem('10:45 p m.', false);
    parseMeridiem('10:45 p m', false);

    const nbsp = String.fromCharCode(160);

    parseMeridiem(`10:45 a.${nbsp}m.`, true);
    parseMeridiem(`10:45 a.${nbsp}m`, true);
    parseMeridiem(`10:45 a${nbsp}m.`, true);
    parseMeridiem(`10:45 a${nbsp}m`, true);

    parseMeridiem(`10:45 p.${nbsp}m.`, false);
    parseMeridiem(`10:45 p.${nbsp}m`, false);
    parseMeridiem(`10:45 p${nbsp}m.`, false);
    parseMeridiem(`10:45 p${nbsp}m`, false);
});

test('dateTime from format parses digit years()', () => {
    expect(dateTime({input: '', format: 'Y'}).isValid()).toBe(false);
    expect(dateTime({input: '2', format: 'Y'}).year()).toBe(2);
    expect(dateTime({input: '22', format: 'Y'}).year()).toBe(22);
    expect(dateTime({input: '222', format: 'Y'}).year()).toBe(222);
    expect(dateTime({input: '2222', format: 'Y'}).year()).toBe(2222);
    expect(dateTime({input: '22222', format: 'Y'}).year()).toBe(22222);
    expect(dateTime({input: '222222', format: 'Y'}).year()).toBe(222222);
    expect(dateTime({input: '2222222', format: 'Y'}).isValid()).toBe(false);
});

test('DateTime from format with YYYY optionally parses extended years', () => {
    expect(dateTime({input: '222', format: 'YYYYY'}).isValid()).toBe(false);
    expect(dateTime({input: '2222', format: 'YYYYY'}).year()).toBe(2222);
    expect(dateTime({input: '22222', format: 'YYYYY'}).year()).toBe(22222);
    expect(dateTime({input: '222222', format: 'YYYYY'}).year()).toBe(222222);
    expect(dateTime({input: '2222222', format: 'YYYYY'}).isValid()).toBe(false);
});

test('DateTime from format with YYYYYY strictly parses extended years', () => {
    expect(dateTime({input: '2222', format: 'YYYYYY'}).isValid()).toBe(false);
    expect(dateTime({input: '222222', format: 'YYYYYY'}).year()).toBe(222222);
    expect(dateTime({input: '022222', format: 'YYYYYY'}).year()).toBe(22222);
    expect(dateTime({input: '2222222', format: 'YYYYYY'}).isValid()).toBe(false);
});

test('DateTime from format defaults YY to the right century', () => {
    expect(dateTime({input: '60', format: 'YY'}).year()).toBe(2060);
    expect(dateTime({input: '61', format: 'YY'}).year()).toBe(1961);
    expect(dateTime({input: '1960', format: 'YY'}).year()).toBe(1960);
});

test('DateTime from format parses hours', () => {
    expect(dateTime({input: '5', format: 'h'}).hour()).toBe(5);
    expect(dateTime({input: '12', format: 'h'}).hour()).toBe(12);
    expect(dateTime({input: '05', format: 'hh'}).hour()).toBe(5);
    expect(dateTime({input: '12', format: 'hh'}).hour()).toBe(12);
    expect(dateTime({input: '5', format: 'H'}).hour()).toBe(5);
    expect(dateTime({input: '13', format: 'H'}).hour()).toBe(13);
    expect(dateTime({input: '05', format: 'HH'}).hour()).toBe(5);
    expect(dateTime({input: '13', format: 'HH'}).hour()).toBe(13);
});

test('DateTime from format parses milliseconds', () => {
    expect(dateTime({input: '1', format: 'S'}).millisecond()).toBe(100);
    expect(dateTime({input: '12', format: 'S'}).isValid()).toBe(false);

    expect(dateTime({input: '1', format: 'SS'}).isValid()).toBe(false);
    expect(dateTime({input: '12', format: 'SS'}).millisecond()).toBe(120);
    expect(dateTime({input: '123', format: 'SS'}).isValid()).toBe(false);

    expect(dateTime({input: '1', format: 'SSS'}).isValid()).toBe(false);
    expect(dateTime({input: '12', format: 'SSS'}).isValid()).toBe(false);
    expect(dateTime({input: '123', format: 'SSS'}).millisecond()).toBe(123);
    expect(dateTime({input: '023', format: 'SSS'}).millisecond()).toBe(23);
    expect(dateTime({input: '1234', format: 'SSS'}).isValid()).toBe(false);

    expect(dateTime({input: '1', format: 'SSSS'}).millisecond()).toBe(100);
    expect(dateTime({input: '12', format: 'SSSS'}).millisecond()).toBe(120);
    expect(dateTime({input: '123', format: 'SSSS'}).millisecond()).toBe(123);
    expect(dateTime({input: '1234', format: 'SSSS'}).millisecond()).toBe(123);
    expect(dateTime({input: '0009', format: 'SSSS'}).millisecond()).toBe(0);
    expect(dateTime({input: '12345', format: 'SSSS'}).isValid()).toBe(false);
});

test('DateTime from format parses IANA zones', () => {
    let d = dateTime({
        input: '1982/05/25 09:10:11.445 Asia/Tokyo',
        format: 'YYYY/MM/DD HH:mm:ss.SSS z',
    }).utc();
    expect(d.isValid()).toBe(true);
    expect(d.utcOffset()).toBe(0);
    expect(d.hour()).toBe(0);
    expect(d.minute()).toBe(10);

    d = dateTime({input: '1982/05/25 09:10:11.445 UTC', format: 'YYYY/MM/DD HH:mm:ss.SSS z'}).utc();
    expect(d.isValid()).toBe(true);
    expect(d.utcOffset()).toBe(0);
    expect(d.hour()).toBe(9);
    expect(d.minute()).toBe(10);
});

test.each<[string, string]>([
    ['Z', '-4'],
    ['Z', '-4:00'],
    ['Z', '-04:00'],
    ['ZZ', '-4'],
    ['ZZ', '-400'],
    ['ZZ', '-0400'],
])('DateTime from format parses fixed offset "%s" "%s"', (format, offset) => {
    const d = dateTime({
        input: `1982/05/25 09:10:11.445 ${offset}`,
        format: `YYYY/MM/DD HH:mm:ss.SSS ${format}`,
    }).utc();

    expect(d.isValid()).toBe(true);
    expect(d.hour()).toBe(13);
    expect(d.minute()).toBe(10);
});

test('DateTime from format parses special tokens', () => {
    const d = dateTime({input: '1982-05-25T09:10:11 UTC', format: 'YYYY-MM-DDTHH:mm:ss z'}).utc();
    expect(d.isValid()).toBe(true);
    expect(d.hour()).toBe(9);
    expect(d.minute()).toBe(10);
});

test('DateTime from format with setZone parses fixed offsets and sets it', () => {
    const formats = [
        ['Z', '-4'],
        ['ZZ', '-4:00'],
        ['ZZZ', '-0400'],
    ];

    for (const [format, example] of formats) {
        const dt = dateTime({
            input: `1982/05/25 09:10:11.445 ${example}`,
            format: `YYYY/MM/DD HH:mm:ss.SSS ${format}`,
            setTimezone: true,
        });
        expect(dt.isValid()).toBe(true);
        expect(dt.utcOffset()).toBe(-4 * 60);
        expect(dt.utc().hour()).toBe(13);
        expect(dt.utc().minute()).toBe(10);
    }
});

test('DateTime from format prefers IANA zone id', () => {
    const dt = dateTime({
        input: '2021-11-12T09:07:13.000+08:00[Australia/Perth]',
        format: 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ[[]z[]]',
        setTimezone: true,
    });
    expect(dt.isValid()).toBe(true);
    expect(dt.year).toBe(2021);
    expect(dt.month).toBe(11);
    expect(dt.day).toBe(12);
    expect(dt.hour).toBe(9);
    expect(dt.minute).toBe(7);
    expect(dt.second).toBe(13);
    expect(dt.millisecond).toBe(0);
    expect(dt.utcOffset()).toBe(480); //+08:00
    expect(dt.timeZone()).toBe('Australia/Perth');
});
