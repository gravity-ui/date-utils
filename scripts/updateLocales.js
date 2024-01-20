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

const createLocaleFile = async (localesPath) => {
    if (require('node:fs').existsSync(localesPath)) {
        await fs.rm(localesPath);
    }

    return await fs.open(localesPath, 'w');
};

(async function () {
    try {
        const localesList = await fetchLocalesList(GITHUB_LOCALES_URL);

        console.log('Locales loaded successfully');

        const localeFile = await createLocaleFile(LOCALES_PATH);

        console.log(`File "${LOCALES_PATH}" created successfully`);

        const localeLoaderType =
            "type LocaleLoader = () => Promise<typeof import('dayjs/locale/*.js')>;\n\n";

        await localeFile.appendFile(localeLoaderType);
        await localeFile.appendFile('export const localeLoaders: Record<string, LocaleLoader> = ');
        await localeFile.appendFile('{\n');

        await Promise.allSettled(
            localesList.map(async (locale) => {
                if (locale === '' || locale === undefined || locale === null) return;

                const localeName = locale.substring(0, locale.lastIndexOf('.'));
                const localeModulesObjectPart = `    "${localeName}": () => import('dayjs/locale/${locale}'),\n`;

                await localeFile.appendFile(localeModulesObjectPart);

                console.log(`Locale "${localeName}" written successfully`);
            }),
        );

        await localeFile.appendFile('};\n');

        console.log(`Object "localeLoaders" written in file "${LOCALES_PATH}" successfully`);
    } catch (error) {
        console.error(error);
    }
})();
