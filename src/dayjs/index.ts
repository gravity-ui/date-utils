import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

import {englishFormats} from '../constants';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(updateLocale);

dayjs.Ls['en'].formats = englishFormats;

export default dayjs;

export type {ConfigTypeMap, ConfigType} from 'dayjs';
export type {customParseFormat, utc, updateLocale};
