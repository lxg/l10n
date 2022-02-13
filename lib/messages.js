import * as fs from 'fs'
import acorn from 'acorn-loose'
import walk from 'acorn-walk'
import fg from "fast-glob"
import * as htmlparser from 'node-html-parser'
import { getProjectRootDir } from './helpers.js'

/**
 * extracts translatable strings from JavaScript files
 *
 * @param string[] collections map of parser to list of glob expressions
 * @param string[] _instanceNames name of the L10n instance ("l10n" by default)
 * @return object[] list of found entries
 */
export default function(collections, instanceNames) {
    const cwd = getProjectRootDir()
    const entries = []

    // translate from simplified array format to actual object format
    if (collections instanceof Array) {
        collections = { js : collections }
    }

    Object.keys(collections).forEach(parser => {
        collections[parser].forEach(glob => {
            fg.sync(glob, { cwd }).forEach(fileName => {
                const file = fs.readFileSync(fileName)
                const relName = fileName.replace(cwd, "")

                // ATTENTION: The autodetection of HTML files via file extension will be removed with
                // the next major version. After that, the correct parser must be selected.

                if (fileName.endsWith(".html") || parser === "html")
                    entries.push(...getEntriesFromHtml(relName, file.toString(), instanceNames))
                else if (parser === "js")
                    entries.push(...getEntriesFromJs(relName, file, instanceNames))
            })
        })
    })

    return entries
}

function getEntriesFromHtml(fileName, file) {
    const entries = []

    if (file.indexOf("<l10n:") > -1) { // quick check before heavy operation
        const nodes = htmlparser.default.parse(file).querySelectorAll('l10n\\:t, l10n\\:x, l10n\\:n')

        nodes.forEach(node => {
            if ((node.rawTagName === "l10n:t" || node.rawTagName === "l10n:x") && node.childNodes.length === 1 && node.childNodes[0].constructor.name === "TextNode") {
                entries.push({
                    type: node.rawTagName === "l10n:t" ? "t" : "x",
                    context: node.attributes["#context"],
                    message: [ node.childNodes[0]._rawText ],
                    fileName,
                    position: { line: getLineNumber(file, node.range[0]) }
                })
            }
            else if (node.rawTagName === "l10n:n") {
                const singular = node.querySelector("l10n\\:singular")
                const plural = node.querySelector("l10n\\:plural")

                if (singular.childNodes.length === 1 && singular.childNodes[0].constructor.name === "TextNode" && plural.childNodes.length === 1 && plural.childNodes[0].constructor.name === "TextNode") {
                    entries.push({
                        type: "n",
                        message: [ singular.childNodes[0]._rawText, plural.childNodes[0]._rawText ],
                        fileName,
                        position: { line: getLineNumber(file, node.range[0]) }
                    })
                }
            }
        })
    }

    return entries
}

function getEntriesFromJs(fileName, file, instanceNames) {
    const entries = []
    const ast = acorn.LooseParser.parse(file, { sourceType : "module", locations : true })

    walk.full(ast, node => {
        if (node.type === "CallExpression"
            && node.callee.type === "MemberExpression"
            && instanceNames.includes(getInstanceName(node.callee)))
        {
            const position = node.callee.loc.start

            if (node.callee.property.name === "t")
            {
                validateSignature(fileName, position, "L10n.t", node.arguments, ["string"])

                entries.push({
                    type: "t",
                    message: [ node.arguments[0].value ],
                    fileName,
                    position
                })
            }

            if (node.callee.property.name === "x")
            {
                validateSignature(fileName, position, "L10n.x", node.arguments, ["string", "string"])

                entries.push({
                    type: "x",
                    context: node.arguments[0].value,
                    message: [ node.arguments[1].value ],
                    fileName,
                    position : position
                })
            }

            if (node.callee.property.name === "n")
            {
                validateSignature(fileName, position, "L10n.n", node.arguments, ["string", "string", null]) // third parameter can have different types

                entries.push({
                    type: "n",
                    message: [ node.arguments[0].value, node.arguments[1].value ],
                    fileName,
                    position: node.callee.loc.start
                })
            }
        }
    })

    return entries
}

function validateSignature(fileName, position, funcName, args, expected) {
    if (expected.length !== Object.keys(args).length)
        throw new SyntaxError(`Error in ${fileName}:${position.line} – The ${funcName} function expects exactly ${expected.length} arguments.`)

    expected.forEach((type, i) => {
        if (type && (args[i].type !== "Literal" || typeof(args[i].value) !== type))
            throw new SyntaxError(`The ${funcName} function expects Parameter #${i+1} to be a ${type}.`)
    })
}

function getInstanceName(node) {
    const name = []

    while (node) {
        if (!node.object)
            name.unshift(node.type === "ThisExpression" ? "this" : node.name)
        else
            name.unshift(node.property.name)

        node = node.object
    }

    return name.slice(0, -1).join(".")
}

function getLineNumber(body, index) {
    return (body.substring(0, index).match(/\n/g) || []).length + 1
}
