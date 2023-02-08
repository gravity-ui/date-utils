// Copyright 2015 Grafana Labs
// Copyright 2021 YANDEX LLC

import type {TimeZoneOptions} from './timeZone';

export interface DateTimeOptions extends TimeZoneOptions {
    /**
     * Strict {@link https://dayjs.gitee.io/docs/en/display/format format} for parsing user's input
     */
    format?: string;
    lang?: string;
}
