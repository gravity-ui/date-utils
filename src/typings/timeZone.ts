// Copyright 2015 Grafana Labs
// Copyright 2023 gravity-ui

export type TimeZoneUtc = 'utc';

export type TimeZoneBrowser = 'browser';

export type TimeZone = TimeZoneBrowser | TimeZoneUtc | string;

export interface TimeZoneOptions {
    /**
     * Specify this if you want to override the timeZone used when parsing or formatting
     * a date and time value. If no timeZone is set, the default timeZone for the current
     * user is used.
     */
    timeZone?: TimeZone;
}
