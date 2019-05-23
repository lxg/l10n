"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = date;

var _l10n = _interopRequireDefault(require("./l10n.mjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Formats a string like "Y-m-d" or "j. M Y" to a real date expression. Use with l10n.t() to create the localized date format first.
 *
 * @param  {object} an instance of Date()
 * @param  {string} the date pattern
 * @return {string} the real date expression
 */
function date() {}



date.fmt = function (dateObj, string) {
  return string.split("").map(function (_char) {
    return dateFn[_char] ? dateFn[_char](dateObj) : _char;
  }).join("");
};
/**
 * Returns a list of translated month names
 *
 * @return {array} month names
 */


date.getMonths = function () {
  return [_l10n["default"].t("January"), _l10n["default"].t("February"), _l10n["default"].t("March"), _l10n["default"].t("April"), _l10n["default"].t("May"), _l10n["default"].t("June"), _l10n["default"].t("July"), _l10n["default"].t("August"), _l10n["default"].t("September"), _l10n["default"].t("October"), _l10n["default"].t("November"), _l10n["default"].t("December")];
};
/**
 * Returns a list of translated month name abbreviations
 *
 * @return {array} month names
 */


date.getMonthsShort = function () {
  return [_l10n["default"].t("Jan"), _l10n["default"].t("Feb"), _l10n["default"].t("Mar"), _l10n["default"].t("Apr"), _l10n["default"].t("May"), _l10n["default"].t("Jun"), _l10n["default"].t("Jul"), _l10n["default"].t("Aug"), _l10n["default"].t("Sep"), _l10n["default"].t("Oct"), _l10n["default"].t("Nov"), _l10n["default"].t("Dec")];
};
/**
 * Returns a list of translated weekday names
 *
 * @return {array} weekday names
 */


date.getWeekdays = function () {
  return [_l10n["default"].t("Sunday"), _l10n["default"].t("Monday"), _l10n["default"].t("Tuesday"), _l10n["default"].t("Wednesday"), _l10n["default"].t("Thursday"), _l10n["default"].t("Friday"), _l10n["default"].t("Saturday")];
};
/**
 * Returns a list of translated weekday name abbreviations
 *
 * @return {array} weekday names
 */


date.getWeekdaysShort = function () {
  return [_l10n["default"].t("Sun"), _l10n["default"].t("Mon"), _l10n["default"].t("Tue"), _l10n["default"].t("Wed"), _l10n["default"].t("Thu"), _l10n["default"].t("Fri"), _l10n["default"].t("Sat")];
};
/**
 * Gives you the first day of the calendar week
 *
 * @return {integer} 0 for Sunday, 1 for Monday
 */


date.getFirstDayOfWeek = function () {
  return parseInt(_l10n["default"].x("first day of week; 0: Sunday, 1: Monday", "0"));
};

var pad = function pad(num) {
  return num.toString().padStart(2, "0");
};

var dateFn = {
  j: function j(dateObj) {
    return dateObj.getDate().toString();
  },
  // Day of the month without leading zeros, 1 to 31
  d: function d(dateObj) {
    return pad(dateFn.j(dateObj));
  },
  // Day of the month, 2 digits with leading zeros, 01 to 31
  w: function w(dateObj) {
    return dateObj.getDay().toString();
  },
  // Numeric representation of the day of the week, 0 (for Sunday) through 6 (for Saturday)
  D: function D(dateObj) {
    return date.getWeekdaysShort()[dateObj.getDay()];
  },
  // A textual representation of a day, three letters, Mon through Sun
  l: function l(dateObj) {
    return date.getWeekdays()[dateObj.getDay()];
  },
  // A full textual representation of the day of the week Sunday through Saturday
  F: function F(dateObj) {
    return date.getMonths()[dateObj.getMonth()];
  },
  // A full textual representation of a month, January through December
  M: function M(dateObj) {
    return date.getMonthsShort()[dateObj.getMonth()];
  },
  // A short textual representation of a month, three letters, Jan through Dec
  n: function n(dateObj) {
    return (dateObj.getMonth() + 1).toString();
  },
  // Numeric representation of a month, without leading zeros, 1 through 12
  m: function m(dateObj) {
    return pad(dateFn.n(dateObj));
  },
  // Numeric representation of a month, with leading zeros, 01 through 12
  Y: function Y(dateObj) {
    return dateObj.getFullYear().toString();
  },
  // A full numeric representation of a year, 1999 or 2003
  y: function y(dateObj) {
    return dateFn.Y(dateObj).substr(2);
  },
  // A two digit representation of a year, 99 or 03
  H: function H(dateObj) {
    return pad(dateObj.getHours());
  },
  // 24-hour format of an hour with leading zeros, 00 through 23
  i: function i(dateObj) {
    return pad(dateObj.getMinutes());
  },
  // Minutes with leading zeros, 00 to 59
  s: function s(dateObj) {
    return pad(dateObj.getSeconds());
  } // Seconds, with leading zeros, 00 through 59

};

