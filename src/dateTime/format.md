# format

Format of the string is based on Unicode Technical Standard #35: <https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table>

| Unit                          | Pattern | Example                          | Notes                                                               |
| :---------------------------- | :------ | :------------------------------- | :------------------------------------------------------------------ |
| Era                           | G..GGG  | AD, BC                           | Abbreviated                                                         |
|                               | GGGG    | Anno Domini, Before Christ       | Wide                                                                |
|                               | GGGGG   | A, B                             | Narrow                                                              |
| Calendar year                 | y       | 2, 20, 201, 2017, 20173          |                                                                     |
|                               | yy      | 02, 20, 01, 17, 73               |                                                                     |
|                               | yyy     | 002, 020, 201, 2017, 20173       |                                                                     |
|                               | yyyy    | 0002, 0020, 0201, 2017, 20173    |                                                                     |
|                               | yyyyy+  | ...                              |                                                                     |
|                               | yo      | 2nd, 20th, ...                   | Not in standard                                                     |
| Local week-numbering year     | Y       | 2, 20, 201, 2017, 20173          |                                                                     |
|                               | YY      | 02, 20, 01, 17, 73               |                                                                     |
|                               | YYY     | 002, 020, 201, 2017, 20173       |                                                                     |
|                               | YYYY    | 0002, 0020, 0201, 2017, 20173    |                                                                     |
|                               | YYYYY+  | ...                              |                                                                     |
|                               | Yo      | 2nd, 20th, ...                   | Not in standard                                                     |
| Extended year                 | u+      | 4601                             |                                                                     |
| Quarter                       | Q       | 1, 2, 3, 4                       |                                                                     |
|                               | QQ      | 01, 02, 03, 04                   |                                                                     |
|                               | QQQ     | Q1, Q2, Q3, Q4                   |                                                                     |
|                               | QQQQ    | 1st quarter, 2nd quarter, ...    |                                                                     |
|                               | QQQQQ   | 1, 2, 3, 4                       |                                                                     |
|                               | Qo      | 1st, 2nd, 3rd, 4th               | Not in standard                                                     |
| Quarter stand-alone           | q       | 1, 2, 3, 4                       |                                                                     |
|                               | qq      | 01, 02, 03, 04                   |                                                                     |
|                               | qqq     | Q1, Q2, Q3, Q4                   |                                                                     |
|                               | qqqq    | 1st quarter, 2nd quarter, ...    |                                                                     |
|                               | qqqqq   | 1, 2, 3, 4                       |                                                                     |
|                               | Qo      | 1st, 2nd, 3rd, 4th               | Not in standard                                                     |
| Month                         | M       | 1, 2, ..., 12                    |                                                                     |
|                               | MM      | 01, 02, ..., 12                  |                                                                     |
|                               | MMM     | Jan, Feb, ..., Dec               | Abbreviated                                                         |
|                               | MMMM    | January, February, ..., December | Wide                                                                |
|                               | MMMMM   | J, F, ..., D                     | Narrow                                                              |
|                               | Mo      | 1st, 2nd, ..., 12th              | Not in standard                                                     |
| Month stand-alone             | L       | 1, 2, ..., 12                    |                                                                     |
|                               | LL      | 01, 02, ..., 12                  |                                                                     |
|                               | LLL     | Jan, Feb, ..., Dec               | Abbreviated                                                         |
|                               | LLLL    | January, February, ..., December | Wide                                                                |
|                               | LLLLL   | J, F, ..., D                     | Narrow                                                              |
|                               | Lo      | 1st, 2nd, ..., 12th              | Not in standard                                                     |
| Local week of year            | w       | 1, 2, ..., 53                    |                                                                     |
|                               | ww      | 01, 02, ..., 53                  |                                                                     |
|                               | wo      | 1st, 2nd, ..., 53th              | Not in standard                                                     |
| Day of month                  | d       | 1, 2, ..., 31                    |                                                                     |
|                               | dd      | 01, 02, ..., 31                  |                                                                     |
|                               | do      | 1st, 2nd, ..., 31st              | Not in standard                                                     |
| Day of year                   | D       | 1, 2, ..., 256                   |                                                                     |
|                               | DD      | 01, 02, ..., 356                 |                                                                     |
|                               | DDD     | 001, 002, ..., 356               |                                                                     |
|                               | Do      | 1st, 2nd, ..., 356th             |                                                                     |
| Day of week                   | E..EEE  | Mon, Tue, Wed, ..., Sun          | Abbreviated                                                         |
|                               | EEEE    | Monday, Tuesday, ..., Sunday     | Wide                                                                |
|                               | EEEEE   | M, T, W, T, F, S, S              | Narrow                                                              |
| Local day of week             | e       | 1, 2, ..., 7                     |                                                                     |
|                               | ee      | 01, 02, ..., 07                  |                                                                     |
|                               | eee     | Mon, Tue, Wed, ..., Sun          | Abbreviated                                                         |
|                               | eeee    | Monday, Tuesday, ..., Sunday     | Wide                                                                |
|                               | eeeee   | M, T, W, T, F, S, S              | Narrow                                                              |
|                               | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su       | ???                                                                 |
|                               | eo      | 1st, 2nd, ..., 7th               | Not in standard                                                     |
| Local day of week stand-alone | c       | 1, 2, ..., 7                     |                                                                     |
|                               | cc      | 01, 02, ..., 07                  |                                                                     |
|                               | ccc     | Mon, Tue, Wed, ..., Sun          | Abbreviated                                                         |
|                               | cccc    | Monday, Tuesday, ..., Sunday     | Wide                                                                |
|                               | ccccc   | M, T, W, T, F, S, S              | Narrow                                                              |
|                               | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su       | ???                                                                 |
|                               | co      | 1st, 2nd, ..., 7th               | Not in standard                                                     |
| AM, PM                        | a..aaa  |                                  | Abbreviated                                                         |
|                               | aaaa    |                                  | Wide                                                                |
|                               | aaaaa   |                                  | Narrow                                                              |
| Hour (1-12)                   | h       | 1, 2, ..., 12                    |                                                                     |
|                               | hh      | 01, 02, ..., 12                  |                                                                     |
|                               | ho      | 1st, 2nd, ...., 12th             | Not in standard                                                     |
| Hour (0-23)                   | H       | 0, 1, ..., 23                    |                                                                     |
|                               | HH      | 00, 01, ..., 23                  |                                                                     |
|                               | Ho      | 0th, 1st, ...., 23rd             | Not in standard                                                     |
| Hour (0-11)                   | K       | 0, 1, ..., 11                    |                                                                     |
|                               | KK      | 00, 01, ..., 11                  |                                                                     |
|                               | Ko      | 0st, 1st, ...., 11th             | Not in standard                                                     |
| Hour (1-24)                   | k       | 1, 2, ..., 24                    |                                                                     |
|                               | kk      | 01, 02, ..., 24                  |                                                                     |
|                               | ko      | 1st, 2nd, ...., 24th             | Not in standard                                                     |
| Minute                        | m       | 0, 1, 2, ..., 59                 |                                                                     |
|                               | mm      | 00, 01, 02, ..., 59              |                                                                     |
|                               | mo      | 0th, 1st, 2nd, ..., 59th         | Not in standard                                                     |
| Second                        | s       | 0, 1, 2, ..., 59                 |                                                                     |
|                               | ss      | 00, 01, 02, ..., 59              |                                                                     |
|                               | so      | 0th, 1st, 2nd, ..., 59th         | Not in standard                                                     |
| Fractional Second             | S+      | 3456                             | Example shows display using pattern SSSS for seconds value 12.34567 |
| Timezone                      | z..zzz  |                                  | Abbreviated                                                         |
|                               | zzzz    |                                  | Wide                                                                |
| Timezone ISO8601 minus Z      | x       | -08, +0530, +00                  |                                                                     |
|                               | xx      | -0800, +0000                     |                                                                     |
|                               | xxx     | -08:00, +00:00                   |                                                                     |
|                               | xxxx    | -0800, -075258, +0000            | The seconds field is not supported by the ISO8601 specification.    |
|                               | xxxxx   | -08:00, -07:52:58, +00:00        | The seconds field is not supported by the ISO8601 specification.    |
| Timezone ISO8601 plus Z       | X       | -08, +0530, Z                    |                                                                     |
|                               | XX      | -0800, Z                         |                                                                     |
|                               | XXX     | -08:00, Z                        |                                                                     |
|                               | XXXX    | -0800, -075258, Z                | The seconds field is not supported by the ISO8601 specification.    |
|                               | XXXXX   | -08:00, -07:52:58, Z             | The seconds field is not supported by the ISO8601 specification.    |

