import {settings} from '../../settings';
import {dateTime} from '../dateTime';

afterEach(() => {
    settings.setDefaultWeekSettings(null);
});

test('iso weekday', () => {
    for (let i = 0; i < 7; ++i) {
        settings.setDefaultWeekSettings({firstDay: i + 1, minimalDays: 1 + i, weekend: [6, 7]});
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

test('weekday first day of week Sunday', () => {
    settings.setDefaultWeekSettings({firstDay: 7, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [1985, 1, 3]}).weekday()).toBe(0); // 'Feb  3 1985 is Sunday    -- 0th day'
    expect(dateTime({input: [2029, 8, 17]}).weekday()).toBe(1); // 'Sep 17 2029 is Monday    -- 1st day'
    expect(dateTime({input: [2013, 3, 23]}).weekday()).toBe(2); // 'Apr 23 2013 is Tuesday   -- 2nd day'
    expect(dateTime({input: [2015, 2, 4]}).weekday()).toBe(3); // 'Mar  4 2015 is Wednesday -- 3nd day'
    expect(dateTime({input: [1970, 0, 1]}).weekday()).toBe(4); // 'Jan  1 1970 is Thursday  -- 4th day'
    expect(dateTime({input: [2001, 4, 11]}).weekday()).toBe(5); // 'May 11 2001 is Friday    -- 5th day'
    expect(dateTime({input: [2000, 0, 1]}).weekday()).toBe(6); // 'Jan  1 2000 is Saturday  -- 6th day'
});

test('weekday first day of week Monday', () => {
    settings.setDefaultWeekSettings({firstDay: 1, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [1985, 1, 4]}).weekday()).toBe(0); // 'Feb  4 1985 is Monday    -- 0th day'
    expect(dateTime({input: [2029, 8, 18]}).weekday()).toBe(1); // 'Sep 18 2029 is Tuesday   -- 1st day'
    expect(dateTime({input: [2013, 3, 24]}).weekday()).toBe(2); // 'Apr 24 2013 is Wednesday -- 2nd day'
    expect(dateTime({input: [2015, 2, 5]}).weekday()).toBe(3); // 'Mar  5 2015 is Thursday  -- 3nd day'
    expect(dateTime({input: [1970, 0, 2]}).weekday()).toBe(4); // 'Jan  2 1970 is Friday    -- 4th day'
    expect(dateTime({input: [2001, 4, 12]}).weekday()).toBe(5); // 'May 12 2001 is Saturday  -- 5th day'
    expect(dateTime({input: [2000, 0, 2]}).weekday()).toBe(6); // 'Jan  2 2000 is Sunday    -- 6th day'
});

test('weekday first day of week Tuesday', () => {
    settings.setDefaultWeekSettings({firstDay: 2, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [1985, 1, 5]}).weekday()).toBe(0); // 'Feb  5 1985 is Tuesday   -- 0th day'
    expect(dateTime({input: [2029, 8, 19]}).weekday()).toBe(1); // 'Sep 19 2029 is Wednesday -- 1st day'
    expect(dateTime({input: [2013, 3, 25]}).weekday()).toBe(2); // 'Apr 25 2013 is Thursday  -- 2nd day'
    expect(dateTime({input: [2015, 2, 6]}).weekday()).toBe(3); // 'Mar  6 2015 is Friday    -- 3nd day'
    expect(dateTime({input: [1970, 0, 3]}).weekday()).toBe(4); // 'Jan  3 1970 is Saturday  -- 4th day'
    expect(dateTime({input: [2001, 4, 13]}).weekday()).toBe(5); // 'May 13 2001 is Sunday    -- 5th day'
    expect(dateTime({input: [2000, 0, 3]}).weekday()).toBe(6); // 'Jan  3 2000 is Monday    -- 6th day'
});

