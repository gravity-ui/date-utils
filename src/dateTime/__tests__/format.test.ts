import {HTML5_INPUT_FORMATS, UtcTimeZone, englishFormats} from '../../constants';
import {settings} from '../../settings';
import {dateTime} from '../dateTime';
import {expandFormat} from '../format';

afterEach(() => {
    settings.setDefaultWeekSettings(null);
});

test('format using constants', () => {
    const m = dateTime({input: '2016-01-02T23:40:40.678'});
    expect(m.format(HTML5_INPUT_FORMATS.DATETIME_LOCAL)).toBe('2016-01-02T23:40'); // 'datetime local format constant'
    expect(m.format(HTML5_INPUT_FORMATS.DATETIME_LOCAL_SECONDS)).toBe('2016-01-02T23:40:40'); // 'datetime local format constant'

    expect(m.format(HTML5_INPUT_FORMATS.DATETIME_LOCAL_MS)).toBe('2016-01-02T23:40:40.678'); // 'datetime local format constant with seconds and millis'
    expect(m.format(HTML5_INPUT_FORMATS.DATE)).toBe('2016-01-02'); // 'date format constant'
    expect(m.format(HTML5_INPUT_FORMATS.TIME)).toBe('23:40'); // 'time format constant')
    expect(m.format(HTML5_INPUT_FORMATS.TIME_SECONDS)).toBe('23:40:40'); // 'time format constant with seconds'
    expect(m.format(HTML5_INPUT_FORMATS.TIME_MS)).toBe('23:40:40.678'); //'time format constant with seconds and millis'
    expect(m.format(HTML5_INPUT_FORMATS.WEEK)).toBe('2015-W53'); // 'week format constant'
    expect(m.format(HTML5_INPUT_FORMATS.MONTH)).toBe('2016-01'); // 'month format constant'
});

test('format YY', () => {
    const b = dateTime({input: new Date(2009, 1, 14, 15, 25, 50, 125)});
    expect(b.format('YY')).toBe('09'); // 'YY ---> 09'
});

test('format escape brackets', () => {
    const b = dateTime({input: new Date(2009, 1, 14, 15, 25, 50, 125)});
    expect(b.format('[day]')).toBe('day'); // 'Single bracket'
    expect(b.format('[day] YY [YY]')).toBe('day 09 YY'); // 'Double bracket'
    expect(b.format('[YY')).toBe('[09'); // 'Un-ended bracket'
    expect(b.format('[[YY]]')).toBe('[YY]'); // 'Double nested brackets'
    expect(b.format('[[]')).toBe('['); // 'Escape open bracket'
    expect(b.format('[Last]')).toBe('Last'); // 'localized tokens'
    expect(b.format('[L] L')).toBe('L 02/14/2009'); // 'localized tokens with escaped localized tokens'
    expect(b.format('[L LL LLL LLLL aLa]')).toBe('L LL LLL LLLL aLa'); // 'localized tokens with escaped localized tokens',
    expect(b.format('[LLL] LLL')).toBe('LLL February 14, 2009 3:25 PM'); // 'localized tokens with escaped localized tokens (recursion)',
    expect(b.format('YYYY[\n]DD[\n]')).toBe('2009\n14\n'); // 'Newlines'
});

test('handle negative years', () => {
    expect(dateTime().year(-1).format('YY')).toBe('-01'); // 'YY with negative year'
    expect(dateTime().year(-1).format('YYYY')).toBe('-0001'); // 'YYYY with negative year'
    expect(dateTime().year(-12).format('YY')).toBe('-12'); // 'YY with negative year'
    expect(dateTime().year(-12).format('YYYY')).toBe('-0012'); // 'YYYY with negative year'
    expect(dateTime().year(-123).format('YY')).toBe('-23'); // 'YY with negative year'
    expect(dateTime().year(-123).format('YYYY')).toBe('-0123'); // 'YYYY with negative year'
    expect(dateTime().year(-1234).format('YY')).toBe('-34'); // 'YY with negative year'
    expect(dateTime().year(-1234).format('YYYY')).toBe('-1234'); // 'YYYY with negative year'
    expect(dateTime().year(-12345).format('YY')).toBe('-45'); // 'YY with negative year'
    expect(dateTime().year(-12345).format('YYYY')).toBe('-12345'); // 'YYYY with negative year'
});

