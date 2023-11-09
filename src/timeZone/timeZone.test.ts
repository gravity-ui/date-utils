import {isValidTimeZone, timeZoneOffset} from './timeZone';

describe('timeZone', () => {
    it('isValidTimeZone', () => {
        expect(isValidTimeZone('')).toBe(false);
        expect(isValidTimeZone('UTC')).toBe(true);
        expect(isValidTimeZone('GMT')).toBe(true);
        expect(isValidTimeZone('GMT+1')).toBe(false);
        expect(isValidTimeZone('Etc/GMT+1')).toBe(true);
        expect(isValidTimeZone('Europe/Amsterdam')).toBe(true);
    });

    it('timeZoneOffset', () => {
        const tsSummerTime = Date.UTC(2023, 5, 1, 0, 0, 0);
        const tsWinterTime = Date.UTC(2023, 11, 1, 0, 0, 0);

        expect(timeZoneOffset('UTC', tsSummerTime)).toBe(0);
        expect(timeZoneOffset('GMT', tsSummerTime)).toBe(0);
        expect(timeZoneOffset('Europe/Amsterdam', tsSummerTime)).toBe(120);
        expect(timeZoneOffset('Europe/London', tsSummerTime)).toBe(60);
        expect(timeZoneOffset('America/New_York', tsSummerTime)).toBe(-240);
        expect(timeZoneOffset('Europe/Moscow', tsSummerTime)).toBe(180);

        expect(timeZoneOffset('UTC', tsWinterTime)).toBe(0);
        expect(timeZoneOffset('GMT', tsWinterTime)).toBe(0);
        expect(timeZoneOffset('Europe/Amsterdam', tsWinterTime)).toBe(60);
        expect(timeZoneOffset('Europe/London', tsWinterTime)).toBe(0);
        expect(timeZoneOffset('America/New_York', tsWinterTime)).toBe(-300);
        expect(timeZoneOffset('Europe/Moscow', tsWinterTime)).toBe(180);
    });
});
