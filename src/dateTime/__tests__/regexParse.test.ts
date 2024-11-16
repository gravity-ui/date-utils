import {dateTime} from '../dateTime';

test('DateTime from ISO parses as local by default', () => {
    const dt = dateTime({input: '2016-05-25T09:08:34.123'});
    expect([
        dt.year(),
        dt.month(),
        dt.date(),
        dt.hour(),
        dt.minute(),
        dt.second(),
        dt.millisecond(),
    ]).toEqual([2016, 4, 25, 9, 8, 34, 123]);
});

test('DateTime from ISO uses the offset provided, but keeps the dateTime as local', () => {
    const dt = dateTime({input: '2016-05-25T09:08:34.123+06:00'}).utc();
    expect([
        dt.year(),
        dt.month(),
        dt.date(),
        dt.hour(),
        dt.minute(),
        dt.second(),
        dt.millisecond(),
    ]).toEqual([2016, 4, 25, 3, 8, 34, 123]);
});

test('DateTime from ISO uses the Z if provided, but keeps the dateTime as local', () => {
    const dt = dateTime({input: '2016-05-25T09:08:34.123Z'}).utc();
    expect([
        dt.year(),
        dt.month(),
        dt.date(),
        dt.hour(),
        dt.minute(),
        dt.second(),
        dt.millisecond(),
    ]).toEqual([2016, 4, 25, 9, 8, 34, 123]);
});

