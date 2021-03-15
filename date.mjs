// import L10n from "./l10n"

export default class Date
{
    constructor(l10n) {
        this._l10n = l10n
    }

    /**
     * Formats a string like "Y-m-d" or "j. M Y" to a real date expression. Use with l10n.t() to create the localized date format first.
     *
     * @param {object} an instance of Date()
     * @param {string} the date pattern (like "Y-m-d" or "j. M Y")
     */
    fmt(dateObj, string) {
        return string
            .split("")
            .map(char => dateFn[char] ? dateFn[char](dateObj) : char)
            .join("")
    }

    /**
     * Returns a list of translated month names
     *
     * @return {array} month names
     */
    getMonths() {
        return [
            this._l10n.x("l10n", "January"), this._l10n.x("l10n", "February"), this._l10n.x("l10n", "March"),
            this._l10n.x("l10n", "April"), this._l10n.x("l10n", "May"), this._l10n.x("l10n", "June"),
            this._l10n.x("l10n", "July"), this._l10n.x("l10n", "August"), this._l10n.x("l10n", "September"),
            this._l10n.x("l10n", "October"), this._l10n.x("l10n", "November"), this._l10n.x("l10n", "December")
        ];
    }
    /**
     * Returns a list of translated month name abbreviations
     *
     * @return {array} month names
     */
    getMonthsShort() {
        return [
            this._l10n.x("l10n", "Jan"), this._l10n.x("l10n", "Feb"), this._l10n.x("l10n", "Mar"), this._l10n.x("l10n", "Apr"),
            this._l10n.x("l10n", "May"), this._l10n.x("l10n", "Jun"), this._l10n.x("l10n", "Jul"), this._l10n.x("l10n", "Aug"),
            this._l10n.x("l10n", "Sep"), this._l10n.x("l10n", "Oct"), this._l10n.x("l10n", "Nov"), this._l10n.x("l10n", "Dec")
        ]
    }
    /**
     * Returns a list of translated weekday names
     *
     * @return {array} weekday names
     */
    getWeekdays() {
        const weekdays = [
            this._l10n.x("l10n", "Sunday"), this._l10n.x("l10n", "Monday"), this._l10n.x("l10n", "Tuesday"),
            this._l10n.x("l10n", "Wednesday"), this._l10n.x("l10n", "Thursday"),
            this._l10n.x("l10n", "Friday"), this._l10n.x("l10n", "Saturday")
        ]

        // if first weekday is Monday, move Sunday to the end
        this.getFirstDayOfWeek() &&
            weekdays.push(weekdays.shift())

        return weekdays
    }
    /**
     * Returns a list of translated weekday name abbreviations
     *
     * @return {array} weekday names
     */
    getWeekdaysShort() {
        const weekdays = [
            this._l10n.x("l10n", "Sun"), this._l10n.x("l10n", "Mon"), this._l10n.x("l10n", "Tue"), this._l10n.x("l10n", "Wed"),
            this._l10n.x("l10n", "Thu"), this._l10n.x("l10n", "Fri"), this._l10n.x("l10n", "Sat")
        ]

        // if first weekday is Monday, move Sunday to the end
        this.getFirstDayOfWeek() &&
            weekdays.push(weekdays.shift())

        return weekdays
    }

    /**
     * Gives you the first day of the calendar week
     *
     * @return {integer} 0 for Sunday, 1 for Monday
     */
    getFirstDayOfWeek() {
        return parseInt(this._l10n.x("l10n", "1"))
    }
}

const pad = num => num.toString().padStart(2, "0")

const dateFn = {
    j: dateObj => dateObj.getDate().toString(), // Day of the month without leading zeros, 1 to 31
    d: dateObj => pad(dateFn.j(dateObj)), // Day of the month, 2 digits with leading zeros, 01 to 31

    w: dateObj => dateObj.getDay().toString(), // Numeric representation of the day of the week, 0 (for Sunday) through 6 (for Saturday)
    D: dateObj => this.getWeekdaysShort()[dateObj.getDay()], // A textual representation of a day, three letters, Mon through Sun
    l: dateObj => this.getWeekdays()[dateObj.getDay()], // A full textual representation of the day of the week Sunday through Saturday

    F: dateObj => this.getMonths()[dateObj.getMonth()], // A full textual representation of a month, January through December
    M: dateObj => this.getMonthsShort()[dateObj.getMonth()], // A short textual representation of a month, three letters, Jan through Dec
    n: dateObj => (dateObj.getMonth() + 1).toString(), // Numeric representation of a month, without leading zeros, 1 through 12
    m: dateObj => pad(dateFn.n(dateObj)), // Numeric representation of a month, with leading zeros, 01 through 12

    Y: dateObj => dateObj.getFullYear().toString(), // A full numeric representation of a year, 1999 or 2003
    y: dateObj => dateFn.Y(dateObj).substr(2), // A two digit representation of a year, 99 or 03

    H: dateObj => pad(dateObj.getHours()), // 24-hour format of an hour with leading zeros, 00 through 23
    i: dateObj => pad(dateObj.getMinutes()), // Minutes with leading zeros, 00 to 59
    s: dateObj => pad(dateObj.getSeconds()) // Seconds, with leading zeros, 00 through 59
}