test('weekday first day of week Wednesday', () => {
    settings.setDefaultWeekSettings({firstDay: 3, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [1985, 1, 6]}).weekday()).toBe(0); // 'Feb  6 1985 is Wednesday -- 0th day'
    expect(dateTime({input: [2029, 8, 20]}).weekday()).toBe(1); // 'Sep 20 2029 is Thursday  -- 1st day'
    expect(dateTime({input: [2013, 3, 26]}).weekday()).toBe(2); // 'Apr 26 2013 is Friday    -- 2nd day'
    expect(dateTime({input: [2015, 2, 7]}).weekday()).toBe(3); // 'Mar  7 2015 is Saturday  -- 3nd day'
    expect(dateTime({input: [1970, 0, 4]}).weekday()).toBe(4); // 'Jan  4 1970 is Sunday    -- 4th day'
    expect(dateTime({input: [2001, 4, 14]}).weekday()).toBe(5); // 'May 14 2001 is Monday    -- 5th day'
    expect(dateTime({input: [2000, 0, 4]}).weekday()).toBe(6); // 'Jan  4 2000 is Tuesday   -- 6th day'
});

test('weekday first day of week Thursday', () => {
    settings.setDefaultWeekSettings({firstDay: 4, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [1985, 1, 7]}).weekday()).toBe(0); // 'Feb  7 1985 is Thursday  -- 0th day'
    expect(dateTime({input: [2029, 8, 21]}).weekday()).toBe(1); // 'Sep 21 2029 is Friday    -- 1st day'
    expect(dateTime({input: [2013, 3, 27]}).weekday()).toBe(2); // 'Apr 27 2013 is Saturday  -- 2nd day'
    expect(dateTime({input: [2015, 2, 8]}).weekday()).toBe(3); // 'Mar  8 2015 is Sunday    -- 3nd day'
    expect(dateTime({input: [1970, 0, 5]}).weekday()).toBe(4); // 'Jan  5 1970 is Monday    -- 4th day'
    expect(dateTime({input: [2001, 4, 15]}).weekday()).toBe(5); // 'May 15 2001 is Tuesday   -- 5th day'
    expect(dateTime({input: [2000, 0, 5]}).weekday()).toBe(6); // 'Jan  5 2000 is Wednesday -- 6th day'
});

test('weekday first day of week Friday', () => {
    settings.setDefaultWeekSettings({firstDay: 5, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [1985, 1, 8]}).weekday()).toBe(0); // 'Feb  8 1985 is Friday    -- 0th day'
    expect(dateTime({input: [2029, 8, 22]}).weekday()).toBe(1); // 'Sep 22 2029 is Saturday  -- 1st day'
    expect(dateTime({input: [2013, 3, 28]}).weekday()).toBe(2); // 'Apr 28 2013 is Sunday    -- 2nd day'
    expect(dateTime({input: [2015, 2, 9]}).weekday()).toBe(3); // 'Mar  9 2015 is Monday    -- 3nd day'
    expect(dateTime({input: [1970, 0, 6]}).weekday()).toBe(4); // 'Jan  6 1970 is Tuesday   -- 4th day'
    expect(dateTime({input: [2001, 4, 16]}).weekday()).toBe(5); // 'May 16 2001 is Wednesday -- 5th day'
    expect(dateTime({input: [2000, 0, 6]}).weekday()).toBe(6); // 'Jan  6 2000 is Thursday  -- 6th day'
});

test('weekday first day of week Saturday', () => {
    settings.setDefaultWeekSettings({firstDay: 6, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [1985, 1, 9]}).weekday()).toBe(0); // 'Feb  9 1985 is Saturday  -- 0th day'
    expect(dateTime({input: [2029, 8, 23]}).weekday()).toBe(1); // 'Sep 23 2029 is Sunday    -- 1st day'
    expect(dateTime({input: [2013, 3, 29]}).weekday()).toBe(2); // 'Apr 29 2013 is Monday    -- 2nd day'
    expect(dateTime({input: [2015, 2, 10]}).weekday()).toBe(3); // 'Mar 10 2015 is Tuesday   -- 3nd day'
    expect(dateTime({input: [1970, 0, 7]}).weekday()).toBe(4); // 'Jan  7 1970 is Wednesday -- 4th day'
    expect(dateTime({input: [2001, 4, 17]}).weekday()).toBe(5); // 'May 17 2001 is Thursday  -- 5th day'
    expect(dateTime({input: [2000, 0, 7]}).weekday()).toBe(6); // 'Jan  7 2000 is Friday    -- 6th day'
});
