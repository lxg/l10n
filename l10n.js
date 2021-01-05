"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var L10n = /*#__PURE__*/function () {
  function L10n(translations) {
    var _this = this;

    var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : navigator.language;

    _classCallCheck(this, L10n);

    this._catalogs = {};
    this._fallbacks = {};
    this.setLocale(locale);
    Object.keys(translations).forEach(function (loc) {
      var lang = loc.substr(0, 2);
      _this._catalogs[loc] = _this._catalogs[loc] || {};
      Object.keys(translations[loc].t).forEach(function (msgid) {
        return _this._catalogs[loc][msgid] = translations[loc].t[msgid];
      });
      _this._fallbacks[lang] = loc;
      /*jshint evil:true */

      _pl[lang] = _pl[lang] || new Function("n", "return (".concat(translations[loc].p, ") | 0"));
    });
  }
  /**
   * sets the locale.
   *
   * @param string locale
   */


  _createClass(L10n, [{
    key: "setLocale",
    value: function setLocale(locale) {
      this.locale = locale;
      this._language = locale.substr(0, 2);
    }
    /**
     * returns the current locale.
     *
     * @return string current locale
     */

  }, {
    key: "getLocale",
    value: function getLocale() {
      return this.locale;
    }
    /**
     * Translates a string into the given locale.
     *
     * @param  string msgid the message to translate
     * @param  string loc the target locale
     * @return string the translated message, or, if there is no translation, the original message
     */

  }, {
    key: "t",
    value: function t(msgid) {
      return this._getEntry(msgid) || msgid;
    }
    /**
     * Translates a string in a certain context into the given locale.
     *
     * This is useful when two original strings have different meanings and will most
     * likely require different translations.
     *
     * For example, in a financial context, the English word “amount” would translate
     * to the German „Betrag“, while in a context where items are counted, the German
     * translation would be „Anzahl“. Prefixing the translation with a context allows
     * translators to add both translations.
     *
     * @param  string context the context
     * @param  string msgid the message to translate
     * @param  string loc the target locale
     * @return string the translated message, or, if there is no translation, the original message
     */

  }, {
    key: "x",
    value: function x(context, msgid) {
      return this._getEntry("".concat(context, "\x04").concat(msgid)) || msgid;
    }
    /**
     * Translates a pluralized string in a certain context into the given locale.
     *
     * This function uses “pluralisation rules” to determine the correct form in the target
     * language. For example, many languages have more than two plural forms, and this
     * function will select the correct one.
     *
     * NOTE: This function will not fill in the value into the placeholder in the
     * plural form, but only return the correct message. You must either use something like
     * sprintf() or some other replacement implementation, e.g. `msg.replace("%s", value)`.
     *
     * @param  string msgid the message to translate, singular form
     * @param  string msgidPlural the message to translate, plural form
     * @param  integer amount number to use to determine the correct plural form
     * @return string the translated message, or, if there is no translation, the original message
     */

  }, {
    key: "n",
    value: function n(msgid, msgidPlural, amount) {
      var entry = this._getEntry(msgid);

      return entry && entry[0] && entry[1] ? entry[_pl[this._language](amount)] : amount === 1 ? msgid : msgidPlural;
    }
    /*istanbul ignore next */

  }, {
    key: "_getEntry",
    value: function _getEntry(msgid) {
      var key;
      if (this._catalogs[this.locale]) key = this.locale;else if (this._catalogs[this._fallbacks[this._language]]) key = this._fallbacks[this._language];
      return this._catalogs[key] ? this._catalogs[key][msgid] : undefined;
    }
  }]);

  return L10n;
}(); // have one "global" map of pluralizers so we don’t have to create the functions multiple times


exports["default"] = L10n;
var _pl = {};

