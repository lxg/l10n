import htmlparser from 'node-html-parser'
import L10n from "./l10n.js"

export default function(html, translations, locale) {
    const l10n = new L10n(translations, locale)

    if (html.indexOf("<l10n:") > -1) {
        const root = htmlparser.parse(html)
        const nodes = root.querySelectorAll('l10n\\:t, l10n\\:x, l10n\\:n')

        nodes.forEach(node => {
            if ((node.rawTagName === "l10n:t" || node.rawTagName === "l10n:x") && node.childNodes.length === 1 && node.childNodes[0].constructor.name === "TextNode") {

                let trans = (node.rawTagName === "l10n:t")
                    ? l10n.t(node.childNodes[0]._rawText)
                    : l10n.x(node.attributes["#context"], node.childNodes[0]._rawText)

                Object.keys(node.attributes).forEach(key => {
                    trans = trans.replace(`%${key}%`, node.attributes[key])
                })

                node.replaceWith(trans)
            }
            else if (node.rawTagName === "l10n:n") {
                const singular = node.querySelector("l10n\\:singular")
                const plural = node.querySelector("l10n\\:plural")

                if (singular.childNodes.length === 1 && singular.childNodes[0].constructor.name === "TextNode" && plural.childNodes.length === 1 && plural.childNodes[0].constructor.name === "TextNode") {
                    let trans = l10n.n(singular.childNodes[0]._rawText, plural.childNodes[0]._rawText, node.attributes["#num"])

                    Object.keys(node.attributes).forEach(key => {
                        trans = trans.replace(`%${key}%`, node.attributes[key])
                    })

                    node.replaceWith(trans)
                }
            }
        })

        html = root.toString()
    }

    return html
}
