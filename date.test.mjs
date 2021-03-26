import L10n from "./l10n.mjs"
import L10nDate from "./date.mjs"
import { L10nDateFormat } from "./date.mjs"

const l10n = new L10n({
    "de-DE": {
        p: '(n != 1)',
        t: {
          "l, d F Y": "l, d. F Y",

          "l10n\u0004Mon": "Mo",
          "l10n\u0004Tue": "Di",
          "l10n\u0004Wed": "Mi",
          "l10n\u0004Thu": "Do",
          "l10n\u0004Fri": "Fr",
          "l10n\u0004Sat": "Sa",
          "l10n\u0004Sun": "So",
          "l10n\u0004Monday": "Montag",
          "l10n\u0004Tuesday": "Dienstag",
          "l10n\u0004Wednesday": "Mittwoch",
          "l10n\u0004Thursday": "Donnerstag",
          "l10n\u0004Friday": "Freitag",
          "l10n\u0004Saturday": "Samstag",
          "l10n\u0004Sunday": "Sonntag",
          "l10n\u0004Jan": "Jan",
          "l10n\u0004Feb": "Feb",
          "l10n\u0004Mar": "Mär",
          "l10n\u0004Apr": "Apr",
          "l10n\u0004May": "Mai",
          "l10n\u0004Jun": "Jun",
          "l10n\u0004Jul": "Jul",
          "l10n\u0004Aug": "Aug",
          "l10n\u0004Sep": "Sep",
          "l10n\u0004Oct": "Okt",
          "l10n\u0004Nov": "Nov",
          "l10n\u0004Dec": "Dez",
          "l10n\u0004January": "Januar",
          "l10n\u0004February": "Februar",
          "l10n\u0004March": "März",
          "l10n\u0004April": "April",
          "l10n\u0004June": "Juni",
          "l10n\u0004July": "Juli",
          "l10n\u0004August": "August",
          "l10n\u0004September": "September",
          "l10n\u0004October": "Oktober",
          "l10n\u0004November": "November",
          "l10n\u0004December": "Dezember"
        }
    }
}, "de-DE")

const l10nDate = new L10nDate(l10n, "de-DE")
const dateFormat = new L10nDateFormat(l10n)

test('Test long weekday names', () => {
    const weekdays = l10nDate.getWeekdays()

    expect(weekdays).toBeInstanceOf(Array)
    expect(weekdays[2]).toBe('Mittwoch')
    expect(weekdays[5]).toBe('Samstag')
})


test('Test short weekday names', () => {
    const weekdays = l10nDate.getWeekdaysShort()

    expect(weekdays).toBeInstanceOf(Array)
    expect(weekdays[2]).toBe('Mi')
    expect(weekdays[5]).toBe('Sa')
})

test('Test long month names', () => {
    const months = l10nDate.getMonths()

    expect(months).toBeInstanceOf(Array)
    expect(months[2]).toBe('März')
    expect(months[8]).toBe('September')
})

test('Test short month names', () => {
    const months = l10nDate.getMonthsShort()

    expect(months).toBeInstanceOf(Array)
    expect(months[0]).toBe('Jan')
    expect(months[6]).toBe('Jul')
})

test('Test date formatting', () => {
    const date = new Date(1616786698000) // 2021-03-26T19:24:58.000Z
    expect(dateFormat.fmt(date, l10n.t("l, d F Y"))).toBe('Samstag, 26. März 2021')
})
