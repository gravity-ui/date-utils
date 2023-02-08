import type dayjs from '../dayjs';

// https://dayjs.gitee.io/docs/ru/customization/customization
export type UpdateLocaleConfig = Parameters<typeof dayjs.updateLocale>[1] | Partial<ILocale>;
