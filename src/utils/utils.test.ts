import {CompareStringsOptions, compareStrings} from './utils';

describe('utils', () => {
    test.each<
        [
            string | undefined,
            string | undefined,
            CompareStringsOptions | undefined,
            boolean | undefined,
        ]
    >([
        ['utc', 'UTC', undefined, false],
        [undefined, 'UTC', undefined, false],
        ['utc', undefined, undefined, false],
        [undefined, undefined, undefined, false],
        ['utc', 'UTC', {ignoreCase: true}, true],
        ['utc', 'UTC', {ignoreCase: false}, false],
    ])(
        'compareStrings (args: {str1: %p, str2: %p, options: %p})',
        (str1, str2, options, expected) => {
            const result = compareStrings(str1, str2, options);
            expect(result).toEqual(expected);
        },
    );
});
