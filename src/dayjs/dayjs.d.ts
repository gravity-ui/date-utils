import 'dayjs';

declare module 'dayjs' {
    interface ConfigTypeMap {
        // to fix inconsistent typing between dayjs and DateTime
        // dayjs expects [number?, number?, number?, number?, number?, number?, number?]
        // but DateTime allows Array<string | number>
        dateTimeArray: Array<string | number>;
    }
}
