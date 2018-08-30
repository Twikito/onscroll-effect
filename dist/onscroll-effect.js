/**
 * -------------------------------------------------------------------
 * onscroll-effect
 * A tiny JavaScript library to enable CSS animations when user scrolls.
 *
 * @author Matthieu Bué <https://twikito.com>
 * @version v1.0.1
 * @link https://github.com/Twikito/onscroll-effect#readme
 * @license MIT
 * -------------------------------------------------------------------
 */

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
	var INSIDE_VP = new Event("insideViewport"),
	    OUTSIDE_VP = new Event("outsideViewport"),
	    PREFIX = document.documentElement.getAttribute("data-onscroll-effect-custom-prefix") || "scroll";

	var warn = false;

	// Debounce function: https://davidwalsh.name/javascript-debounce-function
	var debounce = function debounce(func, wait, immediate) {
		var timeout = void 0;
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

	var scrollEffect = function scrollEffect() {
		var nodeList = [].concat(_toConsumableArray(document.querySelectorAll("[data-" + PREFIX + "]")));

		if (!warn && nodeList.length === 0) {
			warn = true;
			return console.warn("onScroll Effect is not used: there's no element with 'data-" + PREFIX + "' attribute.");
		}
		warn = false;

		nodeList.filter(function (node) {
			return node.isRepeating !== false;
		}).forEach(function (node) {
			var config = {
				className: node.dataset[PREFIX],
				repeat: node.dataset[PREFIX + "Repeat"],
				offset: Number(node.dataset[PREFIX + "Offset"]),
				count: Number(node.dataset[PREFIX + "Count"])
			},
			    nodeRect = node.getBoundingClientRect(),
			    scrollClass = config.className || "is-outside",
			    scrollCount = isNaN(node.repeatCount) ? 0 : node.repeatCount,
			    scrollInfiniteRepeat = config.repeat === "true",
			    scrollOffset = isNaN(config.offset) ? 0 : config.offset,
			    scrollRepeat = isNaN(Number(config.repeat)) ? 1 : Number(config.repeat);

			node.isRepeating = node.isRepeating === undefined ? true : node.isRepeating;

			// if ( has the class AND viewport bottom >= top of object + offset AND viewport top <= bottom of object - offset )
			if (node.classList.contains(scrollClass) && nodeRect.top + scrollOffset <= window.innerHeight && nodeRect.bottom - scrollOffset >= 0) {
				node.classList.remove(scrollClass);
				node.dispatchEvent(INSIDE_VP);

				if (!scrollInfiniteRepeat && scrollCount >= scrollRepeat) {
					node.isRepeating = false;
				}

				return node.isInViewport = true;
			}

			// if ( first scroll OR ( ( infinite OR less that max ) AND ( has not the class AND ouside of viewport ) ) )
			if (!node.classList.contains(scrollClass) && scrollCount === 0 || (scrollInfiniteRepeat || scrollCount < scrollRepeat) && !node.classList.contains(scrollClass) && (nodeRect.top > window.innerHeight || nodeRect.bottom < 0)) {
				node.classList.add(scrollClass);
				node.repeatCount = scrollCount + 1;
				node.dispatchEvent(OUTSIDE_VP);

				return node.isInViewport = false;
			}
		});
	};

	/*
  * Trigger two times – on each readystatechange – to animate elements already in viewport:
  * First, add the class, then remove it, so you can see the animation
  */
	document.addEventListener("readystatechange", function (e) {
		scrollEffect();
		if (document.readyState === "complete") {
			e.target.removeEventListener(e.type, arguments.callee);
		}
	});

	window.addEventListener("scroll", debounce(scrollEffect, 10), true);

	window.initOnScrollEffect = function () {
		scrollEffect();
		scrollEffect();
	};
})();