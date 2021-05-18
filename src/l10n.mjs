export default class L10n {

    constructor(translations, locale = navigator.language) {
        this._catalogs = {}
        this._fallbacks = {}
        this.setLocale(locale)

        Object.keys(translations).forEach(loc => {
            const lang = loc.substr(0, 2)
            this._catalogs[loc] = this._catalogs[loc] || {}
            Object.keys(translations[loc].t).forEach(msgid => this._catalogs[loc][msgid] = translations[loc].t[msgid])
            this._fallbacks[lang] = loc

            /*jshint evil:true */
            _pl[lang] = _pl[lang] || new Function("n", `return (${translations[loc].p}) | 0`)
        })
    }

    /**
     * sets the locale.
     *
     * @param string locale
     */
    setLocale(locale) {
        this._locale = locale
        this._language = locale.substr(0, 2)
    }

    /**
     * returns the current locale.
     *
     * @return string current locale
     */
    getLocale() {
        return this._locale
    }

    /**
     * Translates a string into the given locale.
     *
     * @param  string msgid the message to translate
     * @param  string loc the target locale
     * @return string the translated message, or, if there is no translation, the original message
     */
    t(msgid) {
        return this._getEntry(msgid) || msgid
    }

    /**
     * Translates a string in a certain context into the given locale.
     *
     * This is useful when two original strings have different meanings and will most
     * likely require different translations.
     *
     * For example, in a financial context, the English word “amount” would translate
     * to the German „Betrag“, while in a context where items are counted, the German
     * translation would be „Anzahl“. Prefixing the translation with a context allows
     * translators to add both translations.
     *
     * @param  string context the context
     * @param  string msgid the message to translate
     * @param  string loc the target locale
     * @return string the translated message, or, if there is no translation, the original message
     */
    x(context, msgid) {
        return this._getEntry(`${context}\u0004${msgid}`) || msgid
    }

    /**
     * Translates a pluralized string in a certain context into the given locale.
     *
     * This function uses “pluralisation rules” to determine the correct form in the target
     * language. For example, many languages have more than two plural forms, and this
     * function will select the correct one.
     *
     * NOTE: This function will not fill in the value into the placeholder in the
     * plural form, but only return the correct message. You must either use something like
     * sprintf() or some other replacement implementation, e.g. `msg.replace("%s", value)`.
     *
     * @param  string msgid the message to translate, singular form
     * @param  string msgidPlural the message to translate, plural form
     * @param  integer amount number to use to determine the correct plural form
     * @return string the translated message, or, if there is no translation, the original message
     */
    n(msgid, msgidPlural, amount) {
        const entry = this._getEntry(msgid)
        return (entry && entry[0] && entry[1]) ? entry[_pl[this._language](amount)] : (amount === 1 ? msgid : msgidPlural)
    }

    /*istanbul ignore next */
    _getEntry(msgid) {
        let key

        if (this._catalogs[this._locale])
            key = this._locale

        else if (this._catalogs[this._fallbacks[this._language]])
            key = this._fallbacks[this._language]

        return this._catalogs[key] ? this._catalogs[key][msgid] : undefined
    }
}

// have one "global" map of pluralizers so we don’t have to create the functions multiple times
const _pl = {}
