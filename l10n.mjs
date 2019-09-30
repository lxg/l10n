export default class L10n {

    constructor(translations, locale = navigator.language) {
        this.catalogs = {}
        this.setLocale(locale)
        this.fallbacks = {}

        Object.keys(translations).forEach(loc => {
            const lang = loc.substr(0, 2)
            this.catalogs[loc] = this.catalogs[loc] || {}
            Object.keys(translations[loc]).forEach(msgid => this.catalogs[loc][msgid] = translations[loc][msgid])
            this.fallbacks[lang] = loc
        })
    }

    /**
     * sets the locale.
     *
     * @param string locale
     */
    setLocale(locale) {
        this.locale = locale
        this.language = locale.substr(0, 2)
    }

    /**
     * returns the current locale.
     *
     * @return string current locale
     */
    getLocale() {
        return this.locale
    }

    /**
     * Translates a string into the given locale.
     *
     * @param  string msgid the message to translate
     * @param  string loc the target locale
     * @return string the translated message, or, if there is no translation, the original message
     */
    t(msgid) {
        return this.getEntry(msgid) || msgid
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
        return this.getEntry(context + "\u0004" + msgid) || msgid
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
        const entry = this.getEntry(msgid)
        return (entry && entry[0] && entry[1]) ? entry[this.getPluralMessageIdx(amount)] : (amount === 1 ? msgid : msgidPlural)
    }

    /*istanbul ignore next */
    getEntry(msgid) {
        let key

        if (this.catalogs[this.locale])
            key = this.locale

        else if (this.catalogs[this.fallbacks[this.language]])
            key = this.fallbacks[this.language]

        return this.catalogs[key] ? this.catalogs[key][msgid] : undefined
    }

    /*istanbul ignore next */
    getPluralMessageIdx(amount) {
        if (!pluralCallbacks[this.language])
            /*jshint evil:true */
            pluralCallbacks[this.language] = new Function("n", `return (${plurals[this.language] || plurals._default}) | 0`);

        return pluralCallbacks[this.language](amount);
    }
}

let pluralCallbacks = {}

// Gettext pluralisation rules for many languages
const plurals = {
    _default:"n!=1",
    ak:"n>1",
    am:"n>1",
    ar:"(n==0)?0:((n==1)?1:((n==2)?2:((n%100>=3&&n%100<=10)?3:((n%100>=11&&n%100<=99)?4:5))))",
    arn:"n>1",
    ay:"0",
    be:"(n%10==1&&n%100!=11)?0:((n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2)",
    bo:"0",
    br:"n>1",
    bs:"(n%10==1&&n%100!=11)?0:((n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2)",
    cs:"(n==1)?0:((n>=2&&n<=4)?1:2)",
    csb:"(n==1)?0:((n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2)",
    cy:"(n==1)?0:((n==2)?1:((n!=8&&n!=11)?2:3))",
    dz:"0",
    fa:"0",
    fil:"n>1",
    fr:"n>1",
    ga:"(n==1)?0:((n==2)?1:((n<7)?2:((n<11)?3:4)))",
    gun:"n>1",
    hr:"(n%10==1&&n%100!=11)?0:((n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2)",
    hy:"0",
    id:"0",
    ja:"0",
    jv:"n!=0",
    ka:"0",
    km:"0",
    ko:"0",
    kw:"(n==1)?0:((n==2)?1:((n==3)?2:3))",
    ky:"0",
    ln:"n>1",
    lo:"0",
    lt:"(n%10==1&&n%100!=11)?0:((n%10>=2&&(n%100<10||n%100>=20))?1:2)",
    lv:"(n%10==1&&n%100!=11)?0:((n!=0)?1:2)",
    mg:"n>1",
    mi:"n>1",
    mk:"(n==1||n%10==1)?0:1",
    ms:"0",
    mt:"(n==1)?0:((n==0||(n%100>1&&n%100<11))?1:((n%100>10&&n%100<20)?2:3))",
    nso:"n>1",
    pl:"(n==1)?0:((n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2)",
    pt:"n>1",
    ro:"(n==1)?0:((n==0||(n%100>0&&n%100<20))?1:2)",
    ru:"(n%10==1&&n%100!=11)?0:((n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2)",
    sk:"(n==1)?0:((n>=2&&n<=4)?1:2)",
    sl:"(n%100==1)?0:((n%100==2)?1:((n%100==3||n%100==4)?2:3))",
    sr:"(n%10==1&&n%100!=11)?0:((n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2)",
    su:"0",
    th:"0",
    ti:"n>1",
    tr:"0",
    uk:"(n%10==1&&n%100!=11)?0:((n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?1:2)",
    uz:"0",
    vi:"0",
    wa:"n>1",
    zh:"0"
}