test('format milliseconds', () => {
    let b = dateTime({input: new Date(2009, 1, 14, 15, 25, 50, 123)});
    expect(b.format('S')).toBe('1'); // 'Deciseconds'
    expect(b.format('SS')).toBe('12'); // 'Centiseconds'
    expect(b.format('SSS')).toBe('123'); // 'Milliseconds'
    b = b.millisecond(789);
    expect(b.format('S')).toBe('7'); // 'Deciseconds'
    expect(b.format('SS')).toBe('78'); // 'Centiseconds'
    expect(b.format('SSS')).toBe('789'); // 'Milliseconds'
});

test('format timezone', () => {
    const b = dateTime({input: new Date(2010, 1, 14, 15, 25, 50, 125)});
    expect(b.format('Z')).toMatch(/^[+-]\d\d:\d\d$/); // 'should be something like '+07:30'
    expect(b.format('ZZ')).toMatch(/^[+-]\d{4}$/); // 'should be something like '+0700'
});

test('unix timestamp', () => {
    const m = dateTime({input: 1234567890123});
    expect(m.format('X')).toBe('1234567890'); // 'unix timestamp without milliseconds'
    expect(m.format('X.S')).toBe('1234567890.1'); // 'unix timestamp with deciseconds'
    expect(m.format('X.SS')).toBe('1234567890.12'); // 'unix timestamp with centiseconds'
    expect(m.format('X.SSS')).toBe('1234567890.123'); // 'unix timestamp with milliseconds'
});

test('unix offset milliseconds', () => {
    const m = dateTime({input: 1234567890123});
    expect(m.format('x')).toBe('1234567890123'); // 'unix offset in milliseconds'
});

test('utcOffset sanity checks', () => {
    expect(dateTime({timeZone: 'Europe/Amsterdam'}).utcOffset() % 15).toBe(0); // 'utc offset should be a multiple of 15 (was ' + dateTimeParse().utcOffset() + ')'

    expect(dateTime().utcOffset()).toBe(-new Date().getTimezoneOffset() || 0); // 'utcOffset should return the opposite of getTimezoneOffset'
});

test('default format', () => {
    const isoRegex = /\d{4}.\d\d.\d\dT\d\d.\d\d.\d\d[+-]\d\d:\d\d/;
    expect(isoRegex.exec(dateTime({timeZone: 'Europe/Amsterdam'}).format())).toBeTruthy();
});

test('default UTC format', () => {
    const isoRegex = /\d{4}.\d\d.\d\dT\d\d.\d\d.\d\dZ/;
    expect(isoRegex.exec(dateTime({timeZone: UtcTimeZone}).format())).toBeTruthy();
});

test('toJSON', () => {
    const date = dateTime({input: '2012-10-09T21:30:40.678+0100'});

    expect(date.toJSON()).toBe('2012-10-09T20:30:40.678Z'); // 'should output ISO8601 on dateTimeParse.fn.toJSON'

    expect(JSON.stringify({date})).toBe('{"date":"2012-10-09T20:30:40.678Z"}'); // 'should output ISO8601 on JSON.stringify'
});

test('toISOString', () => {
    let date = dateTime({input: '2012-10-09T20:30:40.678', timeZone: UtcTimeZone});

    expect(date.toISOString()).toBe('2012-10-09T20:30:40.678Z'); // 'should output ISO8601 on dateTimeParse.fn.toISOString'

    // big years
    date = dateTime({input: [20123, 9, 9, 20, 30, 40, 678], timeZone: UtcTimeZone});
    expect(date.toISOString()).toBe('+020123-10-09T20:30:40.678Z'); // 'ISO8601 format on big positive year'
    // negative years
    date = dateTime({input: [-1, 9, 9, 20, 30, 40, 678], timeZone: UtcTimeZone});
    expect(date.toISOString()).toBe('-000001-10-09T20:30:40.678Z'); // 'ISO8601 format on negative year'
    // big negative years
    date = dateTime({input: [-20123, 9, 9, 20, 30, 40, 678], timeZone: UtcTimeZone});
    expect(date.toISOString()).toBe('-020123-10-09T20:30:40.678Z'); // 'ISO8601 format on big negative year'

    //invalid dates
    date = dateTime({input: '2017-12-32k', timeZone: UtcTimeZone});
    expect(() => date.toISOString()).toThrow(); // 'An invalid date to iso string is null'
});

