import {settings} from './settings';

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
});
