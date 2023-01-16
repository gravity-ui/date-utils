import {CollatorSensitivity} from '../constants';

export type CompareStringsOptions = {
    ignoreCase?: boolean;
};

export const compareStrings = (
    str1?: string,
    str2?: string,
    options: CompareStringsOptions = {},
) => {
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return false;
    }

    const {ignoreCase} = options;
    let collatorOptions: Intl.CollatorOptions | undefined;

    if (typeof ignoreCase === 'boolean') {
        const sensitivity = ignoreCase ? CollatorSensitivity.BASE : CollatorSensitivity.CASE;
        collatorOptions = {sensitivity};
    }

    return str1.localeCompare(str2, undefined, collatorOptions) === 0;
};
