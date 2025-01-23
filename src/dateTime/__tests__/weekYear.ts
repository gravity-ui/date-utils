import {settings} from '../../settings';
import {dateTime} from '../dateTime';

afterEach(() => {
    settings.setDefaultWeekSettings(null);
});

test('iso week year', () => {
    // Some examples taken from https://en.wikipedia.org/wiki/ISO_week
    expect(dateTime({input: [2005, 0, 1]}).isoWeekYear()).toBe(2004);
    expect(dateTime({input: [2005, 0, 2]}).isoWeekYear()).toBe(2004);
    expect(dateTime({input: [2005, 0, 3]}).isoWeekYear()).toBe(2005);
    expect(dateTime({input: [2005, 11, 31]}).isoWeekYear()).toBe(2005);
    expect(dateTime({input: [2006, 0, 1]}).isoWeekYear()).toBe(2005);
    expect(dateTime({input: [2006, 0, 2]}).isoWeekYear()).toBe(2006);
    expect(dateTime({input: [2007, 0, 1]}).isoWeekYear()).toBe(2007);
    expect(dateTime({input: [2007, 11, 30]}).isoWeekYear()).toBe(2007);
    expect(dateTime({input: [2007, 11, 31]}).isoWeekYear()).toBe(2008);
    expect(dateTime({input: [2008, 0, 1]}).isoWeekYear()).toBe(2008);
    expect(dateTime({input: [2008, 11, 28]}).isoWeekYear()).toBe(2008);
    expect(dateTime({input: [2008, 11, 29]}).isoWeekYear()).toBe(2009);
    expect(dateTime({input: [2008, 11, 30]}).isoWeekYear()).toBe(2009);
    expect(dateTime({input: [2008, 11, 31]}).isoWeekYear()).toBe(2009);
    expect(dateTime({input: [2009, 0, 1]}).isoWeekYear()).toBe(2009);
    expect(dateTime({input: [2010, 0, 1]}).isoWeekYear()).toBe(2009);
    expect(dateTime({input: [2010, 0, 2]}).isoWeekYear()).toBe(2009);
    expect(dateTime({input: [2010, 0, 3]}).isoWeekYear()).toBe(2009);
    expect(dateTime({input: [2010, 0, 4]}).isoWeekYear()).toBe(2010);
});

test('week year', () => {
    // Some examples taken from https://en.wikipedia.org/wiki/ISO_week
    settings.setDefaultWeekSettings({firstDay: 1, minimalDays: 4, weekend: [6, 7]}); // like iso
    expect(dateTime({input: [2005, 0, 1]}).weekYear()).toBe(2004);
    expect(dateTime({input: [2005, 0, 2]}).weekYear()).toBe(2004);
    expect(dateTime({input: [2005, 0, 3]}).weekYear()).toBe(2005);
    expect(dateTime({input: [2005, 11, 31]}).weekYear()).toBe(2005);
    expect(dateTime({input: [2006, 0, 1]}).weekYear()).toBe(2005);
    expect(dateTime({input: [2006, 0, 2]}).weekYear()).toBe(2006);
    expect(dateTime({input: [2007, 0, 1]}).weekYear()).toBe(2007);
    expect(dateTime({input: [2007, 11, 30]}).weekYear()).toBe(2007);
    expect(dateTime({input: [2007, 11, 31]}).weekYear()).toBe(2008);
    expect(dateTime({input: [2008, 0, 1]}).weekYear()).toBe(2008);
    expect(dateTime({input: [2008, 11, 28]}).weekYear()).toBe(2008);
    expect(dateTime({input: [2008, 11, 29]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2008, 11, 30]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2008, 11, 31]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2009, 0, 1]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2010, 0, 1]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2010, 0, 2]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2010, 0, 3]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2010, 0, 4]}).weekYear()).toBe(2010);

    settings.setDefaultWeekSettings({firstDay: 1, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [2004, 11, 26]}).weekYear()).toBe(2004);
    expect(dateTime({input: [2004, 11, 27]}).weekYear()).toBe(2005);
    expect(dateTime({input: [2005, 11, 25]}).weekYear()).toBe(2005);
    expect(dateTime({input: [2005, 11, 26]}).weekYear()).toBe(2006);
    expect(dateTime({input: [2006, 11, 31]}).weekYear()).toBe(2006);
    expect(dateTime({input: [2007, 0, 1]}).weekYear()).toBe(2007);
    expect(dateTime({input: [2007, 11, 30]}).weekYear()).toBe(2007);
    expect(dateTime({input: [2007, 11, 31]}).weekYear()).toBe(2008);
    expect(dateTime({input: [2008, 11, 28]}).weekYear()).toBe(2008);
    expect(dateTime({input: [2008, 11, 29]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2009, 11, 27]}).weekYear()).toBe(2009);
    expect(dateTime({input: [2009, 11, 28]}).weekYear()).toBe(2010);
});

