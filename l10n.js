export default function l10n(loc, translations) {
    catalogs[loc] = catalogs[loc] || {};
    Object.keys(translations).forEach(msgid => catalogs[loc][msgid] = translations[msgid]);
};

l10n.t = msgid => getEntry(msgid) || msgid;

l10n.x = (context, msgid) => getEntry(context + "\u0004" + msgid) || msgid;

l10n.n = (msgid, msgidPlural, amount) => {
    const entry = getEntry(msgid);
    return  sprintf((entry && entry[0] && entry[1]) ? entry[getPluralMessageIdx(amount)] : (amount === 1 ? msgid : msgidPlural), amount);
};

l10n.setLocale = (loc) => {
    try {
        let locales = Intl.getCanonicalLocales(loc);
        locale = locales[0];
    } catch (e) { }

    // as Intl.getCanonicalLocales can throw an error or return an empty array, we put a fallback here
    locale = locale || "en-US";
    language = locale.substr(0, 2);
};

let locale, language;

l10n.setLocale(navigator.language);


let catalogs = {};
let pluralCallbacks = {};
let getEntry = msgid => catalogs[locale] ? catalogs[locale][msgid] : undefined;

let getPluralMessageIdx = amount => {
    if (!pluralCallbacks[language])
        /*jshint evil:true */
        pluralCallbacks[language] = new Function("n", `return (${plurals[language] || plurals._default}) | 0`);

    return pluralCallbacks[language](amount);
};

let sprintf = (format, ...args) => {
    let i = 0;
    return format.replace(/%s/g, () => args[i++]);
};

// Gettext pluralisation rules for most languages
let plurals = {
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
};
