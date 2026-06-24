import {settings} from './settings';

afterAll(() => {
    settings.setLocale('en');
});

describe('settings', () => {
    it('default locale should be "en"', () => {
        expect(settings.getLocale()).toEqual('en');
    });

    it('loadLocale should fail in case of an unknown locale', async () => {
        await expect(settings.loadLocale('unknown')).rejects.toThrow();
    });

    it('setLocale should fail in case of an unknown locale', () => {
        expect(() => settings.setLocale('unknown')).toThrow();
    });

    it('should load, set and get an existing locale', async () => {
        const LOCALE = 'de';
        await settings.loadLocale(LOCALE);
        settings.setLocale(LOCALE);
        expect(settings.getLocale()).toEqual(LOCALE);
    });

    it('should clone locale data with function values', () => {
        settings.setLocale('en');

        const localeData = settings.getLocaleData();
        const nextLocaleData = settings.getLocaleData();

        expect(typeof localeData.ordinal).toBe('function');
        expect(localeData).not.toBe(nextLocaleData);
        expect(localeData.formats).not.toBe(nextLocaleData.formats);
    });
});
