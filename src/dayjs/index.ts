import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(updateLocale);

export default dayjs;

export type {ConfigTypeMap, ConfigType} from 'dayjs';
export type {customParseFormat, utc, updateLocale};
