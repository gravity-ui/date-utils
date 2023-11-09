import {settings} from '../../settings';
import {dateTime} from '../dateTime';

afterEach(() => {
    settings.updateLocale({weekStart: 1, yearStart: 1});
});

test('iso weekday', () => {
    let i;

    for (i = 0; i < 7; ++i) {
        // moment.locale('dow:' + i + ',doy: 6', {week: {dow: i, doy: 6}});
        settings.updateLocale({weekStart: i, yearStart: 1 + i});
        expect(dateTime({input: [1985, 1, 4]}).isoWeekday()).toBe(1); //   'Feb  4 1985 is Monday    -- 1st day'
        expect(dateTime({input: [2029, 8, 18]}).isoWeekday()).toBe(2); //  'Sep 18 2029 is Tuesday   -- 2nd day'
        expect(dateTime({input: [2013, 3, 24]}).isoWeekday()).toBe(3); //  'Apr 24 2013 is Wednesday -- 3rd day'
        expect(dateTime({input: [2015, 2, 5]}).isoWeekday()).toBe(4); //   'Mar  5 2015 is Thursday  -- 4th day'
        expect(dateTime({input: [1970, 0, 2]}).isoWeekday()).toBe(5); //   'Jan  2 1970 is Friday    -- 5th day'
        expect(dateTime({input: [2001, 4, 12]}).isoWeekday()).toBe(6); //  'May 12 2001 is Saturday  -- 6th day'
        expect(dateTime({input: [2000, 0, 2]}).isoWeekday()).toBe(7); //   'Jan  2 2000 is Sunday    -- 7th day'
    }
});

test('iso weekday setter', () => {
    let a = dateTime({input: [2011, 0, 10]});
    expect(a.isoWeekday(1).date()).toBe(10); // 'set from mon to mon'
    expect(a.isoWeekday(4).date()).toBe(13); // 'set from mon to thu'
    expect(a.isoWeekday(7).date()).toBe(16); // 'set from mon to sun'
    expect(a.isoWeekday(-6).date()).toBe(3); // 'set from mon to last mon'
    expect(a.isoWeekday(-3).date()).toBe(6); // 'set from mon to last thu'
    expect(a.isoWeekday(0).date()).toBe(9); // 'set from mon to last sun'
    expect(a.isoWeekday(8).date()).toBe(17); // 'set from mon to next mon'
    expect(a.isoWeekday(11).date()).toBe(20); // 'set from mon to next thu'
    expect(a.isoWeekday(14).date()).toBe(23); // 'set from mon to next sun'

    a = dateTime({input: [2011, 0, 13]});
    expect(a.isoWeekday(1).date()).toBe(10); // 'set from thu to mon'
    expect(a.isoWeekday(4).date()).toBe(13); // 'set from thu to thu'
    expect(a.isoWeekday(7).date()).toBe(16); // 'set from thu to sun'
    expect(a.isoWeekday(-6).date()).toBe(3); // 'set from thu to last mon'
    expect(a.isoWeekday(-3).date()).toBe(6); // 'set from thu to last thu'
    expect(a.isoWeekday(0).date()).toBe(9); // 'set from thu to last sun'
    expect(a.isoWeekday(8).date()).toBe(17); // 'set from thu to next mon'
    expect(a.isoWeekday(11).date()).toBe(20); // 'set from thu to next thu'
    expect(a.isoWeekday(14).date()).toBe(23); // 'set from thu to next sun'

    a = dateTime({input: [2011, 0, 16]});
    expect(a.isoWeekday(1).date()).toBe(10); // 'set from sun to mon'
    expect(a.isoWeekday(4).date()).toBe(13); // 'set from sun to thu'
    expect(a.isoWeekday(7).date()).toBe(16); // 'set from sun to sun'
    expect(a.isoWeekday(-6).date()).toBe(3); // 'set from sun to last mon'
    expect(a.isoWeekday(-3).date()).toBe(6); // 'set from sun to last thu'
    expect(a.isoWeekday(0).date()).toBe(9); // 'set from sun to last sun'
    expect(a.isoWeekday(8).date()).toBe(17); // 'set from sun to next mon'
    expect(a.isoWeekday(11).date()).toBe(20); // 'set from sun to next thu'
    expect(a.isoWeekday(14).date()).toBe(23); // 'set from sun to next sun'
});
