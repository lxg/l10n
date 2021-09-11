#!/usr/bin/env node

import * as fs from 'fs'
import getopts from "getopts"
import html from "../dist/html.js"

const options = getopts(process.argv.slice(2), {
  alias: {
    help : "h",
    locale : "l",
    file : "f",
    translations : "t"
  }
})

if (options.help || (!options.translations && !options.locale && !options.file)) {
    process.stdout.write(`Usage: npx l10n-html [OPTIONS]

Translates texts in an HTML file, writing to STDOUT.

  -t, --translations  Path to the generated translations file.
  -f, --file          Path to the HTML file on which the operation is to be applied.
  -l, --locale        Locale in BCP 47 format (e.g. “de” or “de-DE”).
`)
}

if (!options.translations) {
    throw new Error("The path to a translations file must be provided.")
}

if (!options.locale) {
    throw new Error("The locale must be provided.")
}

if (!options.file) {
    throw new Error("The file must be provided.")
}

const file = fs.readFileSync(options.file).toString()
const translations = JSON.parse(fs.readFileSync(options.translations).toString())

process.stdout.write(html(file, translations, options.locale))
