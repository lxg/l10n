export default class L10nDate
{
    constructor(l10n) {
        this._l10n = l10n
    }

    /**
     * Returns a list of translated month names
     *
     * @return {array} month names
     */
    getMonths() {
        return [
            this._l10n.x("_", "January"), this._l10n.x("_", "February"), this._l10n.x("_", "March"),
            this._l10n.x("_", "April"), this._l10n.x("_", "May"), this._l10n.x("_", "June"),
            this._l10n.x("_", "July"), this._l10n.x("_", "August"), this._l10n.x("_", "September"),
            this._l10n.x("_", "October"), this._l10n.x("_", "November"), this._l10n.x("_", "December")
        ];
    }

    /**
     * Returns a list of translated month name abbreviations
     *
     * @return {array} month names
     */
    getMonthsShort() {
        return [
            this._l10n.x("_", "Jan"), this._l10n.x("_", "Feb"), this._l10n.x("_", "Mar"), this._l10n.x("_", "Apr"),
            this._l10n.x("_", "May"), this._l10n.x("_", "Jun"), this._l10n.x("_", "Jul"), this._l10n.x("_", "Aug"),
            this._l10n.x("_", "Sep"), this._l10n.x("_", "Oct"), this._l10n.x("_", "Nov"), this._l10n.x("_", "Dec")
        ]
    }

    /**
     * Returns a list of translated weekday names
     *
     * @return {array} weekday names
     */
    getWeekdays() {
        return [
            this._l10n.x("_", "Sunday"), this._l10n.x("_", "Monday"), this._l10n.x("_", "Tuesday"),
            this._l10n.x("_", "Wednesday"), this._l10n.x("_", "Thursday"),
            this._l10n.x("_", "Friday"), this._l10n.x("_", "Saturday")
        ]
    }

    /**
     * Returns a list of translated weekday name abbreviations
     *
     * @return {array} weekday names
     */
    getWeekdaysShort() {
        return [
            this._l10n.x("_", "Sun"), this._l10n.x("_", "Mon"), this._l10n.x("_", "Tue"), this._l10n.x("_", "Wed"),
            this._l10n.x("_", "Thu"), this._l10n.x("_", "Fri"), this._l10n.x("_", "Sat")
        ]
    }

    /**
     * Gives you the first day of the calendar week
     *
     * @return {integer} 0 for Sunday, 1 for Monday, 5 for Friday, 6 for Saturday
     */
    getFirstDayOfWeek() {
        return parseInt(this._l10n.x("_", "1"))
    }

    /**
     * Shifts the weekdays to the localized order based on the first day of the calendar week in the given locale
     *
     * @return Array the list of weekdays in the localized order
     */
    shiftWeekdays(weekdays) {
        const day = this.getFirstDayOfWeek()
        return weekdays.slice(day).concat(weekdays.slice(0, day))
    }
}


const pad = num => num.toString().padStart(2, "0")

export class L10nDateFormat
{
    constructor(l10n) {
        this._l10n = l10n
        this._date = new L10nDate(l10n)
    }

    /**
     * formats a date string with the localised month/day names
     *
     * @param  Date date the actual date to format
     * @param  string format string, e.g. Y-m-d
     *
     * @return string the human readable date string
     */
    fmt(date, format) {
        return format
            .split("")
            .map(char => dateFn[char] ? dateFn[char](this._date, date) : char)
            .join("")
    }
}

const dateFn = {
    j: (l10nDate, date) => date.getDate().toString(), // Day of the month without leading zeros, 1 to 31
    d: (l10nDate, date) => pad(dateFn.j(l10nDate, date)), // Day of the month, 2 digits with leading zeros, 01 to 31

    w: (l10nDate, date) => date.getDay().toString(), // Numeric representation of the day of the week, 0 (for Sunday) through 6 (for Saturday)
    D: (l10nDate, date) => l10nDate.getWeekdaysShort()[date.getDay()], // A textual representation of a day, three letters, Mon through Sun
    l: (l10nDate, date) => l10nDate.getWeekdays()[date.getDay()], // A full textual representation of the day of the week Sunday through Saturday

    F: (l10nDate, date) => l10nDate.getMonths()[date.getMonth()], // A full textual representation of a month, January through December
    M: (l10nDate, date) => l10nDate.getMonthsShort()[date.getMonth()], // A short textual representation of a month, three letters, Jan through Dec
    n: (l10nDate, date) => (date.getMonth() + 1).toString(), // Numeric representation of a month, without leading zeros, 1 through 12
    m: (l10nDate, date) => pad(dateFn.n(l10nDate, date)), // Numeric representation of a month, with leading zeros, 01 through 12

    Y: (l10nDate, date) => date.getFullYear().toString(), // A full numeric representation of a year, 1999 or 2003
    y: (l10nDate, date) => dateFn.Y(l10nDate, date).substr(2), // A two digit representation of a year, 99 or 03

    H: (l10nDate, date) => pad(date.getHours()), // 24-hour format of an hour with leading zeros, 00 through 23
    i: (l10nDate, date) => pad(date.getMinutes()), // Minutes with leading zeros, 00 to 59
    s: (l10nDate, date) => pad(date.getSeconds()) // Seconds, with leading zeros, 00 through 59
}