test('toISOString without UTC conversion', () => {
    let date = dateTime({input: '2016-12-31T19:53:45.678', timeZone: UtcTimeZone}).utcOffset(
        '+05:30',
    );

    expect(date.toISOString(true)).toBe('2017-01-01T01:23:45.678+05:30'); // 'should output ISO8601 on dateTimeParse.fn.toISOString'

    // big years
    date = dateTime({input: '+020122-12-31T19:53:45.678Z'}).utcOffset('+05:30');
    expect(date.toISOString(true)).toBe('+020123-01-01T01:23:45.678+05:30'); // 'ISO8601 format on big positive year'
    // negative years
    date = dateTime({input: '-000002-12-31T19:53:45.678Z'}).utcOffset('+05:30');
    expect(date.toISOString(true)).toBe('-000001-01-01T01:23:45.678+05:30'); //'ISO8601 format on negative year'
    // big negative years
    date = dateTime({input: '-020124-12-31T19:53:45.678Z'}).utcOffset('+05:30');
    expect(date.toISOString(true)).toBe('-020123-01-01T01:23:45.678+05:30'); // 'ISO8601 format on big negative year'

    //invalid dates
    date = dateTime({input: '2017-12-32k', timeZone: UtcTimeZone}).utcOffset('+05:30');
    expect(() => date.toISOString(true)).toThrow(); // 'An invalid date to iso string is null'
});

test('long years', () => {
    expect(dateTime().year(2).format('YYYYYY')).toBe('+000002'); // 'small year with YYYYYY'
    expect(dateTime().year(2012).format('YYYYYY')).toBe('+002012'); // 'regular year with YYYYYY'
    expect(dateTime().year(20123).format('YYYYYY')).toBe('+020123'); // 'big year with YYYYYY'

    expect(dateTime().year(-1).format('YYYYYY')).toBe('-000001'); // 'small negative year with YYYYYY'
    expect(dateTime().year(-2012).format('YYYYYY')).toBe('-002012'); // 'negative year with YYYYYY'
    expect(dateTime().year(-20123).format('YYYYYY')).toBe('-020123'); // 'big negative year with YYYYYY'
});

test('toISOString() when 0 year', () => {
    const date = dateTime({input: '0000-01-01T21:00:00.000Z'});
    expect(date.toISOString()).toBe('0000-01-01T21:00:00.000Z');
    expect(date.toDate().toISOString()).toBe('0000-01-01T21:00:00.000Z');
});

test.each<[string, string]>([
    ['2005-01-02', '2004-53'],
    ['2005-12-31', '2005-52'],
    ['2007-01-01', '2007-01'],
    ['2007-12-30', '2007-52'],
    ['2007-12-31', '2008-01'],
    ['2008-01-01', '2008-01'],
    ['2008-12-28', '2008-52'],
    ['2008-12-29', '2009-01'],
    ['2008-12-30', '2009-01'],
    ['2008-12-31', '2009-01'],
    ['2009-01-01', '2009-01'],
    ['2009-12-31', '2009-53'],
    ['2010-01-01', '2009-53'],
    ['2010-01-02', '2009-53'],
    ['2010-01-03', '2009-53'],
    ['0404-12-31', '0404-53'],
    ['0405-12-31', '0405-52'],
])('iso week formats, (%j)', (input, expected) => {
    // https://en.wikipedia.org/wiki/ISO_week_date
    const isoWeek = expected.split('-')[1];
    const date = dateTime({input, format: 'YYYY-MM-DD'});
    expect(date.format('WW')).toBe(isoWeek);
    expect(date.format('W')).toBe(isoWeek.replace(/^0+/, ''));
});