test('week numbers 2012/2013', () => {
    settings.setDefaultWeekSettings({firstDay: 6, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: '2012-12-28', format: 'YYYY-MM-DD'}).week()).toBe(52);
    expect(dateTime({input: '2012-12-29', format: 'YYYY-MM-DD'}).week()).toBe(1);
    expect(dateTime({input: '2013-01-01', format: 'YYYY-MM-DD'}).week()).toBe(1);
    expect(dateTime({input: '2013-01-08', format: 'YYYY-MM-DD'}).week()).toBe(2);
    expect(dateTime({input: '2013-01-11', format: 'YYYY-MM-DD'}).week()).toBe(2);
    expect(dateTime({input: '2013-01-12', format: 'YYYY-MM-DD'}).week()).toBe(3);
    expect(dateTime({input: '2012-01-01', format: 'YYYY-MM-DD'}).weeksInYear()).toBe(52);
});

test('weeks numbers dow:1 doy:4', () => {
    settings.setDefaultWeekSettings({firstDay: 1, minimalDays: 4, weekend: [6, 7]});
    expect(dateTime({input: [2012, 0, 1]}).week()).toBe(52); // 'Jan  1 2012 should be week 52'
    expect(dateTime({input: [2012, 0, 2]}).week()).toBe(1); // 'Jan  2 2012 should be week 1'
    expect(dateTime({input: [2012, 0, 8]}).week()).toBe(1); // 'Jan  8 2012 should be week 1'
    expect(dateTime({input: [2012, 0, 9]}).week()).toBe(2); // 'Jan  9 2012 should be week 2'
    expect(dateTime({input: [2012, 0, 15]}).week()).toBe(2); // 'Jan 15 2012 should be week 2'
    expect(dateTime({input: [2007, 0, 1]}).week()).toBe(1); // 'Jan  1 2007 should be week 1'
    expect(dateTime({input: [2007, 0, 7]}).week()).toBe(1); // 'Jan  7 2007 should be week 1'
    expect(dateTime({input: [2007, 0, 8]}).week()).toBe(2); // 'Jan  8 2007 should be week 2'
    expect(dateTime({input: [2007, 0, 14]}).week()).toBe(2); // 'Jan 14 2007 should be week 2'
    expect(dateTime({input: [2007, 0, 15]}).week()).toBe(3); // 'Jan 15 2007 should be week 3'
    expect(dateTime({input: [2007, 11, 31]}).week()).toBe(1); // 'Dec 31 2007 should be week 1'
    expect(dateTime({input: [2008, 0, 1]}).week()).toBe(1); // 'Jan  1 2008 should be week 1'
    expect(dateTime({input: [2008, 0, 6]}).week()).toBe(1); // 'Jan  6 2008 should be week 1'
    expect(dateTime({input: [2008, 0, 7]}).week()).toBe(2); // 'Jan  7 2008 should be week 2'
    expect(dateTime({input: [2008, 0, 13]}).week()).toBe(2); // 'Jan 13 2008 should be week 2'
    expect(dateTime({input: [2008, 0, 14]}).week()).toBe(3); // 'Jan 14 2008 should be week 3'
    expect(dateTime({input: [2002, 11, 30]}).week()).toBe(1); // 'Dec 30 2002 should be week 1'
    expect(dateTime({input: [2003, 0, 1]}).week()).toBe(1); // 'Jan  1 2003 should be week 1'
    expect(dateTime({input: [2003, 0, 5]}).week()).toBe(1); // 'Jan  5 2003 should be week 1'
    expect(dateTime({input: [2003, 0, 6]}).week()).toBe(2); // 'Jan  6 2003 should be week 2'
    expect(dateTime({input: [2003, 0, 12]}).week()).toBe(2); // 'Jan 12 2003 should be week 2'
    expect(dateTime({input: [2003, 0, 13]}).week()).toBe(3); // 'Jan 13 2003 should be week 3'
    expect(dateTime({input: [2008, 11, 29]}).week()).toBe(1); // 'Dec 29 2008 should be week 1'
    expect(dateTime({input: [2009, 0, 1]}).week()).toBe(1); // 'Jan  1 2009 should be week 1'
    expect(dateTime({input: [2009, 0, 4]}).week()).toBe(1); // 'Jan  4 2009 should be week 1'
    expect(dateTime({input: [2009, 0, 5]}).week()).toBe(2); // 'Jan  5 2009 should be week 2'
    expect(dateTime({input: [2009, 0, 11]}).week()).toBe(2); // 'Jan 11 2009 should be week 2'
    expect(dateTime({input: [2009, 0, 13]}).week()).toBe(3); // 'Jan 12 2009 should be week 3'
    expect(dateTime({input: [2009, 11, 28]}).week()).toBe(53); // 'Dec 28 2009 should be week 53'
    expect(dateTime({input: [2010, 0, 1]}).week()).toBe(53); // 'Jan  1 2010 should be week 53'
    expect(dateTime({input: [2010, 0, 3]}).week()).toBe(53); // 'Jan  3 2010 should be week 53'
    expect(dateTime({input: [2010, 0, 4]}).week()).toBe(1); // 'Jan  4 2010 should be week 1'
    expect(dateTime({input: [2010, 0, 10]}).week()).toBe(1); // 'Jan 10 2010 should be week 1'
    expect(dateTime({input: [2010, 0, 11]}).week()).toBe(2); // 'Jan 11 2010 should be week 2'
    expect(dateTime({input: [2010, 11, 27]}).week()).toBe(52); // 'Dec 27 2010 should be week 52'
    expect(dateTime({input: [2011, 0, 1]}).week()).toBe(52); // 'Jan  1 2011 should be week 52'
    expect(dateTime({input: [2011, 0, 2]}).week()).toBe(52); // 'Jan  2 2011 should be week 52'
    expect(dateTime({input: [2011, 0, 3]}).week()).toBe(1); // 'Jan  3 2011 should be week 1'
    expect(dateTime({input: [2011, 0, 9]}).week()).toBe(1); // 'Jan  9 2011 should be week 1'
    expect(dateTime({input: [2011, 0, 10]}).week()).toBe(2); // 'Jan 10 2011 should be week 2'
});

