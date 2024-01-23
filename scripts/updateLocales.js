/**
 * Fetches and writes to the locale file from github dayjs
 * node.js >= 20 lts
 * @module Locale
 * */

const fs = require('node:fs/promises');

const LOCALES_PATH = 'src/settings/locales.ts';
const GITHUB_LOCALES_URL = 'https://github.com/iamkun/dayjs/tree/dev/src/locale';

const fetchLocalesList = async (githubUrl) => {
    try {
        const res = await fetch(githubUrl);
        const json = await res.json();
        const {items} = json.payload.tree;

        return items.map((item) => item.name);
    } catch (error) {
        throw new Error(
            `Something went wrong when trying to retrieve data from github dayjs, check if the URL is correct ${GITHUB_LOCALES_URL}`,
        );
    }
};

const createLocalesFile = async (localesPath) => {
    if (require('node:fs').existsSync(localesPath)) {
        await fs.rm(localesPath);
    }

    return await fs.open(localesPath, 'w');
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
        const localesList = await fetchLocalesList(GITHUB_LOCALES_URL);

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
