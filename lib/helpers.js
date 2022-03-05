import * as fs from 'fs'
import Ajv from 'ajv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const schema = JSON.parse(fs.readFileSync(`${__dirname}/schema.json`).toString())

export function getProjectRootDir() {
    return dirname(process.env.npm_package_json)
}

export function getConfig() {
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const config = JSON.parse(fs.readFileSync(process.env.npm_package_json)).l10n

    if (!validate(config))
    {
        throw new Error("The l10n configuration in your package.json is invalid: " + JSON.stringify(validate.errors, null, 4))
    }

    config.directory = config.directory || "l10n"
    config.instance = Array.isArray(config.instance) ? config.instance : [config.instance || "l10n"]

    return config
}