test('weeks numbers dow:6 doy:12', () => {
    settings.setDefaultWeekSettings({firstDay: 6, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [2011, 11, 31]}).week()).toBe(1); // 'Dec 31 2011 should be week 1'
    expect(dateTime({input: [2012, 0, 6]}).week()).toBe(1); // 'Jan  6 2012 should be week 1'
    expect(dateTime({input: [2012, 0, 7]}).week()).toBe(2); // 'Jan  7 2012 should be week 2'
    expect(dateTime({input: [2012, 0, 13]}).week()).toBe(2); // 'Jan 13 2012 should be week 2'
    expect(dateTime({input: [2012, 0, 14]}).week()).toBe(3); // 'Jan 14 2012 should be week 3'
    expect(dateTime({input: [2006, 11, 30]}).week()).toBe(1); // 'Dec 30 2006 should be week 1'
    expect(dateTime({input: [2007, 0, 5]}).week()).toBe(1); // 'Jan  5 2007 should be week 1'
    expect(dateTime({input: [2007, 0, 6]}).week()).toBe(2); // 'Jan  6 2007 should be week 2'
    expect(dateTime({input: [2007, 0, 12]}).week()).toBe(2); // 'Jan 12 2007 should be week 2'
    expect(dateTime({input: [2007, 0, 13]}).week()).toBe(3); // 'Jan 13 2007 should be week 3'
    expect(dateTime({input: [2007, 11, 29]}).week()).toBe(1); // 'Dec 29 2007 should be week 1'
    expect(dateTime({input: [2008, 0, 1]}).week()).toBe(1); // 'Jan  1 2008 should be week 1'
    expect(dateTime({input: [2008, 0, 4]}).week()).toBe(1); // 'Jan  4 2008 should be week 1'
    expect(dateTime({input: [2008, 0, 5]}).week()).toBe(2); // 'Jan  5 2008 should be week 2'
    expect(dateTime({input: [2008, 0, 11]}).week()).toBe(2); // 'Jan 11 2008 should be week 2'
    expect(dateTime({input: [2008, 0, 12]}).week()).toBe(3); // 'Jan 12 2008 should be week 3'
    expect(dateTime({input: [2002, 11, 28]}).week()).toBe(1); // 'Dec 28 2002 should be week 1'
    expect(dateTime({input: [2003, 0, 1]}).week()).toBe(1); // 'Jan  1 2003 should be week 1'
    expect(dateTime({input: [2003, 0, 3]}).week()).toBe(1); // 'Jan  3 2003 should be week 1'
    expect(dateTime({input: [2003, 0, 4]}).week()).toBe(2); // 'Jan  4 2003 should be week 2'
    expect(dateTime({input: [2003, 0, 10]}).week()).toBe(2); // 'Jan 10 2003 should be week 2'
    expect(dateTime({input: [2003, 0, 11]}).week()).toBe(3); // 'Jan 11 2003 should be week 3'
    expect(dateTime({input: [2008, 11, 27]}).week()).toBe(1); // 'Dec 27 2008 should be week 1'
    expect(dateTime({input: [2009, 0, 1]}).week()).toBe(1); // 'Jan  1 2009 should be week 1'
    expect(dateTime({input: [2009, 0, 2]}).week()).toBe(1); // 'Jan  2 2009 should be week 1'
    expect(dateTime({input: [2009, 0, 3]}).week()).toBe(2); // 'Jan  3 2009 should be week 2'
    expect(dateTime({input: [2009, 0, 9]}).week()).toBe(2); // 'Jan  9 2009 should be week 2'
    expect(dateTime({input: [2009, 0, 10]}).week()).toBe(3); // 'Jan 10 2009 should be week 3'
    expect(dateTime({input: [2009, 11, 26]}).week()).toBe(1); // 'Dec 26 2009 should be week 1'
    expect(dateTime({input: [2010, 0, 1]}).week()).toBe(1); // 'Jan  1 2010 should be week 1'
    expect(dateTime({input: [2010, 0, 2]}).week()).toBe(2); // 'Jan  2 2010 should be week 2'
    expect(dateTime({input: [2010, 0, 8]}).week()).toBe(2); // 'Jan  8 2010 should be week 2'
    expect(dateTime({input: [2010, 0, 9]}).week()).toBe(3); // 'Jan  9 2010 should be week 3'
    expect(dateTime({input: [2011, 0, 1]}).week()).toBe(1); // 'Jan  1 2011 should be week 1'
    expect(dateTime({input: [2011, 0, 7]}).week()).toBe(1); // 'Jan  7 2011 should be week 1'
    expect(dateTime({input: [2011, 0, 8]}).week()).toBe(2); // 'Jan  8 2011 should be week 2'
    expect(dateTime({input: [2011, 0, 14]}).week()).toBe(2); // 'Jan 14 2011 should be week 2'
    expect(dateTime({input: [2011, 0, 15]}).week()).toBe(3); // 'Jan 15 2011 should be week 3'
});

