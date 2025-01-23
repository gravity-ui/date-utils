import type {ParseOptions} from '../datemath';
import type {WeekInfo} from '../locale/types';
import type {DateTime} from '../typings';

export interface Parser {
    parse: (text: string, options?: ParseOptions) => DateTime | undefined;
    isLikeRelative: (text: string) => boolean;
}

export interface PublicSettings {
    getDefaultLocale(): string;
    setDefaultLocale(locale: string): void;

    getDefaultTimeZone(): string;
    setDefaultTimeZone(zone: 'system' | (string & {})): void;

    getDefaultWeekSettings(): WeekInfo | null;
    setDefaultWeekSettings(weekSettings: WeekInfo | null): void;

    getTwoDigitCutoffYear(): number;
    setTwoDigitCutoffYear(cutoffYear: number): void;

    setRelativeParser(parser: Parser): void;
}
