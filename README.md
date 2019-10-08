# l10n – a lightweight gettext implementation in pure ES6

This library is a lightweight implementation of the [Gettext internationalisation tools](https://en.wikipedia.org/wiki/Gettext). It is written in pure ES6, does not have any dependencies and is written with Web Components in mind.

The [Gettext system](https://www.gnu.org/software/gettext/) has some nice advantages: It has great pluralisation support, it can handle message contexts, and by using the original message as catalog ID, you always have an (English) fallback, even if a given translation doesn’t exist. What’s also great is that the `.po` catalog format has very widespread industry support, so you will always find translators, tools and even auto-translate services which can work with your catalog files without knowlegde of this library or even programming at all.

Why do we need yet another JS Gettext implementation, aren’t there enough already? Mostly, because this one provides an *extractor* to collect all translatable strings from your code base and merges them with existing translations.

It also has a few additional advantages:

- Super small footprint: only 1.3 kB compressed/minified
- No runtime dependencies
- Pure ES6: No RequireJS/CommonJS/AMD overhead
- Large variety of pluralisation rules, especially where `n != 1` doesn’t work
- Context-aware translations
- Support for automated translation services
- On-the-fly locale switching
- Uses the user agent’s preferred language by default

## Installation

This package is available via NPM:

```shell
npm install --save @tuicom/l10n
npm install --save-dev @tuicom/l10n-tools
```

(For more about `@tuicom/l10n-tools` see below.)

## Usage

### Importing the library

There are two ways to use the library in your own code: Either by using a bundler which is aware of node packages (e.g. Parcel), or by direct path-based ES6 import:

```js
// Bundler (NOTE: must support import/export syntax)
import L10n from "@tuicom/l10n/l10n"

// Pure ES6 (exact path depends on your file’s location)
import L10n from "./node_modules/@tuicom/l10n/l10n.mjs"
```

### Initialization

Now you can create an instance of your translator:

```js
const l10n = new L10n({}, "de-DE")
```

Ignore the first constructor argument `{}` for now, we will replace it with something useful later.

#### Preparing UI strings

To make your code translation-ready, you can simply wrap all UI strings into one of the three translation functions `l10n.t`, `l10n.x` and `l10n.n`.

For example, the following usage of `l10n.t` tells the library that `Hello World!` is a string to be translated.

```js
console.log(l10n.t("Hello World!"))
```

The following also works:

```js
console.log(`=== ${l10n.t("Template strings are awesome!")} ===`)
```

There are three translation functions you can use in your code:

```js
// The t() function simply looks for a translated string in the translation table.
// If it finds one, it returns the translation; otherwise it returns the original
// string.
l10n.t("Hello World!")

// The x() function scopes the message to a context. This is useful when two
// original strings have different meanings and will most likely require
// different translations.
//
// For example, in a financial context, the English word “amount” would translate
// to the German „Betrag“, while in a context where items are counted, the German
// translation would be „Anzahl“. Prefixing the translation with a context allows
// translators to add both translations.
//
// But how do you know when to use t() or x()? The answer is: You don’t. You will
// usually start with t() and, at some point, a translator or a user of your software
// will inform you that there are two messages with different meanings in the target
// language. Then you will simply fix one or both occurences in your code with the x()
// function.
l10n.x("monetary" "Amount")
l10n.x("item count" "Amount")

// The n() function is the pluralisation function. It takes three parameters: The
// English singular, the English plural, and the actual number it refers to. The
// function uses “pluralisation rules” to determine the correct form in the target
// language. For example, many languages have more than two plural forms, and this
// function will select the correct one.
//
// NOTE: This function will not fill in the value into the placeholder in the
// plural form, but only return the correct message. See below for a simple
// sprintf() implementation to do the substitution for you.
l10n.n("One apple", "%s apples", 4)
```

#### Simple `sprintf()` implementation

To fill the placeholders in translations, especially pluralisations, you can use something like `sprintf()`. This is not part of the l10n library, but you can use the following super-simple `sprintf()` implementation:

```js
let sprintf = (format, ...args) => {
    let i = 0;
    return format.replace(/%s/g, () => args[i++]);
}
```

Use it like this:

```js
// Simple placeholder for a name
sprintf(l10n.t("Hello %s!"), "John Doe")

// Pluralisation. Note that you must pass the number twice: Once to n() and
// once to sprintf()
sprintf(l10n.n("One apple", "%s apples", 4), 4)
```

This is of course just a very basic example. You may want to use a more sophisticated implementation of `sprintf` (e.g. with support for positional parameters) in your project.

### Switching the locale

The locale can be switched at any time by calling the `setLocale` function. From that point on, the instance will switch to the translations in the selected locale.

#### Fallback locales

If a locale is selected for which no translations have been provided, and at the same time, there are translations for a different language with different locale, the tool will use the translations from that locale.

For example: If you have imported translations for the `de-DE` locale, but the selected locale is `de-AT` for which you don’t have translations, the tool will use the `de-DE` translations.

NOTE: The tool does *not* fill existing, but incomplete catalogs with entries from other locales. For example, if you do have a catalog for `de-AT`, but didn’t have it fully translated, the tool would not take existing translations from the `de-DE` catalog.

## Extracting message strings and generating translation tables

The [tuicom/l10n-tools library](https://github.com/tuicom/l10n-tools) provides a set of tools to extract translatable string from your code base into `.po` files and, after the `.po` files have been translated, will generate a JSON translations table.

The `npx l10n` tool is the CLI frontend to the catalog manager.

### Prequisites

The catalog manager needs PHP >= 7.1 in your development environment. Why do we use PHP in a JavaScript module? Because of the great [Gettext library by Oscar Otero](https://github.com/oscarotero/Gettext) which provides very powerful tools for managing translations. We weren’t able to find something similar written in JavaScript, so for now we will be using PHP.

### Extracting message strings

In the first step, we will create `.po` files, an open standard for translation catalogs, from the translatable strings in your code base, i.e. the ones we’ve wrapped in our `l10n.t`, `l10n.n` and `l10n.x` functions. You don’t need to do this by hand, we have a tool for this.

But first, you must add a bit of config to the project’s `package.json` file in the `l10n` key:

```json
{
    "l10n": {
        "directory": "l10n",
        "locales": [
            "de-DE",
            "fr-FR"
        ],
        "extract": [
            "one.js",
            "two.js",
            "three.js"
        ],
        "tables": {
            "l10n/translations.json": [
                "one.js",
                "two.js",
                "three.js"
            ]
        }
    }
}
```

- The `directory` key specifies where the translations catalogs will be stored.

- The `locales` key specifies the locales into which your package should be translated. The format for locales is: two lowercase letters for the language, followed by a hyphen (not an underscore!), followed by two uppercase letters for the region/country. NOTE: This tool assumes the `en-US` locale as default, therefore you don’t need to add it.

- The `extract` key contains a list which specifies the files to be considered for the catalog. Each item in this list can either be a verbatim file name or a regular expression (PCRE).

- The `tables` key contains an object, where each entry is a target file for the JSON table mapped to a list of source files. Each item in this list can either be a verbatim file name or a regular expression (PCRE). Each JSON file will contain the translations for *all* languages for all strings in the referenced source files. In the above example, we have only one JSON target file. But you could have *multiple* JSON tables per project as well, e.g. when parts of your application are lazy-loaded.

When you’re done configuring your locales and catalog source files, you can run the extractor. It will find all occurences of our translation functions and add them to one catalog per locale:

```js
npx l10n extract
```

Assuming you are using the configuration from the above example, the extractor will create or update the catalogs for German and French. Catalogs would be stored in the `./l10n` directory. So after running the command for the first time, you will find the new files `./l10n/de-DE.po` and `./l10n/fr-FR.po` in your project. Don’t forget to put them under version control.

The `*.po` files can be given to a human translator or be run through a translation tool which supports this format (there are lots of them). After the `.po` files have been updated, we can create the JSON translation tables.

In order to use the translations in your code, you must transform the `.po` files into JSON, which is done by the `tables` subcommand. This is done with the following command, createing the `l10n/translations.json` (if you used the example config from above):

```js
npx l10n tables
```

### Finally: Getting translated strings in your UI

First, you must load the JSON translations table. Loading the JSON can be a bit tricky, depending on the tools you have at hand.

The easiest way is to use a bundler like Parcel. It lets you import the JSON file synchronously, just like a JS file:

```js
// load the JSON (depending on your bundler, you may need to do this differently)
import translations from "./l10n/translations.json"
```

To make the translations available in your code, you must import the JSON from the `l10n/translations.json` file and pass it to the `L10n` constructor as the first parameter:

Loading the JSON file is a bit tricky. If you have a bundler like Parcel, being capable of importing JSON synchroneously, you are in luck and can do the following:

```js
import translations from "./l10n/translations.json"
const l10n = new L10n(translations, "de-DE")

// … other code working with the l10n instance
```

If you’re working with plain JavaScript, you must load the JSON file with `fetch` or XHR, which results in an aysnchronous structure:

```js
;(async () => {
    const response = await fetch('./l10n/translations.json')
    const translations = await response.json()
    const l10n = new L10n(translations, "de-DE")

    // … other code working with the l10n instance
})()
```

NOTE: If other modules/classes also need translations, you can/should pass the `l10n` instance to them.

## The `date.js` tool

If you’re working with dates, you will face two additional problems:

1. You want the structure of the date expression to match the locale (e.g. `Y-m-d` in English and `d.m.Y` in German),
2. You want month and weekday names to be translated *within* such an expression.

This is solved by the `date.js` module. Consider the following example, especially how the functions are arranged to produce the desired output:

```js
import l10n from "@tuicom/l10n/l10n"
import date from "@tuicom/l10n/date"
import translations from "./l10n/translations.json"

const l10n = new L10n(translations, "de-DE")

// English: Today is April 23, 2019.
// German: Heute ist der 23. April 2019.
sprintf(l10n.t("Today is %s."), date.fmt(new Date(2019, 3, 23), l10n.t("F j, Y")))
```

The `date.js` module also provides a few functions to get translated month/weekday names:

```js
// Returns a list of month names in the current locale: "January", "February", …
date.getMonths()

// Returns a list of short month names in the current locale: "Jan", "Feb", …
date.getMonthsShort()

// Returns a list of weekday names in the current locale: "Monday", "Tuesday", …
date.getWeekdays()

// Returns a list of short weekday names in the current locale: "Mon", "Tue", …
date.getWeekdaysShort()
```
