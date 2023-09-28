import MockDate from 'mockdate';
import {DEFAULT_SYSTEM_DATE_FORMAT} from '../constants';
import type {DateTime} from '../typings';
import {dateTimeParse} from './parser';

const TESTED_DATE_STRING = '2021-08-07';
const TESTED_TIMESTAMP = 1621708204063;
const MOCKED_DATE = '2021-08-07T12:10:00';

MockDate.set(MOCKED_DATE);

describe('Parser', () => {
    it('should return DateTime in case of using object', () => {
        const date = dateTimeParse({year: 2021, month: 7, day: 7})?.format(
            DEFAULT_SYSTEM_DATE_FORMAT,
        );
        expect(date).toEqual(TESTED_DATE_STRING);
    });

    it('should return DateTime in case of using array', () => {
        const date = dateTimeParse([2021, 7, 7])?.format(DEFAULT_SYSTEM_DATE_FORMAT);
        expect(date).toEqual(TESTED_DATE_STRING);
    });

    it('should return DateTime in case of using date string', () => {
        const date = dateTimeParse(TESTED_DATE_STRING)?.format(DEFAULT_SYSTEM_DATE_FORMAT);
        expect(date).toEqual(TESTED_DATE_STRING);
    });

    it('should return DateTime in case of using relative date string', () => {
        const date = dateTimeParse('now')?.toISOString();
        expect(date).toEqual(new Date().toISOString());
    });

    it('should return DateTime with specified timeZone', () => {
        const date = dateTimeParse(TESTED_DATE_STRING, {timeZone: 'Asia/Tokyo'})?.format('Z');
        expect(date).toEqual('+09:00');
    });

    it('should return DateTime with correct time with when timeZone is defined', () => {
        const date = dateTimeParse('2021-08-07T12:10:00', {
            timeZone: 'Europe/Amsterdam',
        });
        expect(date?.toISOString()).toBe('2021-08-07T10:10:00.000Z');
    });

    it('test', () => {
        const date = dateTimeParse('2023-09-05T13:39:00.000Z', {
            timeZone: 'Europe/Amsterdam',
        });
        expect(date?.toISOString()).toBe('2023-09-05T13:39:00.000Z');
    });

    it('should return DateTime in case of using format arg and input corresponding to this format', () => {
        const date = dateTimeParse('2021', {format: 'YYYY'});
        expect(Boolean(date)).toEqual(true);
    });

    it('should return undefined in case of using format arg and input does not corresponding to this format', () => {
        const date = dateTimeParse('2021', {format: 'YYYY-MM-DD'});
        expect(Boolean(date)).toEqual(false);
    });

    it('should return equal dates for UTC and Etc/GMT time zones', () => {
        const utcDate = dateTimeParse(MOCKED_DATE, {timeZone: 'UTC'})?.format(
            DEFAULT_SYSTEM_DATE_FORMAT,
        );
        const gmtDate = dateTimeParse(MOCKED_DATE, {timeZone: 'Etc/GMT'})?.format(
            DEFAULT_SYSTEM_DATE_FORMAT,
        );
        expect(utcDate).toEqual(gmtDate);
    });

    test.each<[string | undefined, string]>([
        ['ru', '07 авг. 2021'],
        ['en', '07 Aug 2021'],
        ['incorrectLang', '07 Aug 2021'],
        [undefined, '07 Aug 2021'],
    ])('lang option (%p)', (lang, expected) => {
        const date = dateTimeParse(TESTED_DATE_STRING, {lang})?.format('DD MMM YYYY');
        expect(date).toEqual(expected);
    });

    test.each<[number | DateTime | Date | undefined, string]>([
        [TESTED_TIMESTAMP, new Date(TESTED_TIMESTAMP).toISOString()],
        [new Date(TESTED_TIMESTAMP), new Date(TESTED_TIMESTAMP).toISOString()],
        [dateTimeParse(TESTED_TIMESTAMP), new Date(TESTED_TIMESTAMP).toISOString()],
    ])('should return DateTime in case of using timestamp (%p)', (input, expected) => {
        const date = dateTimeParse(input);
        expect(date?.toISOString()).toEqual(expected);
    });
});
