import * as fs from 'fs'
import gettextParser from "gettext-parser"
import plurals from "./plurals.mjs"

export default function(dir, locales) {
    const catalogs = {}

    locales.forEach(locale => {
        const template = createCatalog(locale)
        const fileName = `${dir}/${locale}.po`

        if (fs.existsSync(fileName)) {
            const input = fs.readFileSync(fileName).toString("utf-8")
            catalogs[locale] = gettextParser.po.parse(input)

            // if headers are missing, add them
            catalogs[locale].headers = catalogs[locale].headers || []
            Object.keys(template.headers).forEach(header =>
                catalogs[locale].headers[header] =
                    catalogs[locale].headers[header] || template.headers[header])
        }
        else {
            catalogs[locale] = template
        }
    })

    return catalogs
}

export function createCatalog(locale) {
    return {
        "charset": "utf-8",
        "headers": {
            "Language": locale.replace("-", "_"),
            "Content-Type": "text/plain; charset=utf-8",
            "Plural-Forms": plurals(locale)
        },
        "translations": {}
    }
}
