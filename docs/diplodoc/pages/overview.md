# Overview

## About Date Utils

**Date Utils** is a library for working with dates and times in JavaScript. It provides a comprehensive set of utilities for parsing, formatting, manipulating, and displaying dates and times in various formats and time zones.

{% note warning %}

While the library is in active development, minor releases may include incompatible changes to the API.

{% endnote %}

## Key Features

The library provides the following key features:

- **Date and Time Parsing**: Parse dates from various formats, including ISO strings, timestamps, and custom formats
- **Date and Time Formatting**: Format dates in various formats, including custom formats
- **Time Zone Support**: Work with dates in different time zones
- **Relative Time Parsing**: Parse relative time expressions like "now-1d" or "now/d"
- **Date Math**: Perform date math operations like adding or subtracting time units
- **Duration Calculations**: Work with time durations
- **Locale Support**: Support for different locales and languages

## Main Components

The library consists of several main components:

- `dateTime` - Core date and time manipulation functions
- `dateTimeParse` - Parse dates from various formats
- `duration` - Working with time durations
- `datemath` - Parsing and evaluating date math expressions
- `timeZone` - Time zone conversion and manipulation
- `settings` - Configuration and locale settings

## Installation

```bash
npm install @gravity-ui/date-utils
```

## Basic Usage

```typescript
import {dateTimeParse, dateTime} from '@gravity-ui/date-utils';

// Parse absolute date
dateTimeParse({year: 2021, month: 7, day: 7})?.format('YYYY-MM-DDTHH:mm:ssZ'); // "2021-08-07T00:00:00+03:00"
dateTimeParse([2021, 7, 7])?.format('YYYY-MM-DDTHH:mm:ssZ'); // "2021-08-07T00:00:00+03:00"
dateTimeParse('2021-08-07')?.format('YYYY-MM-DDTHH:mm:ssZ'); // "2021-08-07T00:00:00+03:00"
dateTimeParse(1621708204063)?.format('YYYY-MM-DDTHH:mm:ssZ'); // "2021-05-22T21:30:04+03:00"

// Parse relative date
dateTimeParse('now')?.format('YYYY-MM-DDTHH:mm:ssZ'); // Current date and time
dateTimeParse('now-1d')?.format('YYYY-MM-DDTHH:mm:ssZ'); // 1 day ago
dateTimeParse('now-1d+1M')?.format('YYYY-MM-DDTHH:mm:ssZ'); // 1 day ago + 1 month
dateTimeParse('now/d')?.format('YYYY-MM-DDTHH:mm:ssZ'); // Start of today

// Create dateTime
dateTime().format('YYYY-MM-DDTHH:mm:ssZ'); // Current date and time
dateTime({input: '2021-08-07'}).format('YYYY-MM-DDTHH:mm:ssZ'); // "2021-08-07T00:00:00+03:00"
dateTime({timeZone: 'Asia/Tokyo'}).format('YYYY-MM-DDTHH:mm:ssZ'); // Current date and time in Tokyo
```

## Settings and Localization

```typescript
import {settings} from '@gravity-ui/date-utils';

// Get current locale
settings.getLocale(); // default locale "en"

// Load and set a new locale
settings.loadLocale('de').then(() => {
  settings.setLocale('de');
  settings.getLocale(); // "de"
});

// Customize locale settings
settings.updateLocale({weekStart: 0}); // change first day of week
```
