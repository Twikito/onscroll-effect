/**
 * -------------------------------------------------------------------
 * onscroll-effect
 * A tiny JavaScript library to enable CSS animations when user scrolls.
 *
 * @author Matthieu Bué <https://twikito.com>
 * @version v1.3.0
 * @link https://twikito.github.io/onscroll-effect/
 * @license MIT
 * -------------------------------------------------------------------
 */

"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function () {
  var INSIDE_VP = new Event("insideViewport"),
      OUTSIDE_VP = new Event("outsideViewport"),
      PREFIX = document.documentElement.getAttribute("data-onscroll-effect-custom-prefix") || "scroll";
  var warn = false;
  /*
   * Debounce function: https://davidwalsh.name/javascript-debounce-function
   */

  var debounce = function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var args = arguments,
          context = this;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) Reflect.apply(func, context, args);
      }, wait);
      if (immediate && !timeout) Reflect.apply(func, context, args);
    };
  };
  /*
   * Add a namespace to a property
   */


  var namespacedProp = function namespacedProp(property) {
    return "onscrollEffect_".concat(property);
  };
  /*
   * Test if undefined
   */


  var isUndefined = function isUndefined(v) {
    return typeof v === "undefined";
  };
  /*
   * scroll effect handler
   */


  var scrollEffect = function scrollEffect() {
    var nodeList = _toConsumableArray(document.querySelectorAll("[data-".concat(PREFIX, "]")));

    if (!warn && nodeList.length === 0) {
      warn = true;
      return console.warn("onScroll Effect is not used: there's no element with 'data-".concat(PREFIX, "' attribute."));
    }

    warn = false;
    nodeList.filter(function (node) {
      return isUndefined(node[namespacedProp('isRepeating')]) || node[namespacedProp('isRepeating')];
    }).forEach(function (node) {
      var config = {
        className: node.dataset[PREFIX].split(' ').filter(Boolean),
        repeat: node.dataset[PREFIX + "Repeat"],
        offset: Number(node.dataset[PREFIX + "Offset"]),
        count: Number(node.dataset[PREFIX + "Count"]),
        reverse: node.dataset[PREFIX + "Reverse"]
      },
          nodeRect = node.getBoundingClientRect(),
          REVERSE = config.reverse === "true",
          // Add class list when inside
      CLASSLIST = config.className.length ? config.className : [REVERSE ? "is-inside" : "is-outside"],
          INFINITE_REPEAT = config.repeat === "true",
          OFFSET = isNaN(config.offset) ? 0 : config.offset,
          REPEAT = isNaN(Number(config.repeat)) ? 1 : Number(config.repeat),
          HAS_CLASSLIST = !CLASSLIST.filter(function (item) {
        return !node.classList.contains(item);
      }).length;
      node[namespacedProp('repeatingCount')] = isUndefined(node[namespacedProp('repeatingCount')]) ? 0 : node[namespacedProp('repeatingCount')];
      node[namespacedProp('isRepeating')] = isUndefined(node[namespacedProp('isRepeating')]) ? true : node[namespacedProp('isRepeating')]; // if ( ((add when outside AND has the class list) OR (add when inside AND has not the class list)) AND viewport bottom >= top of object + offset AND viewport top <= bottom of object - offset )

      if ((!REVERSE && HAS_CLASSLIST || REVERSE && !HAS_CLASSLIST) && nodeRect.top + OFFSET <= window.innerHeight && nodeRect.bottom - OFFSET >= 0) {
        var _node$classList;

        (_node$classList = node.classList)[REVERSE ? "add" : "remove"].apply(_node$classList, _toConsumableArray(CLASSLIST));

        node[namespacedProp('repeatingCount')] += 1;
        node[namespacedProp('isInsideViewport')] = true;
        node.dispatchEvent(INSIDE_VP);

        if (!INFINITE_REPEAT && node[namespacedProp('repeatingCount')] >= REPEAT) {
          node[namespacedProp('isRepeating')] = false;
        }

        return true;
      } // if ( ((add when outside AND has not the class list) OR (add when inside AND has the class list)) AND first scroll OR ( ( infinite OR less that max ) AND ouside of viewport ) )


      if ((!REVERSE && !HAS_CLASSLIST || REVERSE && HAS_CLASSLIST) && (node[namespacedProp('repeatingCount')] === 0 || (INFINITE_REPEAT || node[namespacedProp('repeatingCount')] < REPEAT) && (nodeRect.top > window.innerHeight || nodeRect.bottom < 0))) {
        var _node$classList2;

        (_node$classList2 = node.classList)[REVERSE ? "remove" : "add"].apply(_node$classList2, _toConsumableArray(CLASSLIST));

        node[namespacedProp('isInsideViewport')] = false;
        node.dispatchEvent(OUTSIDE_VP);
        return false;
      }
    });
  };
  /*
   * Trigger two times – on each readystatechange – to animate elements already in viewport:
   * First, add the class, then remove it, so you can see the animation
   */


  var initHandler = function initHandler() {
    scrollEffect();

    if (document.readyState === "complete") {
      document.removeEventListener("readystatechange", initHandler);
    }
  };

  document.addEventListener("readystatechange", initHandler);
  /*
   * Trigger scroll effect handler on scroll, with debounce
   */

  window.addEventListener("scroll", debounce(scrollEffect, 10), true);
  /*
   * Expose methods
   */

  window.onScrollEffect = Object.assign(function () {
    scrollEffect();
    scrollEffect();
  }, {
    'isRepeating': function isRepeating(node) {
      return node[namespacedProp('isRepeating')];
    },
    'repeatingCount': function repeatingCount(node) {
      return node[namespacedProp('repeatingCount')];
    },
    'isInsideViewport': function isInsideViewport(node) {
      return node[namespacedProp('isInsideViewport')];
    }
  });
})();