test('weeks numbers dow:1 doy:7', () => {
    settings.setDefaultWeekSettings({firstDay: 1, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [2011, 11, 26]}).week()).toBe(1); // 'Dec 26 2011 should be week 1'
    expect(dateTime({input: [2012, 0, 1]}).week()).toBe(1); // 'Jan  1 2012 should be week 1'
    expect(dateTime({input: [2012, 0, 2]}).week()).toBe(2); // 'Jan  2 2012 should be week 2'
    expect(dateTime({input: [2012, 0, 8]}).week()).toBe(2); // 'Jan  8 2012 should be week 2'
    expect(dateTime({input: [2012, 0, 9]}).week()).toBe(3); // 'Jan  9 2012 should be week 3'
    expect(dateTime({input: [2007, 0, 1]}).week()).toBe(1); // 'Jan  1 2007 should be week 1'
    expect(dateTime({input: [2007, 0, 7]}).week()).toBe(1); // 'Jan  7 2007 should be week 1'
    expect(dateTime({input: [2007, 0, 8]}).week()).toBe(2); // 'Jan  8 2007 should be week 2'
    expect(dateTime({input: [2007, 0, 14]}).week()).toBe(2); // 'Jan 14 2007 should be week 2'
    expect(dateTime({input: [2007, 0, 15]}).week()).toBe(3); // 'Jan 15 2007 should be week 3'
    expect(dateTime({input: [2007, 11, 31]}).week()).toBe(1); // 'Dec 31 2007 should be week 1'
    expect(dateTime({input: [2008, 0, 1]}).week()).toBe(1); // 'Jan  1 2008 should be week 1'
    expect(dateTime({input: [2008, 0, 6]}).week()).toBe(1); // 'Jan  6 2008 should be week 1'
    expect(dateTime({input: [2008, 0, 7]}).week()).toBe(2); // 'Jan  7 2008 should be week 2'
    expect(dateTime({input: [2008, 0, 13]}).week()).toBe(2); // 'Jan 13 2008 should be week 2'
    expect(dateTime({input: [2008, 0, 14]}).week()).toBe(3); // 'Jan 14 2008 should be week 3'
    expect(dateTime({input: [2002, 11, 30]}).week()).toBe(1); // 'Dec 30 2002 should be week 1'
    expect(dateTime({input: [2003, 0, 1]}).week()).toBe(1); // 'Jan  1 2003 should be week 1'
    expect(dateTime({input: [2003, 0, 5]}).week()).toBe(1); // 'Jan  5 2003 should be week 1'
    expect(dateTime({input: [2003, 0, 6]}).week()).toBe(2); // 'Jan  6 2003 should be week 2'
    expect(dateTime({input: [2003, 0, 12]}).week()).toBe(2); // 'Jan 12 2003 should be week 2'
    expect(dateTime({input: [2003, 0, 13]}).week()).toBe(3); // 'Jan 13 2003 should be week 3'
    expect(dateTime({input: [2008, 11, 29]}).week()).toBe(1); // 'Dec 29 2008 should be week 1'
    expect(dateTime({input: [2009, 0, 1]}).week()).toBe(1); // 'Jan  1 2009 should be week 1'
    expect(dateTime({input: [2009, 0, 4]}).week()).toBe(1); // 'Jan  4 2009 should be week 1'
    expect(dateTime({input: [2009, 0, 5]}).week()).toBe(2); // 'Jan  5 2009 should be week 2'
    expect(dateTime({input: [2009, 0, 11]}).week()).toBe(2); // 'Jan 11 2009 should be week 2'
    expect(dateTime({input: [2009, 0, 12]}).week()).toBe(3); // 'Jan 12 2009 should be week 3'
    expect(dateTime({input: [2009, 11, 28]}).week()).toBe(1); // 'Dec 28 2009 should be week 1'
    expect(dateTime({input: [2010, 0, 1]}).week()).toBe(1); // 'Jan  1 2010 should be week 1'
    expect(dateTime({input: [2010, 0, 3]}).week()).toBe(1); // 'Jan  3 2010 should be week 1'
    expect(dateTime({input: [2010, 0, 4]}).week()).toBe(2); // 'Jan  4 2010 should be week 2'
    expect(dateTime({input: [2010, 0, 10]}).week()).toBe(2); // 'Jan 10 2010 should be week 2'
    expect(dateTime({input: [2010, 0, 11]}).week()).toBe(3); // 'Jan 11 2010 should be week 3'
    expect(dateTime({input: [2010, 11, 27]}).week()).toBe(1); // 'Dec 27 2010 should be week 1'
    expect(dateTime({input: [2011, 0, 1]}).week()).toBe(1); // 'Jan  1 2011 should be week 1'
    expect(dateTime({input: [2011, 0, 2]}).week()).toBe(1); // 'Jan  2 2011 should be week 1'
    expect(dateTime({input: [2011, 0, 3]}).week()).toBe(2); // 'Jan  3 2011 should be week 2'
    expect(dateTime({input: [2011, 0, 9]}).week()).toBe(2); // 'Jan  9 2011 should be week 2'
    expect(dateTime({input: [2011, 0, 10]}).week()).toBe(3); // 'Jan 10 2011 should be week 3'
});