test.each<[string, string]>([
    ['2005-01-02', '2004-53'],
    ['2005-12-31', '2005-52'],
    ['2007-01-01', '2007-01'],
    ['2007-12-30', '2007-52'],
    ['2007-12-31', '2008-01'],
    ['2008-01-01', '2008-01'],
    ['2008-12-28', '2008-52'],
    ['2008-12-29', '2009-01'],
    ['2008-12-30', '2009-01'],
    ['2008-12-31', '2009-01'],
    ['2009-01-01', '2009-01'],
    ['2009-12-31', '2009-53'],
    ['2010-01-01', '2009-53'],
    ['2010-01-02', '2009-53'],
    ['2010-01-03', '2009-53'],
    ['0404-12-31', '0404-53'],
    ['0405-12-31', '0405-52'],
])('iso week year formats, (%j)', (input, expected) => {
    // https://en.wikipedia.org/wiki/ISO_week_date
    const isoWeekYear = expected.split('-')[0];
    const date = dateTime({input, format: 'YYYY-MM-DD'});
    expect(date.format('GGGGG')).toBe('0' + isoWeekYear);
    expect(date.format('GGGG')).toBe(isoWeekYear);
    expect(date.format('GG')).toBe(isoWeekYear.slice(2, 4));
});

test.each<[string, string]>([
    ['2005-01-02', '2004-53'],
    ['2005-12-31', '2005-52'],
    ['2007-01-01', '2007-01'],
    ['2007-12-30', '2007-52'],
    ['2007-12-31', '2008-01'],
    ['2008-01-01', '2008-01'],
    ['2008-12-28', '2008-52'],
    ['2008-12-29', '2009-01'],
    ['2008-12-30', '2009-01'],
    ['2008-12-31', '2009-01'],
    ['2009-01-01', '2009-01'],
    ['2009-12-31', '2009-53'],
    ['2010-01-01', '2009-53'],
    ['2010-01-02', '2009-53'],
    ['2010-01-03', '2009-53'],
    ['0404-12-31', '0404-53'],
    ['0405-12-31', '0405-52'],
])('week year formats, (%j)', (input, expected) => {
    settings.setDefaultWeekSettings({firstDay: 1, minimalDays: 4, weekend: [6, 7]});
    const weekYear = expected.split('-')[0];
    const date = dateTime({input, format: 'YYYY-MM-DD'});
    expect(date.format('ggggg')).toBe('0' + weekYear);
    expect(date.format('gggg')).toBe(weekYear);
    expect(date.format('gg')).toBe(weekYear.slice(2, 4));
});

test('iso weekday formats', () => {
    expect(dateTime({input: [1985, 1, 4]}).format('E')).toBe('1'); // 'Feb  4 1985 is Monday    -- 1st day'
    expect(dateTime({input: [2029, 8, 18]}).format('E')).toBe('2'); // 'Sep 18 2029 is Tuesday   -- 2nd day'
    expect(dateTime({input: [2013, 3, 24]}).format('E')).toBe('3'); // 'Apr 24 2013 is Wednesday -- 3rd day'
    expect(dateTime({input: [2015, 2, 5]}).format('E')).toBe('4'); // 'Mar  5 2015 is Thursday  -- 4th day'
    expect(dateTime({input: [1970, 0, 2]}).format('E')).toBe('5'); // 'Jan  2 1970 is Friday    -- 5th day'
    expect(dateTime({input: [2001, 4, 12]}).format('E')).toBe('6'); // 'May 12 2001 is Saturday  -- 6th day'
    expect(dateTime({input: [2000, 0, 2]}).format('E')).toBe('7'); // 'Jan  2 2000 is Sunday    -- 7th day'
});

test('weekday formats', () => {
    settings.setDefaultWeekSettings({firstDay: 3, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [1985, 1, 6]}).format('e')).toBe('0'); // 'Feb  6 1985 is Wednesday -- 0th day'
    expect(dateTime({input: [2029, 8, 20]}).format('e')).toBe('1'); // 'Sep 20 2029 is Thursday  -- 1st day'
    expect(dateTime({input: [2013, 3, 26]}).format('e')).toBe('2'); // 'Apr 26 2013 is Friday    -- 2nd day'
    expect(dateTime({input: [2015, 2, 7]}).format('e')).toBe('3'); // 'Mar  7 2015 is Saturday  -- 3nd day'
    expect(dateTime({input: [1970, 0, 4]}).format('e')).toBe('4'); // 'Jan  4 1970 is Sunday    -- 4th day'
    expect(dateTime({input: [2001, 4, 14]}).format('e')).toBe('5'); // 'May 14 2001 is Monday    -- 5th day'
    expect(dateTime({input: [2000, 0, 4]}).format('e')).toBe('6'); // 'Jan  4 2000 is Tuesday   -- 6th day'
});

