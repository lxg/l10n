# l10n – a lightweight gettext implementation in pure ES6

This library is a lightweight implementation of the Gettext internationalisation tools. It is written in pure ES6, does not have any dependencies and is written with Web Components in mind.

The Gettext system has some nice advantages: It has great pluralisation support, it can handle message contexts, and by using the original message as catalog ID, you always have an (English) fallback, even if a given translation doesn’t exist. What’s also great is that the `.po` catalog format has very widespread industry support, so you will always find translators, tools and even auto-translate services which can work with your catalog files without knowlegde of this library or even programming at all.

Why do we need yet another JS Gettext implementation, aren’t there enough already? Here’s why:

- Super small footprint: only 1.3 kB compressed/minified
- No dependencies
- Pure ES6: No RequireJS/CommonJS/AMD overhead
- Large variety of pluralisation rules, especially where `n != 1` doesn’t work
- Context-aware translations
- Extractor harvests all translatable strings into one .po file per language
- Support for automated translation services
- On-the-fly locale switching
- Automatically uses the user agent’s preferred language

## Usage

### Importing the library

#### Pure JS

The simplest way to use this tool is to add the `l10n.js` to your project and `import` it:

```js
import l10n from "./l10n.js";
```

Note that your own script must be loaded as a module (`type="module"`) for this to work:

```html
<script src="your-script.js" type="module"></script>
```

#### NPM

This package is also available via NPM:

```bash
npm install --save @tuicom/l10n
```

Depending on how you manage your dependencies, you must use a different path for importing. For example, with recent versions of ParcelJS, using the built-in development server, the following should work:

```
import l10n from "node_modules/@tuicom/l10n/l10n.js";
```

### Translating strings

There are three translation functions you can use in your code:

```js
// The t() function simply translates a string
l10n.t("Hello World!");

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
l10n.x("monetary" "Amount");
l10n.x("item count" "Amount");

// The n() function is the pluralisation function. It takes three parameters: The
// English singular, the English plural, and the actual number it refers to. The
// function uses “pluralisation rules” to determine the correct form in the target
// language. For example, many languages have more than two plural forms, and this
// function will select the correct one.
//
// NOTE: This function will not fill in the value into the placeholder in the
// plural form, but only return the correct message. See below for a simple
// sprintf() implementation to do the substitution for you.
l10n.n("One apple", "%s apples", 4);
```

#### Simple `sprintf()` implementation

To fill the placeholders in translations, especially pluralisations, you can use something like `sprintf()`. This is not part of the l10n library, but you can use the following super-simple `sprintf()` implementation:

```js
let sprintf = (format, ...args) => {
    let i = 0;
    return format.replace(/%s/g, () => args[i++]);
};
```

Use it like this:

```js
// Simple placeholder for a name
sprintf(l10n.t("Hello %s!"), "John Doe");

// Pluralisation. Note that you must pass the number twice: Once to n() and
// once to sprintf()
sprintf(l10n.n("One apple", "%s apples", 4), 4);
```

This is of course just a very basic example. You may want to use a more sophisticated implementation of `sprintf` (e.g. with support for positional parameters) in your project.

### Switching the locale

The locale can be switched by calling the `setLocale` function. This means you can implement your own language switcher and let it trigger the locale switching. Here’s an example of a very simple switcher component:

```js
class LocaleSwitcher extends HTMLElement
{
    connectedCallback()
    {
        this.innerHTML = `
            <style>
            span { cursor : pointer; }
            </style>
            <span data-locale="de-DE">🇩🇪</span> <span data-locale="en-US">🇬🇧</span>
        `;

        this.querySelectorAll("span").forEach(elem => elem.addEventListener(
            "click",
            () => document.dispatchEvent(new CustomEvent(
                "l10n.locale.set",
                { detail : { locale : elem.getAttribute("data-locale") } }
            ))
        ));
    }
}

customElements.define('locale-switcher', LocaleSwitcher);
```

After `setLocale` has switched the locale internally, it will trigger the `l10n.locale.switch` event on the `document` element. Therefore, you can add an event listener in your element’s constructor and re-create the element.

```js
document.addEventListener("l10n.locale.switch", () => this.connectedCallback());
```

> ATTENTION: If you have multiple nested elements, you should only trigger re-rendering on the topmost element.

### Date formatting

