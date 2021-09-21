#!/usr/bin/env node

import * as fs from 'fs'
import { dirname } from 'path'
import gettextParser from "gettext-parser"
import { compileTranslations, getCatalogs, getProjectRootDir, getConfig, getMessages, mergeMessagesIntoCatalog } from "../lib/index.js"


import getopts from "getopts"

const options = getopts(process.argv.slice(2), {
  alias: {
    help: "h",
    extract: "e",
    compile: "c"
  }
})

if (options.help || (!options.compile && !options.extract)) {
    process.stdout.write(`Usage: npx l10n [OPTION]

Extract translatable strings from source code and compile a translations table.

  -e, --extract     Extract translatable strings from source code.
  -c, --compile     Compile a translations table.
  -h, --help        Show this help.

Note: The file locations for extract/compile need to be configured in the package.json file.
`)

} else {
    // load config from project’s package.json
    const config = getConfig()

    // determine project’s root and catalog dir
    const rootDir = getProjectRootDir()
    const l10nDir = `${rootDir}/${config.directory}`

    // get already translated messages from the catalogs
    const catalogs = getCatalogs(l10nDir, config.locales)

    if (options.extract) {
        // extract current messages from the source files
        const messages = getMessages(config.sources, config.instance)

        // create new catalog from existing translations and current messages
        Object.keys(catalogs).forEach(locale => {
            catalogs[locale] = mergeMessagesIntoCatalog(catalogs[locale], messages, locale)
            fs.existsSync(l10nDir) || fs.mkdirSync(l10nDir, { recursive: true })
            fs.writeFileSync(
                `${l10nDir}/${locale}.po`,
                gettextParser.po.compile(catalogs[locale], {
                    foldLength : Number.MAX_SAFE_INTEGER  // setting very high value, because disabling folding causes headers to break
                }) + "\n"
            )
        })
    }

    if (options.compile) {
        // compile translation tables. Each table contains the translations for the files
        // specified in the sourceGlobs, with all languages.

        ;(async() => {
            if (config.targets) {
                for (const target of Object.keys(config.targets)) {
                    const table = await compileTranslations(catalogs, config.targets[target])
                    const targetFileName = `${rootDir}/${target}`
                    const targetDir = dirname(targetFileName)

                    fs.existsSync(targetDir) || fs.mkdirSync(targetDir, { recursive: true })
                    fs.writeFileSync(targetFileName, JSON.stringify(table, null, 2))
                }
            }
        })()
    }
}
