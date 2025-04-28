# Getting Started

## Installation

You can install the Date Utils library using npm or yarn:

```bash
# Using npm
npm install @gravity-ui/date-utils

# Using yarn
yarn add @gravity-ui/date-utils
```

## Basic Usage

### Importing

You can import the specific functions you need:

```typescript
import {dateTimeParse, dateTime, settings} from '@gravity-ui/date-utils';
```

### Parsing Dates

The `dateTimeParse` function is the main entry point for parsing dates. It can parse dates from various formats:

```typescript
import {dateTimeParse} from '@gravity-ui/date-utils';

// Parse from object
const date1 = dateTimeParse({year: 2021, month: 7, day: 7});

// Parse from array [year, month, day]
const date2 = dateTimeParse([2021, 7, 7]);

// Parse from string
const date3 = dateTimeParse('2021-08-07');

// Parse from timestamp (milliseconds)
const date4 = dateTimeParse(1621708204063);

// Parse relative dates
const now = dateTimeParse('now');
const yesterday = dateTimeParse('now-1d');
const nextMonth = dateTimeParse('now+1M');
const startOfDay = dateTimeParse('now/d');
const startOfNextDay = dateTimeParse('now+1d/d');
```

### Creating DateTime Objects

The `dateTime` function creates a DateTime object:

```typescript
import {dateTime} from '@gravity-ui/date-utils';

// Current date and time
const now = dateTime();

// From a string
const date1 = dateTime({input: '2021-08-07'});

// With a specific format
const date2 = dateTime({input: '2021-08-07', format: 'YYYY-MM-DD'});

// With a specific time zone
const date3 = dateTime({timeZone: 'Asia/Tokyo'});
```

### Formatting Dates

DateTime objects have a `format` method for formatting dates:

```typescript
import {dateTime} from '@gravity-ui/date-utils';

const date = dateTime({input: '2021-08-07T12:30:45'});

// Basic formatting
console.log(date.format('YYYY-MM-DD')); // '2021-08-07'
console.log(date.format('DD/MM/YYYY')); // '07/08/2021'
console.log(date.format('MMMM D, YYYY')); // 'August 7, 2021'
console.log(date.format('HH:mm:ss')); // '12:30:45'

// ISO string
console.log(date.toISOString()); // '2021-08-07T12:30:45.000Z'
```

### Manipulating Dates

DateTime objects provide methods for manipulating dates:

```typescript
import {dateTime} from '@gravity-ui/date-utils';

const date = dateTime({input: '2021-08-07'});

// Adding time
const tomorrow = date.add(1, 'd');
const nextWeek = date.add(1, 'w');
const nextMonth = date.add(1, 'M');

// Subtracting time
const yesterday = date.subtract(1, 'd');
const lastWeek = date.subtract(1, 'w');
const lastMonth = date.subtract(1, 'M');

// Start/end of time periods
const startOfDay = date.startOf('day');
const endOfMonth = date.endOf('month');
```

### Working with Time Zones

DateTime objects provide methods for working with time zones:

```typescript
import {dateTime, getTimeZonesList, guessUserTimeZone} from '@gravity-ui/date-utils';

// Get the user's time zone
const userTimeZone = guessUserTimeZone();

// Get a list of all time zones
const timeZones = getTimeZonesList();

// Create a date in a specific time zone
const tokyoDate = dateTime({timeZone: 'Asia/Tokyo'});

// Convert to a different time zone
const newYorkDate = tokyoDate.timeZone('America/New_York');

// Get the time zone offset
console.log(tokyoDate.utcOffset()); // minutes
```

### Working with Relative Dates

The library provides support for parsing relative date expressions:

```typescript
import {dateTimeParse} from '@gravity-ui/date-utils';

// Current date and time
const now = dateTimeParse('now');

// 1 day ago
const yesterday = dateTimeParse('now-1d');

// 1 day ago + 1 month
const complexDate = dateTimeParse('now-1d+1M');

// Start of today
const startOfToday = dateTimeParse('now/d');

// Start of tomorrow
const startOfTomorrow = dateTimeParse('now+1d/d');
```

### Settings and Localization

The library provides settings for configuration and localization:

```typescript
import {settings} from '@gravity-ui/date-utils';

// Get current locale
const currentLocale = settings.getLocale(); // default is "en"

// Load and set a new locale
settings.loadLocale('de').then(() => {
  settings.setLocale('de');
});

// Customize locale settings
settings.updateLocale({weekStart: 0}); // change first day of week
```

## Next Steps

For more detailed information about the library's features and API, check out the [API documentation](./api/overview.md).