If you’re working with dates, you will face two additional problems:

1. You want the structure of the date expression to match the locale (e.g. `Y-m-d` in English and `d.m.Y` in German),
2. You want month and weekday names to be translated *within* such an expression.

This is solved by the `date.js` module. Consider the following example, especially how the functions are arranged to produce the desired output:

```js
import l10n from "./l10n.js";
import date from "./date.js";

// English: Today is April 23, 2019.
// German: Heute ist der 23. April 2019.
sprintf(l10n.t("Today is %s."), date.fmt(new Date(2019, 3, 23), l10n.t("F j, Y")))
```

The `date.js` module also provides a few functions to get translated month/weekday names:

```js
// Returns a list of month names in the current locale: "January", "February", …
date.getMonths();

// Returns a list of short month names in the current locale: "Jan", "Feb", …
date.getMonthsShort();

// Returns a list of weekday names in the current locale: "Monday", "Tuesday", …
date.getWeekdays();

// Returns a list of short weekday names in the current locale: "Mon", "Tue", …
date.getWeekdaysShort();
```

## The catalog manager

l10n comes with a *catalog manager* which is a CLI tool and has two tasks: It extracts all translatable strings into a `.po` catalog, and it builds translation tables which you can deliver as ES6 modules to the browser.

The catalog manager needs PHP >= 7.1 and [Composer](https://getcomposer.org/) it your development environment. Why do we use PHP in a JavaScript module? Because of the outstanding [Gettext library by Oscar Otero](https://github.com/oscarotero/Gettext) which provides very powerful tools for managing translations. I wasn’t able to find something similar written in JavaScript, so for now we will be using PHP.

### Installing the catalog manager

If you haven’t already, install PHP and [Composer](https://getcomposer.org/). Then install the dependencies for the catalog manager.

```bash
composer install
```

(NOTE: We assume that Composer is installed globally and without the `.phar` extension, e.g. as `/usr/bin/composer`. Depending on your installation, you may need to adapt the path.)

Now you can use the `node_modules/.bin/catalog` tool which is the CLI frontend to the catalog manager.

### Extracting messages

Extracting messages works with the `node_modules/.bin/catalog extract` command. It will go through all your JavaScript files, find occurences of our Gettext functions and add them to one catalog per locale.

But first, you must specify the target languages in your `package.json` file. Simply add the `l10n` key and add a `locales` entry with an array of your locales, for example:

```json
{
  "l10n" : {
      "locales" : ["de-DE", "fr-FR"]
  }
}
```

> NOTE: The `en-US` locale is used as the default locale. This means that adding the `en-US` locale to the `locales` list will be ignored.

Now you can run

```bash
node_modules/.bin/catalog extract
```

Assuming you have `"locales" : ["de-DE", "fr-FR"]`, the above command will create or update the catalogs for German and French. Catalogs reside in the `./l10n` directory. So after running the command for the first time, you will find the new files `./l10n/de-DE.po` and `./l10n/fr-FR.po` in your project. Don’t forget to put them under version control.

### Creating the translations table

The `node_modules/.bin/catalog table` command will create one or more translations files which you can use in your application. In your `package.json` file, add a `tables` key to the `l10n` entry. The `tables` key contains a map of a target file name and a list of source files. The source file entries may contain globbing patterns.

```json
{
    "l10n": {
        "tables": {
            "translations.js": [
                "main.js",
                "other.js",
                "node_modules/@foo/bar/*.js"
            ]
        }
    }
}
```

Now you can run the `node_modules/.bin/catalog table` command, and it will create a custom translations file. This file can be embedded in your application as a module:

```HTML
<script type="module" src="/translations.js" async></script>
```

#### How it works internally

The `node_modules/.bin/catalog table` command tries to find the translation catalogs of the packages to which each file belongs.

- First, it resolves all glob patterns and creates a list of files for which you want to add translations.
- For each file, it traverses the directory tree until it finds a `package.json` file, and will look for a `l10n` directory where it expects to find the `.po` files.
- If it finds `.po` files, it will create a small “template” PO catalog and merge the package’s translations into this file, so that it contains only the translations for this file.
- At the end, all translations of all files for a given locale are merged into one large locale-specific catalog.
- Finally, it will create the translation target file(s) with all translations for the files referenced there.

### A note on version control

**TODO**