test.each<[string, [number, number, number, number, number, number, number]]>([
    ['2016', [2016, 0, 1, 0, 0, 0, 0]],
    ['2016-05', [2016, 4, 1, 0, 0, 0, 0]],
    ['201605', [2016, 4, 1, 0, 0, 0, 0]],
    ['2016-05-25', [2016, 4, 25, 0, 0, 0, 0]],
    ['20160525', [2016, 4, 25, 0, 0, 0, 0]],
    ['+002016-05-25', [2016, 4, 25, 0, 0, 0, 0]],
    ['-002016-05-25', [-2016, 4, 25, 0, 0, 0, 0]],
    ['2016-05-25T09', [2016, 4, 25, 9, 0, 0, 0]],
    ['2016-05-25T09:08', [2016, 4, 25, 9, 8, 0, 0]],
    ['2016-05-25T0908', [2016, 4, 25, 9, 8, 0, 0]],
    ['2016-05-25T09:08:34', [2016, 4, 25, 9, 8, 34, 0]],
    ['2016-05-25T090834', [2016, 4, 25, 9, 8, 34, 0]],
    ['2016-05-25T09:08:34.123', [2016, 4, 25, 9, 8, 34, 123]],
    ['2016-05-25T09:08:34.123999', [2016, 4, 25, 9, 8, 34, 123]],
    ['2016-05-25T09:08:34,123', [2016, 4, 25, 9, 8, 34, 123]],
    ['2016-05-25T090834.123', [2016, 4, 25, 9, 8, 34, 123]],
    ['2016-05-25T09:08:34.023', [2016, 4, 25, 9, 8, 34, 23]],
    ['2016-05-25T09:08:34.99999', [2016, 4, 25, 9, 8, 34, 999]],
    ['2016-05-25T09:08:34.1', [2016, 4, 25, 9, 8, 34, 100]],
    ['2016-W21', [2016, 4, 16, 0, 0, 0, 0]],
    ['2016-W21-3', [2016, 4, 18, 0, 0, 0, 0]],
    ['2016W213', [2016, 4, 18, 0, 0, 0, 0]],
    ['2016-W21-3T09:24:15.123', [2016, 4, 18, 9, 24, 15, 123]],
    ['2016W213T09:24:15.123', [2016, 4, 18, 9, 24, 15, 123]],
    ['2016-200', [2016, 6, 18, 0, 0, 0, 0]],
    ['2016200', [2016, 6, 18, 0, 0, 0, 0]],
    ['2016-200T09:24:15.123', [2016, 6, 18, 9, 24, 15, 123]],
    ['2016200T09:24:15.123', [2016, 6, 18, 9, 24, 15, 123]],
    ['2016-002', [2016, 0, 2, 0, 0, 0, 0]],
    ['2018-01-04T24:00', [2018, 0, 5, 0, 0, 0, 0]],
])('DateTime from ISO (%p)', (input, expected) => {
    const dt = dateTime({input});
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

test("DateTime from ISO doesn't accept 24:23", () => {
    expect(dateTime({input: '2018-05-25T24:23'}).isValid()).toBe(false);
});

test.each<[string, [number, number, number, number]]>([
    ['09:24:15.123', [9, 24, 15, 123]],
    ['09:24:15,123', [9, 24, 15, 123]],
    ['09:24:15', [9, 24, 15, 0]],
    ['09:24', [9, 24, 0, 0]],
])('DateTime from ISO time (%p)', (input, expected) => {
    const dt = dateTime({input});
    const now = dateTime();
    expect([
        dt.year(),
        dt.month(),
        dt.date(),
        dt.hour(),
        dt.minute(),
        dt.second(),
        dt.millisecond(),
    ]).toEqual([now.year(), now.month(), now.date(), ...expected]);
});

test.each<[string, [number, number, number, number, number, number]]>([
    ['Sun, 12 Apr 2015 05:06:07 GMT', [2015, 3, 12, 5, 6, 7]],
    ['Tue, 01 Nov 2016 01:23:45 +0000', [2016, 10, 1, 1, 23, 45]],
    ['Tue, 01 Nov 16 04:23:45 Z', [2016, 10, 1, 4, 23, 45]],
    ['01 Nov 2016 05:23:45 z', [2016, 10, 1, 5, 23, 45]],
    ['01 Nov 2016 13:23 +0600', [2016, 10, 1, 7, 23, 0]],
    ['Mon, 02 Jan 2017 06:00:00 -0800', [2017, 0, 2, 6 + 8, 0, 0]],
    ['Mon, 02 Jan 2017 06:00:00 +0800', [2017, 0, 1, 22, 0, 0]],
    ['Mon, 02 Jan 2017 06:00:00 +0330', [2017, 0, 2, 2, 30, 0]],
    ['Mon, 02 Jan 2017 06:00:00 -0330', [2017, 0, 2, 9, 30, 0]],
    ['Mon, 02 Jan 2017 06:00:00 PST', [2017, 0, 2, 6 + 8, 0, 0]],
    ['Mon, 02 Jan 2017 06:00:00 PDT', [2017, 0, 2, 6 + 7, 0, 0]],
])('DateTime from RFC2822 (%p)', (input, expected) => {
    const dt = dateTime({input}).utc();
    expect([dt.year(), dt.month(), dt.date(), dt.hour(), dt.minute(), dt.second()]).toEqual(
        expected,
    );
});

test.each<[string, [number, number, number, number, number, number]]>([
    ['Fri, 19 Nov 82 16:14:55 GMT', [1982, 10, 19, 16, 14, 55]],
    ['Sun, 06 Nov 1994 08:49:37 GMT', [1994, 10, 6, 8, 49, 37]],
    ['Sunday, 06-Nov-94 08:49:37 GMT', [1994, 10, 6, 8, 49, 37]],
    ['Wednesday, 29-Jun-22 08:49:37 GMT', [2022, 5, 29, 8, 49, 37]],
    ['Sun Nov  6 08:49:37 1994', [1994, 10, 6, 8, 49, 37]],
    ['Wed Nov 16 08:49:37 1994', [1994, 10, 16, 8, 49, 37]],
])('DateTime from HTTP (%p)', (input, expected) => {
    const dt = dateTime({input}).utc();
    expect([dt.year(), dt.month(), dt.date(), dt.hour(), dt.minute(), dt.second()]).toEqual(
        expected,
    );
});