## Other symbols are used in standard

| Sym. | Description                      |
| :--- | :------------------------------- |
| r    | Related Gregorian year (numeric) |
| U    | Cyclic year name.                |
| F    | Day of Week in Month (numeric).  |
| g    | Modified Julian day (numeric).   |
| b    | am, pm, noon, midnight           |
| B    | flexible day periods             |
| j    | Input skeleton symbol            |
| J    | Input skeleton symbol            |
| C    | Input skeleton symbol            |
| A    | Milliseconds in day (numeric).   |
| Z    | The ISO8601 format               |
| O    | The localized GMT format.        |
| v    | The generic non-location format  |
| V    | The time zone ID.                |

## Localized date format

| Pattern | Format                    |
| :------ | :------------------------ |
| P       | MM/dd/yyyy                |
| PP      | MMMM d, yyyy              |
| PPP     | MMMM d, yyyy h:mm a       |
| PPPP    | EEEE, MMMM d, yyyy h:mm a |
| p       | M/d/yyyy                  |
| pp      | MMM d, yyyy               |
| ppp     | MMM d, yyyy h:mm a        |
| pppp    | EEE, MMM d, yyyy h:mm a   |
| PT      | h:mm a                    |
| PTS     | h:mm:ss a                 |


DD.MM.YYYY

dd.MM.yyyy

MMM LLL