test('invalid', () => {
    const invalid = dateTime({input: NaN});
    expect(invalid.format()).toBe('Invalid Date');
    expect(invalid.format('YYYY-MM-DD')).toBe('Invalid Date');
});

test('quarter formats', () => {
    expect(dateTime({input: [1985, 1, 4]}).format('Q')).toBe('1'); //'Feb  4 1985 is Q1'
    expect(dateTime({input: [2029, 8, 18]}).format('Q')).toBe('3'); //'Sep 18 2029 is Q3'
    expect(dateTime({input: [2013, 3, 24]}).format('Q')).toBe('2'); //'Apr 24 2013 is Q2'
    expect(dateTime({input: [2015, 2, 5]}).format('Q')).toBe('1'); //'Mar  5 2015 is Q1'
    expect(dateTime({input: [1970, 0, 2]}).format('Q')).toBe('1'); //'Jan  2 1970 is Q1'
    expect(dateTime({input: [2001, 11, 12]}).format('Q')).toBe('4'); // 'Dec 12 2001 is Q4'
    expect(dateTime({input: [2000, 0, 2]}).format('[Q]Q-YYYY')).toBe('Q1-2000'); // 'Jan  2 2000 is Q1'
});

test('quarter ordinal formats', () => {
    expect(dateTime({input: [1985, 1, 4]}).format('Qo')).toBe('1st'); // 'Feb 4 1985 is 1st quarter'
    expect(dateTime({input: [2029, 8, 18]}).format('Qo')).toBe('3rd'); // 'Sep 18 2029 is 3rd quarter'
    expect(dateTime({input: [2013, 3, 24]}).format('Qo')).toBe('2nd'); // 'Apr 24 2013 is 2nd quarter'
    expect(dateTime({input: [2015, 2, 5]}).format('Qo')).toBe('1st'); // 'Mar  5 2015 is 1st quarter'
    expect(dateTime({input: [1970, 0, 2]}).format('Qo')).toBe('1st'); // 'Jan  2 1970 is 1st quarter'
    expect(dateTime({input: [2001, 11, 12]}).format('Qo')).toBe('4th'); // 'Dec 12 2001 is 4th quarter'
    expect(dateTime({input: [2000, 0, 2]}).format('Qo [quarter] YYYY')).toBe('1st quarter 2000'); // 'Jan  2 2000 is 1st quarter'
});

test('milliseconds', () => {
    const m = dateTime({input: '123', format: 'SSS'});

    expect(m.format('S')).toBe('1');
    expect(m.format('SS')).toBe('12');
    expect(m.format('SSS')).toBe('123');
    expect(m.format('SSSS')).toBe('1230');
    expect(m.format('SSSSS')).toBe('12300');
    expect(m.format('SSSSSS')).toBe('123000');
    expect(m.format('SSSSSSS')).toBe('1230000');
    expect(m.format('SSSSSSSS')).toBe('12300000');
    expect(m.format('SSSSSSSSS')).toBe('123000000');
});

test('hmm and hmmss', () => {
    expect(dateTime({input: '12:34:56', format: 'HH:mm:ss'}).format('hmm')).toBe('1234');
    expect(dateTime({input: '01:34:56', format: 'HH:mm:ss'}).format('hmm')).toBe('134');
    expect(dateTime({input: '13:34:56', format: 'HH:mm:ss'}).format('hmm')).toBe('134');

    expect(dateTime({input: '12:34:56', format: 'HH:mm:ss'}).format('hmmss')).toBe('123456');
    expect(dateTime({input: '01:34:56', format: 'HH:mm:ss'}).format('hmmss')).toBe('13456');
    expect(dateTime({input: '13:34:56', format: 'HH:mm:ss'}).format('hmmss')).toBe('13456');
});

