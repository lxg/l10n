import plurals from "./plurals.js"
import { getLocaleData } from "@lxg/l10n-cldr"

export default async function(sourceFiles, extras, catalogs) {
    const table = {}

    for (const locale of Object.keys(catalogs)) {
        table[locale] = table[locale] || {
            p : plurals(locale, true),
            t : {}
        }

        Object.keys(catalogs[locale].translations).forEach(context => {
            Object.keys(catalogs[locale].translations[context]).forEach(msgid => {
                if (msgid) {
                    const entry = catalogs[locale].translations[context][msgid]
                    const isContained = entry.locations && entry.locations.filter(location => sourceFiles.includes(location.file)).length;

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
            const en = await getLocaleData("en")
            const loc = await getLocaleData(locale)

            extras.forEach(extra => {
                const type = extra.replace(/^.*:/, "")


                if (type === "firstday") {
                    table[locale].t["_\u00041"] = loc.firstday + ""
                } else if (["days", "daysShort", "months", "monthsShort", "countries"].includes(type)) {
                    const cldr = {}

                    Object.keys(en[type]).forEach(idx => {
                        cldr[`_\x04${en[type][idx]}`] = loc[type][idx]
                    })

                    table[locale].t = {...table[locale].t, ...cldr}
                }
            })
        }
    }

    return table
}
