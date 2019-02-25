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
npm install --save @aguensche/l10n
```

Depending on how you manage your dependencies, you must use a different path for importing. For example, with recent versions of ParcelJS, using the built-in development server, the following should work:

```
import l10n from "node_modules/@aguensche/l10n/l10n.js";
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

This is of course just a very basic example. You may want to use a more sophisticated implementation of `sprintf` (e.g. with support for positional parameters) in your project.

Use it like this:

```js
// Simple placeholder for a name
sprintf(l10n.t("Hello %s!"), "John Doe");

// Pluralisation. Note that you must pass the number twice: Once to n() and
// once to sprintf()
sprintf(l10n.n("One apple", "%s apples", 4), 4);
```

### Switching the locale

The locale can be switched by calling the `setLocale` function. This means you can implement your own language switcher and let it trigger the locale switching. Here’s an example of a very simple switcher component:

```js
class LocaleSwitcher extends HTMLElement
{
    constructor()
    {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback()
    {
        this.shadow.innerHTML = `
            <style>
            span { cursor : pointer }
            </style>
            <span data-locale="de-DE">🇩🇪</span>
            <span data-locale="en-US">🇬🇧</span>
        `;

        this.shadowRoot.querySelectorAll("span").forEach(elem => elem.addEventListener(
            "click",
            () => l10n.setLocale(elem.getAttribute("data-locale"))
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

## The catalog manager

l10n comes with a *catalog manager* which is a CLI tool and has two tasks: It extracts all translatable strings into a `.po` catalog, and it builds translation tables which you can deliver as ES6 modules to the browser.

The catalog manager needs PHP >= 7.1 and [Composer](https://getcomposer.org/) it your development environment. Why do we use PHP in a JavaScript module? Because of the great [Gettext implementation](https://github.com/oscarotero/Gettext) which provides very powerful tools for managing translations. I wasn’t able to find something similar written in JavaScript, so for now we will be using PHP.

### Installing the catalog manager

If you haven’t already, install PHP and [Composer](https://getcomposer.org/). Then install the dependencies for the catalog manager.

```bash
composer install
```

(NOTE: We assume that Composer is installed globally and without the `.phar` extension, e.g. as `/usr/bin/composer`. Depending on your installation, you may need to adapt the path.)

Now you can use the `bin/catalog` tool which is the CLI frontend to the catalog manager.

### Extracting messages

Extracting messages works with the `bin/catalog extract` command. It will go through all your JavaScript files, find occurences of our Gettext functions and add them to one catalog per locale. The great thing is that it will keep existing translations, so you can simply run it as often as you want.

```bash
bin/catalog extract --locale de-DE --locale fr-FR
```

The above command will create or update the catalogs for German and French. Catalogs reside in the `./l10n` directory. So after running the command for the first time, you will find the new files `./l10n/de-DE.po` and `./l10n/fr-FR.po` in your project. Don’t forget to put them under version control.

Of course, you can also specify the target languages in your `package.json` file. Simply add the `l10n` key and add a `locales` entry with an array of your locales, for example:

```json
{
  "l10n" : {
      "locales" : ["de-DE", "fr-FR"]
  }
}
```

After that, you can run the `catalog extract` command without parameter:

```bash
bin/catalog extract
```

### Creating the translations table

**TODO**

*The implementation is not ready yet, therefore documentation has to wait, too. :)*
