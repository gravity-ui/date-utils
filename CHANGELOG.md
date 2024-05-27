# Changelog

## [2.5.2](https://github.com/gravity-ui/date-utils/compare/v2.5.1...v2.5.2) (2024-05-27)


### Bug Fixes

* **DateTime:** add missing formats and show ordinal values without brackets ([#66](https://github.com/gravity-ui/date-utils/issues/66)) ([dd9d942](https://github.com/gravity-ui/date-utils/commit/dd9d9429a831e05bf35892f558b3e1a443ecd6e7))

## [2.5.1](https://github.com/gravity-ui/date-utils/compare/v2.5.0...v2.5.1) (2024-05-23)


### Bug Fixes

* **locale:** add formats to en locale ([#64](https://github.com/gravity-ui/date-utils/issues/64)) ([8e2025e](https://github.com/gravity-ui/date-utils/commit/8e2025e426dd844d1d91a867655501511c33e392))

## [2.5.0](https://github.com/gravity-ui/date-utils/compare/v2.4.0...v2.5.0) (2024-05-23)


### Features

* **DateTime:** use own format and all dates math, remove unused dayjs plugins ([#62](https://github.com/gravity-ui/date-utils/issues/62)) ([72c210c](https://github.com/gravity-ui/date-utils/commit/72c210c34c94320190a0af01d5fc1f1987a6ae61))
* **Duration:** add format method ([#60](https://github.com/gravity-ui/date-utils/issues/60)) ([aa0af56](https://github.com/gravity-ui/date-utils/commit/aa0af5689e837bdd8da6eca36b08c22609569092))

## [2.4.0](https://github.com/gravity-ui/date-utils/compare/v2.3.0...v2.4.0) (2024-04-24)


### Features

* add Duration ([#55](https://github.com/gravity-ui/date-utils/issues/55)) ([2da2434](https://github.com/gravity-ui/date-utils/commit/2da243405a5da7b88a11185d23aa4f415ef747f9))


### Bug Fixes

* **Duration:** humanize should not depend on DST ([#56](https://github.com/gravity-ui/date-utils/issues/56)) ([9784b50](https://github.com/gravity-ui/date-utils/commit/9784b50c505e51e6daf2654b663cded59b2bd3c8))

## [2.3.0](https://github.com/gravity-ui/date-utils/compare/v2.2.0...v2.3.0) (2024-04-15)


### Features

* custom parser for relative date input ([#53](https://github.com/gravity-ui/date-utils/issues/53)) ([6b23322](https://github.com/gravity-ui/date-utils/commit/6b23322423dc8b2e334d0c3aee321373a4d0367a))

## [2.2.0](https://github.com/gravity-ui/date-utils/compare/v2.1.0...v2.2.0) (2024-04-08)


### Features

* **DateTime:** add helper to interpret input without timezone as utc time otherwise convert to utc ([#50](https://github.com/gravity-ui/date-utils/issues/50)) ([8de9d1d](https://github.com/gravity-ui/date-utils/commit/8de9d1ddf9845978fffc97e3ed52563b739fbcf5))

## [2.1.0](https://github.com/gravity-ui/date-utils/compare/v2.0.1...v2.1.0) (2024-01-25)


### Features

* **settings:** replaces dynamic import with getting a ready static module loader ([#46](https://github.com/gravity-ui/date-utils/issues/46)) ([d9f46a8](https://github.com/gravity-ui/date-utils/commit/d9f46a82679084c5051e6b18826d5f39a732915d))

## [2.0.1](https://github.com/gravity-ui/date-utils/compare/v2.0.0...v2.0.1) (2024-01-02)


### Bug Fixes

* **DateTime:** correctly calculate start of year ([#43](https://github.com/gravity-ui/date-utils/issues/43)) ([c902937](https://github.com/gravity-ui/date-utils/commit/c9029376ddc7fe10cb96ed2b89a60c1759c56b5d))

## [2.0.0](https://github.com/gravity-ui/date-utils/compare/v1.4.2...v2.0.0) (2023-12-28)


### ⚠ BREAKING CHANGES

* **dateTime:**  work with UTC the same as with other timezones, in case if input date does not contain timezone information

```js
guessUserTimeZone() == 'Europe/Moscow';
 // Before
dateTime({input: '2023-12-31', timeZone: 'UTC') == '2023-12-31T00:00Z'
// After
dateTime({input: '2023-12-31', timeZone: 'UTC') == '2023-12-30T21:00Z'
```

### Bug Fixes

* **dateTime:** correctly works with timezones, utc offsets and DST ([#41](https://github.com/gravity-ui/date-utils/issues/41)) ([23488cc](https://github.com/gravity-ui/date-utils/commit/23488cc07f481c2f285abb40bec2dbb44f37ccac))

## [1.4.2](https://github.com/gravity-ui/date-utils/compare/v1.4.1...v1.4.2) (2023-08-29)


### Bug Fixes

* **dateTime:** fix typings for utcOffset() ([#33](https://github.com/gravity-ui/date-utils/issues/33)) ([0559cf0](https://github.com/gravity-ui/date-utils/commit/0559cf0b141855732d62ddcc4115986934dd6502))

## [1.4.1](https://github.com/gravity-ui/date-utils/compare/v1.4.0...v1.4.1) (2023-05-22)


### Bug Fixes

* **DurationUnit:** add date unit ([#30](https://github.com/gravity-ui/date-utils/issues/30)) ([ea7c455](https://github.com/gravity-ui/date-utils/commit/ea7c45510ea134a6dedc90cb24be5e0b2d59a759))

## [1.4.0](https://github.com/gravity-ui/date-utils/compare/v1.3.1...v1.4.0) (2023-05-20)


### Features

* **Settings:** add getLocaleData method ([#28](https://github.com/gravity-ui/date-utils/issues/28)) ([746383e](https://github.com/gravity-ui/date-utils/commit/746383eaff6e1e5dfb1fd0f7005dd5e9be0a4f86))

## [1.3.1](https://github.com/gravity-ui/date-utils/compare/v1.3.0...v1.3.1) (2023-04-07)


### Bug Fixes

* revert support UTC formatting ([#26](https://github.com/gravity-ui/date-utils/issues/26)) ([be2d98c](https://github.com/gravity-ui/date-utils/commit/be2d98c4bfc0ffd00cf807221c728fd13e084ac0))

## [1.3.0](https://github.com/gravity-ui/date-utils/compare/v1.2.0...v1.3.0) (2023-03-28)


### Features

* support UTC timezone formatting ([#24](https://github.com/gravity-ui/date-utils/issues/24)) ([4a6f21f](https://github.com/gravity-ui/date-utils/commit/4a6f21f89fe49740bc972734db9df9e17ca99fd6))


### Bug Fixes

* add missing types signatures ([#18](https://github.com/gravity-ui/date-utils/issues/18)) ([5905e60](https://github.com/gravity-ui/date-utils/commit/5905e6076e731907b4a93fcbc0140ccb483dd273))
* improve typings for utc plugin ([#23](https://github.com/gravity-ui/date-utils/issues/23)) ([d4df45f](https://github.com/gravity-ui/date-utils/commit/d4df45f4de99d2aa8e476e7e40d9264b4e84d804))

## [1.2.0](https://github.com/gravity-ui/date-utils/compare/v1.1.3...v1.2.0) (2023-03-17)


### Features

* add advancedFormat plugin ([#20](https://github.com/gravity-ui/date-utils/issues/20)) ([b2a12e6](https://github.com/gravity-ui/date-utils/commit/b2a12e623574accdce0006cf55cee6ab924043c4))

## [1.1.3](https://github.com/gravity-ui/date-utils/compare/v1.1.2...v1.1.3) (2023-02-13)


### Bug Fixes

* import only used functions from lodash ([#16](https://github.com/gravity-ui/date-utils/issues/16)) ([cd8e057](https://github.com/gravity-ui/date-utils/commit/cd8e057963f8dc5f72051a36c4bed31e3771fc51))

## [1.1.2](https://github.com/gravity-ui/date-utils/compare/v1.1.1...v1.1.2) (2023-02-08)


### Bug Fixes

* properly export types dependent on dayjs plugins ([#14](https://github.com/gravity-ui/date-utils/issues/14)) ([8445819](https://github.com/gravity-ui/date-utils/commit/8445819eb4a3fc76e1da08287dd0393072d99a2b))

## [1.1.1](https://github.com/gravity-ui/date-utils/compare/v1.1.0...v1.1.1) (2023-02-01)


### Bug Fixes

* fix settings.loadLocale ([#12](https://github.com/gravity-ui/date-utils/issues/12)) ([753668b](https://github.com/gravity-ui/date-utils/commit/753668bb9189166a6b32034c6dbeea11addf2b6e))

## [1.1.0](https://github.com/gravity-ui/date-utils/compare/v1.0.0...v1.1.0) (2023-01-31)


### Features

* add localized formats plugin ([#11](https://github.com/gravity-ui/date-utils/issues/11)) ([a59640f](https://github.com/gravity-ui/date-utils/commit/a59640f27b77e0af09b1574f72ea641cbb60c03f))


### Bug Fixes

* fix DateTime interface ([#9](https://github.com/gravity-ui/date-utils/issues/9)) ([c2ddeb4](https://github.com/gravity-ui/date-utils/commit/c2ddeb4180a19069d769ce4d88e3980af4893afc))

## 1.0.0 (2023-01-18)


### Bug Fixes

* fix readme install section ([#7](https://github.com/gravity-ui/date-utils/issues/7)) ([b0dd0a4](https://github.com/gravity-ui/date-utils/commit/b0dd0a47311c042993817e60ed56347552be48b3))