test('Hmm and Hmmss', () => {
    expect(dateTime({input: '12:34:56', format: 'HH:mm:ss'}).format('Hmm')).toBe('1234');
    expect(dateTime({input: '01:34:56', format: 'HH:mm:ss'}).format('Hmm')).toBe('134');
    expect(dateTime({input: '13:34:56', format: 'HH:mm:ss'}).format('Hmm')).toBe('1334');

    expect(dateTime({input: '12:34:56', format: 'HH:mm:ss'}).format('Hmmss')).toBe('123456');
    expect(dateTime({input: '01:34:56', format: 'HH:mm:ss'}).format('Hmmss')).toBe('13456');
    expect(dateTime({input: '08:34:56', format: 'HH:mm:ss'}).format('Hmmss')).toBe('83456');
    expect(dateTime({input: '18:34:56', format: 'HH:mm:ss'}).format('Hmmss')).toBe('183456');
});

test('k and kk', () => {
    expect(dateTime({input: '01:23:45', format: 'HH:mm:ss'}).format('k')).toBe('1');
    expect(dateTime({input: '12:34:56', format: 'HH:mm:ss'}).format('k')).toBe('12');
    expect(dateTime({input: '01:23:45', format: 'HH:mm:ss'}).format('kk')).toBe('01');
    expect(dateTime({input: '12:34:56', format: 'HH:mm:ss'}).format('kk')).toBe('12');
    expect(dateTime({input: '00:34:56', format: 'HH:mm:ss'}).format('kk')).toBe('24');
    expect(dateTime({input: '00:00:00', format: 'HH:mm:ss'}).format('kk')).toBe('24');
});

test('Y token', () => {
    expect(dateTime({input: '2010-01-01', format: 'YYYY-MM-DD'}).format('Y')).toBe('2010'); // 'format 2010 with Y'
    expect(dateTime({input: [-123]}).format('Y')).toBe('-0123'); // 'format -123 with Y'
    expect(dateTime({input: [12345]}).format('Y')).toBe('+12345'); // 'format 12345 with Y'
    expect(dateTime({input: [0]}).format('Y')).toBe('0000'); // 'format 0 with Y'
    expect(dateTime({input: [1]}).format('Y')).toBe('0001'); // 'format 1 with Y'
    expect(dateTime({input: [9999]}).format('Y')).toBe('9999'); // 'format 9999 with Y'
    expect(dateTime({input: [10000]}).format('Y')).toBe('+10000'); // 'format 10000 with Y'
});

test('expand format', () => {
    expect(expandFormat('[L]', englishFormats)).toBe('[L]');
    expect(expandFormat('L', englishFormats)).toBe(englishFormats.L);
    expect(expandFormat('LL', englishFormats)).toBe(englishFormats.LL);
    expect(expandFormat('LLL', englishFormats)).toBe(englishFormats.LLL);
    expect(expandFormat('LLLL', englishFormats)).toBe(englishFormats.LLLL);
    expect(expandFormat('LT', englishFormats)).toBe(englishFormats.LT);
    expect(expandFormat('LTS', englishFormats)).toBe(englishFormats.LTS);
    expect(expandFormat('[L]L', englishFormats)).toBe(`[L]${englishFormats.L}`);
    expect(expandFormat('[L]T', englishFormats)).toBe(`[L]T`);
    expect(expandFormat('l', englishFormats)).toBe('M/D/YYYY');
    expect(expandFormat('ll', englishFormats)).toBe('MMM D, YYYY');
    expect(expandFormat('lll', englishFormats)).toBe('MMM D, YYYY h:mm a');
    expect(expandFormat('llll', englishFormats)).toBe('ddd, MMM D, YYYY h:mm a');
    expect(expandFormat('l', {...englishFormats, l: 'short format'})).toBe('short format');
    expect(expandFormat('ll', {...englishFormats, ll: 'short format'})).toBe('short format');
    expect(expandFormat('lll', {...englishFormats, lll: 'short format'})).toBe('short format');
    expect(expandFormat('llll', {...englishFormats, llll: 'short format'})).toBe('short format');
    expect(expandFormat('llll', {...englishFormats, l: 'L', ll: 'l', lll: 'll', llll: 'lll'})).toBe(
        englishFormats.L,
    );
    expect(expandFormat('l', {...englishFormats, l: 'l'})).toBe('l');
});
