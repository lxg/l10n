# l10n – a versatile and super-lightweight localisation library

With this library, you can build multilingual frontend application with very little overhead. It weights less than 1kB minified and compressed, and it has lots of nice features.

The killer feature of this library however, is the `npx l10n` tool which will scan your source code for translatable messages merge them into your dictionary. Of course, it will retain existing translations, so you will never again have to manually extract and merge your translations!

Under the hood, the library uses the [Gettext .po files](https://en.wikipedia.org/wiki/Gettext) as an intermediate format which you or your translators can edit. From those human-readable .po files, the actual size-optimised dictionaries are generated.

- Super small footprint: only adds 660 bytes to your build (yes, bytes!) minified, ~370 bytes compressed on the wire (only l10n.js; without date.js and translations).
- Support for on-the-fly locale switching.
- Great pluralisation support, in almost all languages worldwide.
- Support for message contexts (e.g. “amount” has different meanings, which translate to different words in other languages)
- By using the original message as catalog ID, you always have an English fallback, where a translation doesn’t exist.
- The `.po` catalog format is widely supported, so you will always find translators, tools and services which can work with your catalog files.

## Usage

### 0. Quick Start

For the impatient, or if you already have experience with the library, here are the main steps in a nutshell.

- You need a bundler like [Rollup](https://rollupjs.org/) or Webpack in your project.
- Install the library to your project with `npm i @lxg/l10n`.
- Add the `l10n` config to your `package.json` and set the correct values (see below).
- Run the extractor/compiler with `npx l10n -ec` to create the PO message catalogs and the translation tables.
- Add the imports of the library and the `translations.json` to your code.
- Create an instance of the `L10n` class and start wrapping your messages in the translation functions.
- Run the extractor/compiler with `npx l10n -ec` as often as needed in order to update message catalogs and translation tables.
- If you have a TSX/JSX/Typescript project, you need to get to run the extractor over your compiled output, because its parser only reads pure JavaScript at this point.

In case you don’t know what these steps mean in detail, please read the detailled documentation below.

### 1. Installation

This package is available via NPM:

```shell
npm i @lxg/l10n
```

### 2. Import and Instantiate

First, import the library into your application:

```js
import L10n from "@lxg/l10n"
```

Now you can create an instance of your translator:

```js
const l10n = new L10n({}, "de-DE")
```

(Ignore the `{}` argument for now, we will replace it with something useful later.)

### 3. Preparing Message Strings

To make your code translation-ready, you can simply wrap all UI strings into one of the three translation functions `l10n.t`, `l10n.x` and `l10n.n` (see “Translation Functions” below).

For example, the following usage of `l10n.t` tells the library that `Hello World!` is a string to be translated.

```js
console.log(l10n.t("Hello World!"))
```

The following also works:

```js
console.log(`=== ${l10n.t("Template strings are awesome!")} ===`)
```

Or how about JSX/TSX?

```jsx
<span>{l10n.t("Also works with JSX!")}</span>
```

#### Translation Functions

There are three translation functions you can use in your code:

- **`l10n.t(message)`**: This function simply looks for a translated string in the translation table. If it finds one, it returns the translation; otherwise it returns the original string.

- **`l10n.x(context, message)`**: This function scopes the message to a context. This is useful when two original strings have different meanings and will most likely require different translations.

    For example, in a financial context, the English word “amount” would translate to the German „Betrag“, while in a context where items are counted, the German translation would be „Anzahl“. Prefixing the translation with a context allows translators to add both translations.

- **`l10n.n(singular_message, plural_message, count)`**: The n() function is the pluralisation function. It takes three parameters: The English singular, the English plural, and the actual number it refers to. The function uses “pluralisation rules” to determine the correct form in the target language. For example, many languages have more than two plural forms, and this function will select the correct one.

    NOTE: This function will not fill in the value into the placeholder in the plural form, but only return the correct message. See below for a simple sprintf() implementation to do the substitution for you.

#### Simple `sprintf()` implementation

To fill the placeholders in translations, especially pluralisations, you can use something like `sprintf()`. This is not part of the l10n library, but you can use the following super-simple `sprintf()` implementation:

```js
const sprintf = (format, ...args) => {
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

### 4. Extracting message strings and generating translation tables

The *catalog manager* is a CLI tool and has two tasks:

1. It extracts all translatable strings into a `.po` catalog.
2. It compiles translation tables as lightweight JSON objects.

The `npx l10n` tool is the CLI frontend to the catalog manager.

### Setup

Before you can start using the catalog manager, you must add some configuration to your project’s `package.json` file:

```json
{
    "l10n": {
        "directory": "l10n",
        "instance": "l10n",
        "locales": [
            "de-DE",
            "fr-FR"
        ],
        "sources": [
            "main.js",
            "other.js",
            "src/*"
        ],
        "targets": {
            "l10n/translations.json": [
                "first.js",
                "src/*"
            ]
        }
    }
}
```

The `directory` key specifies where the translations catalogs will be stored. It is optional and defaults to `l10n`.

The `instance` key specifies the variable name of your instance of the `L10n` class. It is optional and defaults to `l10n`. It can also reflect a deeper structure suche as `this.l10n`, `some.object.l10n` or even multiple values like `["this.l10n", "some.object.l10n"]`.

The `locales` key specifies the locales into which your package should be translated. The format for locales is: two lowercase letters for the language, followed by a hyphen (not an underscore!), followed by two uppercase letters for the region/country. NOTE: This tool assumes the `en-GB` locale as default, therefore you don’t need to add it.

The `sources` key contains a list which specifies the files to be considered for the catalog. Each item in this list can either be a verbatim file name or a glob expression.

The `targets` key is an object, where each entry is a target file for the JSON dictionary mapped to a list of sources. Each item in this list can either be a verbatim file name or a glob expression. By mapping the output target to a subset of the source files, we can build multiple translation dictionaries for different parts of your application, allowing smaller downloads e.g. in lazy-loading setups.

### Extracting Message Strings

You can now call `npx l10n --extract` to extract translatable messages in the `l10n.t`, `l10n.n`, `l10n.x` functions from your source files. This will generate one or more `.po` files in the location you provided as `directory` in your config. Note: The extractor will remove obsolete translations from the dictionary in order to avoid stuffing unneeded translations in the output table.

After translating the strings in the `.po` files, you can generate the output table(s) with `npx l10n --compile`. This will create the JSON tables at the locations specified in your config. Important: Do *NOT* modify the JSON files directly! They will be overwritten next time you run the `npx l10n --compile` command.

You can also combine the extract and compile commands by running `npx l10n --extract --compile`, or use the shorthand `npx l10n -ec`.

*PLEASE NOTE: The extraction tool cannot parse TSX/JSX or Typescript files. In these cases, you should first transpile the native JS code, and then reference the generated output as sources in your `package.json`.*

### Workflow and Source Control

Assuming you are using the configuration from the above example, the extractor will create or update the catalogs for German and French. Catalogs would be stored in the `./l10n` directory. So after running the command for the first time, you will find the new files `./l10n/de-DE.po` and `./l10n/fr-FR.po` in your project.

The `*.po` files can be given to a human translator or be run through a translation tool which supports this format (there are lots of them). After the `.po` files have been updated, you can run `npx l10n` again, to create the translation dictionaries.

All .po files and JSON dictionaries should be put under version control.

### Non-JavaScript Sources

This tool uses a JavaScript parser ([Acorn](https://github.com/acornjs/)) to find translatable strings in the source files. If you want to process TypeScript, TSX, JSX or other formats which cannot be processed by the parser, you must first generate the native JS code from them, and then reference the generated output as sources.

## Using the Translation Tables

After the .po files have been translated and the translation tables have been generated, you can use them in your code base.


### 5. Finally: Getting translated strings in your UI

At this point you should have generated your JSON translation tables with the catalog manager. Assuming you have specified `./l10n/translations.json` as the translation file, you can now load it in your applcation and pass it to the translator.

Loading the JSON can be a bit tricky, depending on the tools you have at hand. The easiest way is to use a bundler like Parcel or Rollup. It lets you import the JSON file synchronously, just like a JS file:

```js
// as an ESmodule, may require a plugin for your bundler (e.g. @rollup/plugin-json)
import translations from "./l10n/translations.json"
```

Now you can pass the translation table to the `L10n` constructor as the first parameter:

```js
const l10n = new L10n(translations, "de-DE")
```

NOTE: If other modules/classes also need translations, you can either pass the `l10n` instance to them, or load the library and the JSON translation table there again. Keep in mind that the latter might increase the size of your build artifact.

## The `date.js` tool

If you’re working with dates, you will face two additional problems:

1. You want the structure of the date expression to match the locale (e.g. `Y-m-d` in English and `d.m.Y` in German),
2. You want month and weekday names to be translated *within* such an expression.

This is solved by the `date.js` module.

Consider the following example, especially how the functions are arranged to produce the desired output:

```js
import L10n from "@lxg/l10n"
import L10nDate, { L10nDateFormat }  from "@lxg/l10n/date"
import from "@lxg/l10n/date"
import translations from "./l10n/translations.json"

const l10n = new L10n(translations, "de-DE")
const l10nDate = new L10nDate(l10n)
const l10nDateFormat = new L10nDateFormat(l10n)

// English: Today is April 23, 2021.
// German: Heute ist der 23. April 2021.
sprintf(l10n.t("Today is %s."), l10nDate.fmt(new Date(2021, 3, 23), l10n.t("F j, Y")))
```

The `date.js` module also provides a few functions to get translated month/weekday names:

- **`l10nDate.getMonths()`**: Returns a list of month names in the current locale: “January”, “February”, …
- **`l10nDate.getMonthsShort()`**: Returns a list of short month names in the current locale: “Jan”, “Feb”, …
- **`l10nDate.getWeekdays()`**: Returns a list of weekday names in the current locale: “Monday”, “Tuesday”, …
- **`l10nDate.getWeekdaysShort()`**: Returns a list of short weekday names in the current locale: “Mon”, “Tue”, …
- **`l10nDate.getFirstDayOfWeek()`**: Returns the first day of the week, 0: Sunday, 1: Monday, 5: Friday, 6: Saturday
- **`l10nDate.shiftWeekdays()`**: To be used together with one of the weekdays functions to get the localized order of days, e.g. `l10nDate.shiftWeekdays(l10nDate.getMonthsShort())`

### Config changes

Translations of localised weekday/month names will be automatically added to your translations table, based on the locales you have configured. This is achieved by adding the `l10n:date:*` pseudo-paths to the config in your package.json file (make sure to only use the ones you need):

```json
{
    "l10n": {
        "targets": {
            "l10n/translations.json": [
                "src/*",
                "l10n:date:firstday",
                "l10n:date:months",
                "l10n:date:monthsShort",
                "l10n:date:days",
                "l10n:date:daysShort"
            ]
        }
    }
}
```
