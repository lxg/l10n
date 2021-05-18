import * as fs from 'fs'
import acorn from 'acorn-loose'
import walk from 'acorn-walk'
import fg from "fast-glob"
import { getProjectRootDir } from "./helpers.mjs"

/**
 * extracts translatable strings from JavaScript files
 * @param string[] globs list of glob expressions
 * @param string _instanceName name of the L10n instance ("l10n" by default)
 * @return object[] list of found entries
 */
export default function(globs, instanceName) {
    const cwd = getProjectRootDir()
    const entries = []

    globs.forEach(glob => {
        fg.sync(glob, { cwd }).forEach(fileName => {
            const file = fs.readFileSync(fileName)
            const relName = fileName.replace(cwd, "")

            entries.push(...getFileEntries(relName, file, instanceName))
        })
    })

    return entries
}

function getFileEntries(fileName, file, instanceName) {
    const entries = []
    const ast = acorn.LooseParser.parse(file, { sourceType : "module", locations : true })

    walk.full(ast, node => {
        if (node.type === "CallExpression"
            && node.callee.type === "MemberExpression"
            && instanceName === getInstanceName(node.callee))
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
