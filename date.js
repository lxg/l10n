"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.L10nDateFormat = exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import L10n from "./l10n"
var L10nDate = /*#__PURE__*/function () {
  function L10nDate(l10n) {
    _classCallCheck(this, L10nDate);

    this._l10n = l10n;
  }
  /**
   * Returns a list of translated month names
   *
   * @return {array} month names
   */


  _createClass(L10nDate, [{
    key: "getMonths",
    value: function getMonths() {
      return [this._l10n.x("_", "January"), this._l10n.x("_", "February"), this._l10n.x("_", "March"), this._l10n.x("_", "April"), this._l10n.x("_", "May"), this._l10n.x("_", "June"), this._l10n.x("_", "July"), this._l10n.x("_", "August"), this._l10n.x("_", "September"), this._l10n.x("_", "October"), this._l10n.x("_", "November"), this._l10n.x("_", "December")];
    }
    /**
     * Returns a list of translated month name abbreviations
     *
     * @return {array} month names
     */

  }, {
    key: "getMonthsShort",
    value: function getMonthsShort() {
      return [this._l10n.x("_", "Jan"), this._l10n.x("_", "Feb"), this._l10n.x("_", "Mar"), this._l10n.x("_", "Apr"), this._l10n.x("_", "May"), this._l10n.x("_", "Jun"), this._l10n.x("_", "Jul"), this._l10n.x("_", "Aug"), this._l10n.x("_", "Sep"), this._l10n.x("_", "Oct"), this._l10n.x("_", "Nov"), this._l10n.x("_", "Dec")];
    }
    /**
     * Returns a list of translated weekday names
     *
     * @return {array} weekday names
     */

  }, {
    key: "getWeekdays",
    value: function getWeekdays() {
      return [this._l10n.x("_", "Sunday"), this._l10n.x("_", "Monday"), this._l10n.x("_", "Tuesday"), this._l10n.x("_", "Wednesday"), this._l10n.x("_", "Thursday"), this._l10n.x("_", "Friday"), this._l10n.x("_", "Saturday")];
    }
    /**
     * Returns a list of translated weekday name abbreviations
     *
     * @return {array} weekday names
     */

  }, {
    key: "getWeekdaysShort",
    value: function getWeekdaysShort() {
      return [this._l10n.x("_", "Sun"), this._l10n.x("_", "Mon"), this._l10n.x("_", "Tue"), this._l10n.x("_", "Wed"), this._l10n.x("_", "Thu"), this._l10n.x("_", "Fri"), this._l10n.x("_", "Sat")];
    }
    /**
     * Gives you the first day of the calendar week
     *
     * @return {integer} 0 for Sunday, 1 for Monday, 5 for Friday, 6 for Saturday
     */

  }, {
    key: "getFirstDayOfWeek",
    value: function getFirstDayOfWeek() {
      return parseInt(this._l10n.x("_", "1"));
    }
    /**
     * Shifts the weekdays to the localized order based on the first day of the calendar week in the given locale
     *
     * @return Array the list of weekdays in the localized order
     */

  }, {
    key: "shiftWeekdays",
    value: function shiftWeekdays(weekdays) {
      var day = this.getFirstDayOfWeek();
      return weekdays.slice(day).concat(weekdays.slice(0, day));
    }
  }]);

  return L10nDate;
}();

exports["default"] = L10nDate;

var pad = function pad(num) {
  return num.toString().padStart(2, "0");
};

var L10nDateFormat = /*#__PURE__*/function () {
  function L10nDateFormat(l10n) {
    _classCallCheck(this, L10nDateFormat);

    this._l10n = l10n;
    this._date = new L10nDate(l10n);
  }
  /**
   * formats a date string with the localised month/day names
   *
   * @param  Date date the actual date to format
   * @param  string format string, e.g. Y-m-d
   *
   * @return string the human readable date string
   */


  _createClass(L10nDateFormat, [{
    key: "fmt",
    value: function fmt(date, format) {
      var _this = this;

      return format.split("").map(function (_char) {
        return dateFn[_char] ? dateFn[_char](_this._date, date) : _char;
      }).join("");
    }
  }]);

  return L10nDateFormat;
}();

exports.L10nDateFormat = L10nDateFormat;
var dateFn = {
  j: function j(l10nDate, date) {
    return date.getDate().toString();
  },
  // Day of the month without leading zeros, 1 to 31
  d: function d(l10nDate, date) {
    return pad(dateFn.j(l10nDate, date));
  },
  // Day of the month, 2 digits with leading zeros, 01 to 31
  w: function w(l10nDate, date) {
    return date.getDay().toString();
  },
  // Numeric representation of the day of the week, 0 (for Sunday) through 6 (for Saturday)
  D: function D(l10nDate, date) {
    return l10nDate.getWeekdaysShort()[date.getDay()];
  },
  // A textual representation of a day, three letters, Mon through Sun
  l: function l(l10nDate, date) {
    return l10nDate.getWeekdays()[date.getDay()];
  },
  // A full textual representation of the day of the week Sunday through Saturday
  F: function F(l10nDate, date) {
    return l10nDate.getMonths()[date.getMonth()];
  },
  // A full textual representation of a month, January through December
  M: function M(l10nDate, date) {
    return l10nDate.getMonthsShort()[date.getMonth()];
  },
  // A short textual representation of a month, three letters, Jan through Dec
  n: function n(l10nDate, date) {
    return (date.getMonth() + 1).toString();
  },
  // Numeric representation of a month, without leading zeros, 1 through 12
  m: function m(l10nDate, date) {
    return pad(dateFn.n(l10nDate, date));
  },
  // Numeric representation of a month, with leading zeros, 01 through 12
  Y: function Y(l10nDate, date) {
    return date.getFullYear().toString();
  },
  // A full numeric representation of a year, 1999 or 2003
  y: function y(l10nDate, date) {
    return dateFn.Y(l10nDate, date).substr(2);
  },
  // A two digit representation of a year, 99 or 03
  H: function H(l10nDate, date) {
    return pad(date.getHours());
  },
  // 24-hour format of an hour with leading zeros, 00 through 23
  i: function i(l10nDate, date) {
    return pad(date.getMinutes());
  },
  // Minutes with leading zeros, 00 to 59
  s: function s(l10nDate, date) {
    return pad(date.getSeconds());
  } // Seconds, with leading zeros, 00 through 59

};

