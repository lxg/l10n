import plurals from "./plurals.js"

/**
 * Merges the entries from an existing catalog with the ones found in the files.
 *
 * The new catalog will only contain the new entries. If an entry exists in the
 * catalog, but not in the entries, it will be removed. The catalog is only used
 * to maintain existing translations.
 *
 * @param  object old catalog, as generated by gettext-parse in gettext.js
 * @param  object entries, as generated by extract.js
 * @param  string the current locale of the catalog
 * @return object the new catalog
 */
export default function(oldCatalog, foundMessages, locale) {
    const catalog = { ...oldCatalog, translations : {} }

    Object.keys(foundMessages).forEach(i => {
        const foundMessage = foundMessages[i]
        const context = foundMessage.context || ""

        catalog.translations[context] = catalog.translations[context] || {}

        let catalogEntry = {
            msgid: foundMessage.message[0],
            msgstr: [],
            comments :  { reference : "" },
            locations: [] // we need this for our own “compiler”
        }

        // retain translations and comments from the old catalog
        if (oldCatalog.translations[context] && oldCatalog.translations[context][foundMessage.message[0]]) {
            const oldEntry = oldCatalog.translations[context][foundMessage.message[0]]
            catalogEntry.msgstr = oldEntry.msgstr

            if (oldEntry.comments && oldEntry.comments.translator)
                catalogEntry.comments.translator = oldEntry.comments.translator
        }

        //  retain references from other new entries
        if (catalog.translations[context] &&
            catalog.translations[context][foundMessage.message[0]] &&
            catalog.translations[context][foundMessage.message[0]].comments.reference
        ) {
            catalogEntry.comments.reference = catalog.translations[context][foundMessage.message[0]].comments.reference + "\n"
            catalogEntry.locations.push(...catalog.translations[context][foundMessage.message[0]].locations)
        }

        // add location references from previous entries
        catalogEntry.comments.reference += `${foundMessage.fileName}:${foundMessage.position.line}`
        catalogEntry.locations.push({ file : foundMessage.fileName, line : foundMessage.position.line })

        if (foundMessage.type === "n") {
            catalogEntry.msgid_plural = foundMessage.message[1]

            // prefill msgstr entries
            if (!catalogEntry.msgstr.length) {
                const localePlurals = plurals(locale)
                const num = parseInt(localePlurals.match(/nplurals=(\d+)/)[1])
                catalogEntry.msgstr = new Array(num).fill("")
            }
        }

        if (context) {
            catalogEntry.msgctxt = context
        }

        catalog.translations[context][catalogEntry.msgid] = catalogEntry
    })

    return catalog
}