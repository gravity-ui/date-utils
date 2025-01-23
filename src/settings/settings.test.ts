import {settings} from './settings';

afterAll(() => {
    settings.setDefaultLocale('en');
});

describe('settings', () => {
    it('default locale should be "en"', () => {
        expect(settings.getDefaultLocale()).toEqual('en');
    });

    it('setLocale should fail in case of an unknown locale', () => {
        expect(() => settings.setDefaultLocale('just-unknown')).toThrow();
    });

    it('should load, set and get an existing locale', async () => {
        const LOCALE = 'de';
        settings.setDefaultLocale(LOCALE);
        expect(settings.getDefaultLocale()).toEqual(LOCALE);
    });
});
