import l10n from "./l10n.mjs";

/**
 * Formats a string like "Y-m-d" or "j. M Y" to a real date expression. Use with l10n.t() to create the localized date format first.
 *
 * @param  {object} an instance of Date()
 * @param  {string} the date pattern
 * @return {string} the real date expression
 */
export default function date() {}

date.fmt = (dateObj, string) => string
    .split("")
    .map(char => dateFn[char] ? dateFn[char](dateObj) : char)
    .join("");

/**
 * Returns a list of translated month names
 *
 * @return {array} month names
 */
date.getMonths = () => [
    l10n.t("January"), l10n.t("February"), l10n.t("March"),
    l10n.t("April"), l10n.t("May"), l10n.t("June"),
    l10n.t("July"), l10n.t("August"), l10n.t("September"),
    l10n.t("October"), l10n.t("November"), l10n.t("December")
];

/**
 * Returns a list of translated month name abbreviations
 *
 * @return {array} month names
 */
date.getMonthsShort = () => [
    l10n.t("Jan"), l10n.t("Feb"), l10n.t("Mar"), l10n.t("Apr"),
    l10n.t("May"), l10n.t("Jun"), l10n.t("Jul"), l10n.t("Aug"),
    l10n.t("Sep"), l10n.t("Oct"), l10n.t("Nov"), l10n.t("Dec")
];

/**
 * Returns a list of translated weekday names
 *
 * @return {array} weekday names
 */
date.getWeekdays = () => [
    l10n.t("Sunday"), l10n.t("Monday"), l10n.t("Tuesday"),
    l10n.t("Wednesday"), l10n.t("Thursday"),
    l10n.t("Friday"), l10n.t("Saturday")
];

/**
 * Returns a list of translated weekday name abbreviations
 *
 * @return {array} weekday names
 */
date.getWeekdaysShort = () => [
    l10n.t("Sun"), l10n.t("Mon"), l10n.t("Tue"), l10n.t("Wed"),
    l10n.t("Thu"), l10n.t("Fri"), l10n.t("Sat")
];

/**
 * Gives you the first day of the calendar week
 *
 * @return {integer} 0 for Sunday, 1 for Monday
 */
date.getFirstDayOfWeek = () => parseInt(l10n.x("first day of week; 0: Sunday, 1: Monday", "0"));



let pad = num => num.toString().padStart(2, "0");

let dateFn =
{
    j : dateObj => dateObj.getDate().toString(), // Day of the month without leading zeros, 1 to 31
    d : dateObj => pad(dateFn.j(dateObj)), // Day of the month, 2 digits with leading zeros, 01 to 31

    w : dateObj => dateObj.getDay().toString(), // Numeric representation of the day of the week, 0 (for Sunday) through 6 (for Saturday)
    D : dateObj => date.getWeekdaysShort()[dateObj.getDay()], // A textual representation of a day, three letters, Mon through Sun
    l : dateObj => date.getWeekdays()[dateObj.getDay()], // A full textual representation of the day of the week Sunday through Saturday

    F : dateObj => date.getMonths()[dateObj.getMonth()], // A full textual representation of a month, January through December
    M : dateObj => date.getMonthsShort()[dateObj.getMonth()], // A short textual representation of a month, three letters, Jan through Dec
    n : dateObj => (dateObj.getMonth() + 1).toString(), // Numeric representation of a month, without leading zeros, 1 through 12
    m : dateObj => pad(dateFn.n(dateObj)), // Numeric representation of a month, with leading zeros, 01 through 12

    Y : dateObj => dateObj.getFullYear().toString(), // A full numeric representation of a year, 1999 or 2003
    y : dateObj => dateFn.Y(dateObj).substr(2), // A two digit representation of a year, 99 or 03

    H : dateObj => pad(dateObj.getHours()), // 24-hour format of an hour with leading zeros, 00 through 23
    i : dateObj => pad(dateObj.getMinutes()), // Minutes with leading zeros, 00 to 59
    s : dateObj => pad(dateObj.getSeconds()) // Seconds, with leading zeros, 00 through 59
};