test('weeks numbers dow:0 doy:6', () => {
    settings.setDefaultWeekSettings({firstDay: 7, minimalDays: 1, weekend: [6, 7]});
    expect(dateTime({input: [2012, 0, 1]}).week()).toBe(1); // 'Jan  1 2012 should be week 1'
    expect(dateTime({input: [2012, 0, 7]}).week()).toBe(1); // 'Jan  7 2012 should be week 1'
    expect(dateTime({input: [2012, 0, 8]}).week()).toBe(2); // 'Jan  8 2012 should be week 2'
    expect(dateTime({input: [2012, 0, 14]}).week()).toBe(2); // 'Jan 14 2012 should be week 2'
    expect(dateTime({input: [2012, 0, 15]}).week()).toBe(3); // 'Jan 15 2012 should be week 3'
    expect(dateTime({input: [2006, 11, 31]}).week()).toBe(1); // 'Dec 31 2006 should be week 1'
    expect(dateTime({input: [2007, 0, 1]}).week()).toBe(1); // 'Jan  1 2007 should be week 1'
    expect(dateTime({input: [2007, 0, 6]}).week()).toBe(1); // 'Jan  6 2007 should be week 1'
    expect(dateTime({input: [2007, 0, 7]}).week()).toBe(2); // 'Jan  7 2007 should be week 2'
    expect(dateTime({input: [2007, 0, 13]}).week()).toBe(2); // 'Jan 13 2007 should be week 2'
    expect(dateTime({input: [2007, 0, 14]}).week()).toBe(3); // 'Jan 14 2007 should be week 3'
    expect(dateTime({input: [2007, 11, 29]}).week()).toBe(52); // 'Dec 29 2007 should be week 52'
    expect(dateTime({input: [2008, 0, 1]}).week()).toBe(1); // 'Jan  1 2008 should be week 1'
    expect(dateTime({input: [2008, 0, 5]}).week()).toBe(1); // 'Jan  5 2008 should be week 1'
    expect(dateTime({input: [2008, 0, 6]}).week()).toBe(2); // 'Jan  6 2008 should be week 2'
    expect(dateTime({input: [2008, 0, 12]}).week()).toBe(2); // 'Jan 12 2008 should be week 2'
    expect(dateTime({input: [2008, 0, 13]}).week()).toBe(3); // 'Jan 13 2008 should be week 3'
    expect(dateTime({input: [2002, 11, 29]}).week()).toBe(1); // 'Dec 29 2002 should be week 1'
    expect(dateTime({input: [2003, 0, 1]}).week()).toBe(1); // 'Jan  1 2003 should be week 1'
    expect(dateTime({input: [2003, 0, 4]}).week()).toBe(1); // 'Jan  4 2003 should be week 1'
    expect(dateTime({input: [2003, 0, 5]}).week()).toBe(2); // 'Jan  5 2003 should be week 2'
    expect(dateTime({input: [2003, 0, 11]}).week()).toBe(2); // 'Jan 11 2003 should be week 2'
    expect(dateTime({input: [2003, 0, 12]}).week()).toBe(3); // 'Jan 12 2003 should be week 3'
    expect(dateTime({input: [2008, 11, 28]}).week()).toBe(1); // 'Dec 28 2008 should be week 1'
    expect(dateTime({input: [2009, 0, 1]}).week()).toBe(1); // 'Jan  1 2009 should be week 1'
    expect(dateTime({input: [2009, 0, 3]}).week()).toBe(1); // 'Jan  3 2009 should be week 1'
    expect(dateTime({input: [2009, 0, 4]}).week()).toBe(2); // 'Jan  4 2009 should be week 2'
    expect(dateTime({input: [2009, 0, 10]}).week()).toBe(2); // 'Jan 10 2009 should be week 2'
    expect(dateTime({input: [2009, 0, 11]}).week()).toBe(3); // 'Jan 11 2009 should be week 3'
    expect(dateTime({input: [2009, 11, 27]}).week()).toBe(1); // 'Dec 27 2009 should be week 1'
    expect(dateTime({input: [2010, 0, 1]}).week()).toBe(1); // 'Jan  1 2010 should be week 1'
    expect(dateTime({input: [2010, 0, 2]}).week()).toBe(1); // 'Jan  2 2010 should be week 1'
    expect(dateTime({input: [2010, 0, 3]}).week()).toBe(2); // 'Jan  3 2010 should be week 2'
    expect(dateTime({input: [2010, 0, 9]}).week()).toBe(2); // 'Jan  9 2010 should be week 2'
    expect(dateTime({input: [2010, 0, 10]}).week()).toBe(3); // 'Jan 10 2010 should be week 3'
    expect(dateTime({input: [2010, 11, 26]}).week()).toBe(1); // 'Dec 26 2010 should be week 1'
    expect(dateTime({input: [2011, 0, 1]}).week()).toBe(1); // 'Jan  1 2011 should be week 1'
    expect(dateTime({input: [2011, 0, 2]}).week()).toBe(2); // 'Jan  2 2011 should be week 2'
    expect(dateTime({input: [2011, 0, 8]}).week()).toBe(2); // 'Jan  8 2011 should be week 2'
    expect(dateTime({input: [2011, 0, 9]}).week()).toBe(3); // 'Jan  9 2011 should be week 3'
});

test('week year setter works', () => {
    for (let year = 2000; year <= 2020; year += 1) {
        expect(
            dateTime({input: '2012-12-31T00:00:00.000Z', setTimezone: true})
                .isoWeekYear(year)
                .isoWeekYear(),
        ).toBe(year);
        expect(
            dateTime({input: '2012-12-31T00:00:00.000Z', setTimezone: true})
                .weekYear(year)
                .weekYear(),
        ).toBe(year);
    }
});
