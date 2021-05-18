import plurals from "./plurals.mjs"
import * as fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const basedir = dirname(dirname(fileURLToPath(import.meta.url)))

export default async function(sourceFiles, extras, catalogs) {
    const table = {}

    for (const locale of Object.keys(catalogs)) {
        const lang = locale.substr(0, 2)
        const country = locale.substr(3, 2)

        table[locale] = table[locale] || {
            p : plurals(locale, true),
            t : {}
        }

        Object.keys(catalogs[locale].translations).forEach(context => {
            Object.keys(catalogs[locale].translations[context]).forEach(msgid => {
                if (msgid) {
                    const entry = catalogs[locale].translations[context][msgid]
                    const isContained = entry.locations.filter(location => sourceFiles.includes(location.file)).length;

                    if (isContained) {
                        const prefix = entry.msgctxt ? `${entry.msgctxt}\u0004` : ""
                        const key = `${prefix}${entry.msgid}`
                        const value = entry.msgid_plural ? entry.msgstr : entry.msgstr[0] || ""

                        table[locale].t[key] = value
                    }
                }
            })
        })

        // adding extra translations (currently only month/day names)
        if (extras) {
            let path = ""

            if (fs.existsSync(`${basedir}/cldr/${locale}.json`)) {
                path = `${basedir}/cldr/${locale}.json`
            } else if (fs.existsSync(`${basedir}/cldr/${lang}.json`)) {
                path = `${basedir}/cldr/${lang}.json`
            }

            if (path) {
                const dates = JSON.parse(fs.readFileSync(path))

                extras.forEach(extra => {
                    const type = extra.replace(/^.*:/, "")

                    if (type === "firstday") {
                        const firstdays = JSON.parse(fs.readFileSync(`${basedir}/cldr/_firstday.json`))
                        table[locale].t["_\u00041"] = firstdays[country] || "1"
                    } else if (["days", "daysShort", "months", "monthsShort"].includes(type)) {
                        table[locale].t = {...table[locale].t, ...dates[type]}
                    }
                })
            }
        }
    }

    return table
}
