"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _this = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import L10n from "./l10n"
var Date = /*#__PURE__*/function () {
  function Date(l10n) {
    _classCallCheck(this, Date);

    this._l10n = l10n;
  }
  /**
   * Formats a string like "Y-m-d" or "j. M Y" to a real date expression. Use with l10n.t() to create the localized date format first.
   *
   * @param {object} an instance of Date()
   * @param {string} the date pattern (like "Y-m-d" or "j. M Y")
   */


  _createClass(Date, [{
    key: "fmt",
    value: function fmt(dateObj, string) {
      return string.split("").map(function (_char) {
        return dateFn[_char] ? dateFn[_char](dateObj) : _char;
      }).join("");
    }
    /**
     * Returns a list of translated month names
     *
     * @return {array} month names
     */

  }, {
    key: "getMonths",
    value: function getMonths() {
      return [this._l10n.x("l10n\x04January"), this._l10n.x("l10n\x04February"), this._l10n.x("l10n\x04March"), this._l10n.x("l10n\x04April"), this._l10n.x("l10n\x04May"), this._l10n.x("l10n\x04June"), this._l10n.x("l10n\x04July"), this._l10n.x("l10n\x04August"), this._l10n.x("l10n\x04September"), this._l10n.x("l10n\x04October"), this._l10n.x("l10n\x04November"), this._l10n.x("l10n\x04December")];
    }
    /**
     * Returns a list of translated month name abbreviations
     *
     * @return {array} month names
     */

  }, {
    key: "getMonthsShort",
    value: function getMonthsShort() {
      return [this._l10n.x("l10n\x04Jan"), this._l10n.x("l10n\x04Feb"), this._l10n.x("l10n\x04Mar"), this._l10n.x("l10n\x04Apr"), this._l10n.x("l10n\x04May"), this._l10n.x("l10n\x04Jun"), this._l10n.x("l10n\x04Jul"), this._l10n.x("l10n\x04Aug"), this._l10n.x("l10n\x04Sep"), this._l10n.x("l10n\x04Oct"), this._l10n.x("l10n\x04Nov"), this._l10n.x("l10n\x04Dec")];
    }
    /**
     * Returns a list of translated weekday names
     *
     * @return {array} weekday names
     */

  }, {
    key: "getWeekdays",
    value: function getWeekdays() {
      var weekdays = [this._l10n.x("l10n\x04Sunday"), this._l10n.x("l10n\x04Monday"), this._l10n.x("l10n\x04Tuesday"), this._l10n.x("l10n\x04Wednesday"), this._l10n.x("l10n\x04Thursday"), this._l10n.x("l10n\x04Friday"), this._l10n.x("l10n\x04Saturday")]; // if first weekday is Monday, move Sunday to the end

      this.getFirstDayOfWeek() && weekdays.push(weekdays.shift());
      return weekdays;
    }
    /**
     * Returns a list of translated weekday name abbreviations
     *
     * @return {array} weekday names
     */

  }, {
    key: "getWeekdaysShort",
    value: function getWeekdaysShort() {
      var weekdays = [this._l10n.x("l10n\x04Sun"), this._l10n.x("l10n\x04Mon"), this._l10n.x("l10n\x04Tue"), this._l10n.x("l10n\x04Wed"), this._l10n.x("l10n\x04Thu"), this._l10n.x("l10n\x04Fri"), this._l10n.x("l10n\x04Sat")]; // if first weekday is Monday, move Sunday to the end

      this.getFirstDayOfWeek() && weekdays.push(weekdays.shift());
      return weekdays;
    }
    /**
     * Gives you the first day of the calendar week
     *
     * @return {integer} 0 for Sunday, 1 for Monday
     */

  }, {
    key: "getFirstDayOfWeek",
    value: function getFirstDayOfWeek() {
      return parseInt(this._l10n.x("first day of week; 0: Sunday, 1: Monday", "0"));
    }
  }]);

  return Date;
}();

exports["default"] = Date;

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
    return _this.getWeekdaysShort()[dateObj.getDay()];
  },
  // A textual representation of a day, three letters, Mon through Sun
  l: function l(dateObj) {
    return _this.getWeekdays()[dateObj.getDay()];
  },
  // A full textual representation of the day of the week Sunday through Saturday
  F: function F(dateObj) {
    return _this.getMonths()[dateObj.getMonth()];
  },
  // A full textual representation of a month, January through December
  M: function M(dateObj) {
    return _this.getMonthsShort()[dateObj.getMonth()];
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

