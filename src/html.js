// This is to be used as a filter: Input is HTML with <l10n:t> wrapper tags, output is translated text without the wrapper tags.

import * as htmlparser from 'node-html-parser'
import L10n from "./l10n.js"

export default function(html, translations, locale) {
    const l10n = new L10n(translations, locale)
    const root = htmlparser.default.parse(html)
    const nodes = root.querySelectorAll('l10n\\:t, l10n\\:x, l10n\\:n')

    nodes.forEach(node => {
        if (node.childNodes.length === 1 && node.childNodes[0].constructor.name === "TextNode") {
            if (node.rawTagName === "l10n:t") {
                let trans = l10n.t(node.childNodes[0]._rawText)

                Object.keys(node.attributes).forEach(key => {
                    trans = trans.replace(`%${key}%`, node.attributes[key])
                })

                node.replaceWith(trans)
            }
        }
    })

    return root.toString()
}
