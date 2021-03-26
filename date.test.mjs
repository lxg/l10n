import L10n from "./l10n.mjs"
import L10nDate from "./date.mjs"
import { L10nDateFormat } from "./date.mjs"

const l10n = new L10n({
    "de-DE": {
        p: '(n != 1)',
        t: {
          "l, d F Y": "l, d. F Y",

          "_\u0004Mon": "Mo",
          "_\u0004Tue": "Di",
          "_\u0004Wed": "Mi",
          "_\u0004Thu": "Do",
          "_\u0004Fri": "Fr",
          "_\u0004Sat": "Sa",
          "_\u0004Sun": "So",
          "_\u0004Monday": "Montag",
          "_\u0004Tuesday": "Dienstag",
          "_\u0004Wednesday": "Mittwoch",
          "_\u0004Thursday": "Donnerstag",
          "_\u0004Friday": "Freitag",
          "_\u0004Saturday": "Samstag",
          "_\u0004Sunday": "Sonntag",
          "_\u0004Jan": "Jan",
          "_\u0004Feb": "Feb",
          "_\u0004Mar": "Mär",
          "_\u0004Apr": "Apr",
          "_\u0004May": "Mai",
          "_\u0004Jun": "Jun",
          "_\u0004Jul": "Jul",
          "_\u0004Aug": "Aug",
          "_\u0004Sep": "Sep",
          "_\u0004Oct": "Okt",
          "_\u0004Nov": "Nov",
          "_\u0004Dec": "Dez",
          "_\u0004January": "Januar",
          "_\u0004February": "Februar",
          "_\u0004March": "März",
          "_\u0004April": "April",
          "_\u0004June": "Juni",
          "_\u0004July": "Juli",
          "_\u0004August": "August",
          "_\u0004September": "September",
          "_\u0004October": "Oktober",
          "_\u0004November": "November",
          "_\u0004December": "Dezember"
        }
    }
}, "de-DE")

const l10nDate = new L10nDate(l10n, "de-DE")
const dateFormat = new L10nDateFormat(l10n)

test('Test long weekday names', () => {
    const weekdays = l10nDate.getWeekdays()

    expect(weekdays).toBeInstanceOf(Array)
    expect(weekdays[3]).toBe('Mittwoch')
    expect(weekdays[6]).toBe('Samstag')
})

test('Test short weekday names', () => {
    const weekdays = l10nDate.getWeekdaysShort()

    expect(weekdays).toBeInstanceOf(Array)
    expect(weekdays[3]).toBe('Mi')
    expect(weekdays[6]).toBe('Sa')
})

test('Test weekday shifting', () => {
    const weekdays = l10nDate.shiftWeekdays(l10nDate.getWeekdaysShort())
    expect(weekdays).toBeInstanceOf(Array)
    expect(weekdays[3]).toBe('Do')
    expect(weekdays[6]).toBe('So')
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
    expect(dateFormat.fmt(date, l10n.t("l, d F Y"))).toBe('Freitag, 26. März 2021')
})
