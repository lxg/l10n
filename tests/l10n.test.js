import L10n from "../src/l10n.js"

test('constructor', () => {
    const l10n = new L10n({
        "de-DE": {
            p: '(n != 1)',
            t: {
                "abc": "xyz"
            }
        }
    }, "de-AT")

    expect(l10n.getLocale()).toBe("de-AT")
})

// our permanent instance
const l10n = new L10n({
    "de-DE": {
        p: '(n != 1)',
        t: {
            "Hello World": "Hallo Welt",
            "count\u0004Amount": "Menge",
            "money\u0004Amount": "Betrag",
            "One element": ["Ein Element", "%s Elemente"]
        }
    },
    "fr-FR": {
        p: '(n != 1)',
        t: {
            "Hello World": "Bonjour tout le monde"
        }
    }
}, "de-DE")

test('Test setting and getting locale', () => {
    l10n.setLocale("en-GB")
    expect(l10n.getLocale()).toBe("en-GB")
})

test('Test fully translated language (German)', () => {
    l10n.setLocale("de-DE")
    expect(l10n.t("Hello World")).toBe("Hallo Welt")
    expect(l10n.x("count", "Amount")).toBe("Menge")
    expect(l10n.x("money", "Amount")).toBe("Betrag")
    expect(l10n.n("One element", "%s elements", 1)).toBe("Ein Element")
    expect(l10n.n("One element", "%s elements", 3)).toBe("%s Elemente")
})

test('Test partially translated language (French)', () => {
    l10n.setLocale("fr-FR")
    expect(l10n.t("Hello World")).toBe("Bonjour tout le monde")
    expect(l10n.x("money", "Amount")).toBe("Amount")
    expect(l10n.n("One element", "%s elements", 1)).toBe("One element")
    expect(l10n.n("One element", "%s elements", 3)).toBe("%s elements")
})
