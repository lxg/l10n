import L10n from "./l10n.mjs"


test('constructor', () => {
    const l10n = new L10n({
        "de-DE": {
            "abc": "xyz"
        }
    }, "de-AT")

    expect(l10n.locale).toBe("de-AT")
    expect(l10n.language).toBe("de")
    expect(l10n.catalogs["de-DE"]).toEqual({"abc": "xyz"})
    expect(l10n.fallbacks).toEqual({"de" : "de-DE"})
})


// our permanent instance
const l10n = new L10n({
    "de-DE": {
        "Hello World": "Hallo Welt",
        "count\u0004Amount": "Menge",
        "money\u0004Amount": "Betrag",
        "One element": ["Ein Element", "%s Elemente"]
    },
    "fr-FR": {
        "Hello World": "Bonjour tout le monde"
    }
}, "de-DE")


// Test setting and getting locale

test('Locale is set to en-GB', () => {
    l10n.setLocale("en-GB")
    expect(l10n.locale).toBe("en-GB")
})

test('Locale is correctly set and can be retrieved as en-US', () => {
    l10n.setLocale("en-US")
    expect(l10n.getLocale()).toBe("en-US")
})

// Test fully translated language (German)

test('"Hello World" is translated to "Hallo Welt"', () => {
    l10n.setLocale("de-DE")
    expect(l10n.t("Hello World")).toBe("Hallo Welt")
})

test('"Amount" is translated to "Menge" in the "count" context', () => {
    l10n.setLocale("de-DE")
    expect(l10n.x("count", "Amount")).toBe("Menge")
})

test('"Amount" is translated to "Betrag" in the "money" context', () => {
    l10n.setLocale("de-DE")
    expect(l10n.x("money", "Amount")).toBe("Betrag")
})

test('"One element" is translated to "Ein Element" if the number is 1', () => {
    l10n.setLocale("de-DE")
    expect(l10n.n("One element", "%s elements", 1)).toBe("Ein Element")
})

test('"%s elements" is translated to "%s Elemente" if the number is 3', () => {
    l10n.setLocale("de-DE")
    expect(l10n.n("One element", "%s elements", 3)).toBe("%s Elemente")
})

// Test partially translated language (French)

test('"Hello World" is translated to "Bonjour tout le monde"', () => {
    l10n.setLocale("fr-FR")
    expect(l10n.t("Hello World")).toBe("Bonjour tout le monde")
})

test('"Amount" is returned untranslated due to missing translation', () => {
    l10n.setLocale("fr-FR")
    expect(l10n.x("money", "Amount")).toBe("Amount")
})

test('"One element" is returned untranslated due to missing translation', () => {
    l10n.setLocale("fr-FR")
    expect(l10n.n("One element", "%s elements", 1)).toBe("One element")
})

test('"%s elements" is returned untranslated due to missing translation', () => {
    l10n.setLocale("fr-FR")
    expect(l10n.n("One element", "%s elements", 3)).toBe("%s elements")
})
