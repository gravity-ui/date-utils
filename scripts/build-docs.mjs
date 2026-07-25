// Builds the AI-facing docs tree (cleaned README + the diplodoc user-facing guides) into
// build/docs so an agent in a consumer project reads docs matching the installed version
// from node_modules/@gravity-ui/date-utils/build/docs. Appended to the build npm script.
//
// Note: the repo's docs/ is a separate typedoc+diplodoc *sub-project* (its own
// package.json, build scripts, generated API docs). Only the human-facing guide pages
// under docs/diplodoc/pages are shipped as AI guides here; the sub-project's build
// scripts, configs and generated output are intentionally excluded. Generated API docs
// are produced separately into dist-docs/ by `npm run docs:build`.
// Uses @gravity-ui/readme-validator's buildDocs().
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {buildDocs} from '@gravity-ui/readme-validator';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

buildDocs({
    rootDir: ROOT,
    outDir: path.join(ROOT, 'build', 'docs'),
    sources: [
        {
            title: 'Guides',
            kind: 'markdown',
            baseDir: 'docs/diplodoc/pages',
            outPrefix: 'guides',
            nameFromTitle: true,
        },
    ],
});
