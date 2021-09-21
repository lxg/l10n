import compile from './compile.js'
import fg from "fast-glob"
import { getProjectRootDir } from './helpers.js'

export async function compileTranslations(catalogs, sources) {
    const rootDir = getProjectRootDir()

    // if sources are provided, we are going to only add them. Otherwise
    // compile the entire catalogs.

    let files, extras

    if (sources) {
        files = []
        extras = []

        sources.forEach(source => {
            if (source.startsWith("l10n:")) {
                extras.push(source.replace(/^.*?:/, ""))
            } else {
                files.push(...fg.sync(source, { cwd : rootDir }))
            }
        })
    }

    return await compile(catalogs, files, extras)
}

export * from './helpers.js'
export { default as getCatalogs } from './catalogs.js'
export { default as getMessages } from "./messages.js"
export { default as mergeMessagesIntoCatalog } from "./merge.js"
