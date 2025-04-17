// Copyright 2015 Grafana Labs
// Copyright 2021 YANDEX LLC

import type {DateTimeOptions} from './common';

export interface DateTimeOptionsWhenParsing extends DateTimeOptions {
    /**
     * If the input is a relative date, e.g. now-6h, then you can specify this to control
     * whether the last part of the date and time value is included or excluded.
     *
     * Example: now-6h and the current time is 12:20:00 if roundUp is set to true
     * the returned DateTime value will be 06:00:00.
     */
    roundUp?: boolean;
    allowRelative?: boolean;
}
