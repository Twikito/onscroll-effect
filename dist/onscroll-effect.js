/**
 * -------------------------------------------------------------------
 * onscroll-effect
 * A tiny JavaScript library to enable CSS animations when user scrolls.
 *
 * @author Matthieu Bué <https://twikito.com>
 * @version v1.2.0
 * @link https://twikito.github.io/onscroll-effect/
 * @license MIT
 * -------------------------------------------------------------------
 */

"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

(function () {
  var INSIDE_VP = new Event("insideViewport"),
      OUTSIDE_VP = new Event("outsideViewport"),
      PREFIX = document.documentElement.getAttribute("data-onscroll-effect-custom-prefix") || "scroll";
  var warn = false; // Debounce function: https://davidwalsh.name/javascript-debounce-function

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

  var isUndefined = function isUndefined(v) {
    return typeof v === "undefined";
  };

  var scrollEffect = function scrollEffect() {
    var nodeList = _toConsumableArray(document.querySelectorAll("[data-".concat(PREFIX, "]")));

    if (!warn && nodeList.length === 0) {
      warn = true;
      return console.warn("onScroll Effect is not used: there's no element with 'data-".concat(PREFIX, "' attribute."));
    }

    warn = false;
    nodeList.filter(function (node) {
      return isUndefined(node.isRepeating) || node.isRepeating;
    }).forEach(function (node) {
      var config = {
        className: node.dataset[PREFIX],
        repeat: node.dataset[PREFIX + "Repeat"],
        offset: Number(node.dataset[PREFIX + "Offset"]),
        count: Number(node.dataset[PREFIX + "Count"]),
        reverse: node.dataset[PREFIX + "Reverse"]
      },
          nodeRect = node.getBoundingClientRect(),
          scrollReverse = config.reverse === "true",
          scrollClass = config.className || (scrollReverse ? "is-inside" : "is-outside"),
          scrollInfiniteRepeat = config.repeat === "true",
          scrollOffset = isNaN(config.offset) ? 0 : config.offset,
          scrollRepeat = isNaN(Number(config.repeat)) ? 1 : Number(config.repeat),
          scrollClassToggled = scrollReverse ? !node.classList.contains(scrollClass) : node.classList.contains(scrollClass);
      node.repeatCount = isUndefined(node.repeatCount) ? 0 : node.repeatCount;
      node.isRepeating = isUndefined(node.isRepeating) ? true : node.isRepeating; // if ( has the class AND viewport bottom >= top of object + offset AND viewport top <= bottom of object - offset )

      if (scrollClassToggled && nodeRect.top + scrollOffset <= window.innerHeight && nodeRect.bottom - scrollOffset >= 0) {
        node.classList[scrollReverse ? "add" : "remove"](scrollClass);
        node.repeatCount += 1;
        node.isInViewport = true;
        node.dispatchEvent(INSIDE_VP);

        if (!scrollInfiniteRepeat && node.repeatCount >= scrollRepeat) {
          node.isRepeating = false;
        }

        return node.isInViewport;
      } // if ( first scroll OR ( ( infinite OR less that max ) AND ( has not the class AND ouside of viewport ) ) )


      if (!scrollClassToggled && node.repeatCount === 0 || (scrollInfiniteRepeat || node.repeatCount < scrollRepeat) && !scrollClassToggled && (nodeRect.top > window.innerHeight || nodeRect.bottom < 0)) {
        node.classList[scrollReverse ? "remove" : "add"](scrollClass);
        node.isInViewport = false;
        node.dispatchEvent(OUTSIDE_VP);
        return node.isInViewport;
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
  window.addEventListener("scroll", debounce(scrollEffect, 10), true);

  window.initOnScrollEffect = function () {
    scrollEffect();
    scrollEffect();
  };
})();