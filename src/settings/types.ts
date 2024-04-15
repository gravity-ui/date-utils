import type {ParseOptions} from '../datemath';
import type dayjs from '../dayjs';
import type {DateTime} from '../typings';

// https://dayjs.gitee.io/docs/ru/customization/customization
export type UpdateLocaleConfig = Parameters<typeof dayjs.updateLocale>[1] | Partial<ILocale>;

export interface Parser {
    parse: (text: string, options?: ParseOptions) => DateTime | undefined;
    isLikeRelative: (text: string) => boolean;
}

export interface PublicSettings {
    loadLocale(locale: string): Promise<void>;

    getLocale(): string;

    getLocaleData(): ILocale;

    setLocale(locale: string): void;

    updateLocale(config: UpdateLocaleConfig): void;

    setDefaultTimeZone(zone: 'system' | (string & {})): void;

    getDefaultTimeZone(): string;

    setRelativeParser(parser: Parser): void;
}
