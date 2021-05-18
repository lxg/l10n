import * as fs from 'fs'
import Ajv from 'ajv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const schema = JSON.parse(fs.readFileSync(`${__dirname}/schema.json`).toString())

export function getProjectRootDir() {
    let current = process.env.PWD
    let found = false

    while (!found) {
        if (fs.existsSync(`${current}/package.json`))
            found = true;
        else
            current = dirname(current)
    }

    return current
}

export function getConfig() {
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const config = JSON.parse(fs.readFileSync(`${getProjectRootDir()}/package.json`)).l10n

    if (!validate(config))
    {
        throw new Error("The l10n configuration in your package.json is invalid: " + JSON.stringify(validate.errors, null, 4))
    }

    config.directory = config.directory || "l10n"
    config.instance = config.instance || "l10n"

    return config
}
