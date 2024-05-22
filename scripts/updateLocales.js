/* eslint-disable no-console */
/**
 * Fetches and writes to the locale file from github dayjs
 * node.js >= 20 lts
 * @module Locale
 * */

const fs = require('node:fs');
const fsPromises = require('node:fs/promises');

const VALID_FILE_PATTERN = /^((?!index).)*.js$/;
const LOCALES_PATH = 'src/settings/locales.ts';
const LOCALES_DIR_PATH = 'node_modules/dayjs/locale';

const getLocalesList = async (localesDirPath) => {
    if (fs.existsSync(localesDirPath)) {
        const localesList = await fsPromises.readdir(localesDirPath);
        return localesList.filter((locale) => VALID_FILE_PATTERN.test(locale));
    }

    throw new Error(
        'The script was called before the dayjs library was installed, install it and try again',
    );
};

const createLocalesFile = async (localesPath) => {
    if (fs.existsSync(localesPath)) {
        await fsPromises.rm(localesPath);
    }

    return await fsPromises.open(localesPath, 'w');
};

const buildLocalesContent = (localesList) => {
    const isEmptyStr = (s) => !s.length || !s;

    const localeChunks = [];

    localeChunks.push("type LocaleLoader = () => Promise<typeof import('dayjs/locale/*.js')>;\n");
    localeChunks.push('export const localeLoaders: Record<string, LocaleLoader> = {');

    localesList.forEach((locale) => {
        if (isEmptyStr(locale)) return;

        const name = locale.substring(0, locale.lastIndexOf('.'));
        const localeName = name.includes('-') ? `'${name}'` : name;

        localeChunks.push(`    ${localeName}: () => import('dayjs/locale/${locale}'),`);
    });

    localeChunks.push('};\n');

    return localeChunks.join('\n');
};

(async function () {
    try {
        const localesList = await getLocalesList(LOCALES_DIR_PATH);

        console.info('Locales loaded successfully');

        const localeFile = await createLocalesFile(LOCALES_PATH);

        console.info(`File "${LOCALES_PATH}" created successfully`);

        const localesContent = buildLocalesContent(localesList);

        console.info(`File content built successfully`);

        await localeFile.appendFile(localesContent);

        console.info(`Object "localeLoaders" written in file "${LOCALES_PATH}" successfully`);
    } catch (error) {
        console.error(error);
    }
})();
