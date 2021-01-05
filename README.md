# l10n – a versatile and super-lightweight localisation library

With this library, you can build multilingual frontend application with very little overhead. It weights only ~1.5kb minified and compressed and has a lot of nice features.

The killer feature of this library however, is the [extraction tool](https://github.com/lxg/l10n-tools) which will scan your source code for translatable messages merge them into your dictionary. Of course, it will retain existing translations, so you will never again have to manually extract and merge your translations!

Under the hood, the library uses the [Gettext .po files](https://en.wikipedia.org/wiki/Gettext) as an intermediate format which you or your translators can edit. From those human-readable .po files, the actual size-optimised dictionaries are generated.

- Super small footprint: only 660 bytes (yes, bytes!) minified, ~370 bytes compressed on the wire
- Support for on-the-fly locale switching
- Great pluralisation support, in almost all languages worldwide.
- Support for message contexts (e.g. “amount” has different meanings, which translate to different words in other languages)
- By using the original message as catalog ID, you always have an English fallback, where a translation doesn’t exist.
- The `.po` catalog format is widely supported, so you will always find translators, tools and services which can work with your catalog files.

## Usage

### 1. Installation

This package is available via NPM:

```shell
npm install --save @lxg/l10n
npm install --save-dev @lxg/l10n-tools
```

### 2. Import and Instantiate

First, import the library into your application:

```js
// as ESmodule
import L10n from "@lxg/l10n"

// as CommonJS
const L10n = require("@lxg/l10n").default
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

The [@lxg/l10n-tools library](https://github.com/lxg/l10n-tools) provides a set of tools to extract translatable string from your code base into `.po` files and, after the `.po` files have been translated, will generate a JSON translations table.

The `npx l10n` tool is the CLI frontend to the catalog manager. Have a look at its  [documentation](https://github.com/lxg/l10n-tools)  to learn more.

### 5. Finally: Getting translated strings in your UI

At this point you should have generated your JSON dictionary with the catalog manager. Assuming you have specified `./l10n/translations.json` as the dictionary file, you can now load it in your applcation and pass it to the translator.

Loading the JSON can be a bit tricky, depending on the tools you have at hand. The easiest way is to use a bundler like Parcel or Rollup. It lets you import the JSON file synchronously, just like a JS file:

```js
// as an ESmodule, may require a plugin for your bundler
import translations from "./l10n/translations.json"

// as CommonJS
const translations = require("./l10n/translations.json")
```

Now you can pass the dictionary to the `L10n` constructor as the first parameter:

```js
const l10n = new L10n(translations, "de-DE")
```

NOTE: If other modules/classes also need translations, you can either pass the `l10n` instance to them, or load the library and the JSON dictionary there again. Keep in mind that the latter might increase the size of your build artifact.

## The `date.js` tool

If you’re working with dates, you will face two additional problems:

1. You want the structure of the date expression to match the locale (e.g. `Y-m-d` in English and `d.m.Y` in German),
2. You want month and weekday names to be translated *within* such an expression.

This is solved by the `date.js` module. Consider the following example, especially how the functions are arranged to produce the desired output:

```js
import l10n from "@lxg/l10n"
import date from "@lxg/l10n/date"
import translations from "./l10n/translations.json"

const l10n = new L10n(translations, "de-DE")

// English: Today is April 23, 2019.
// German: Heute ist der 23. April 2019.
sprintf(l10n.t("Today is %s."), date.fmt(new Date(2019, 3, 23), l10n.t("F j, Y")))
```

The `date.js` module also provides a few functions to get translated month/weekday names:

- **`date.getMonths()`**: Returns a list of month names in the current locale: “January”, “February”, …
- **`date.getMonthsShort()`**: Returns a list of short month names in the current locale: “Jan”, “Feb”, …
- **`date.getWeekdays()`**: Returns a list of weekday names in the current locale: “Monday”, “Tuesday”, …
- **`date.getWeekdaysShort()`**: Returns a list of short weekday names in the current locale: “Mon”, “Tue”, …
