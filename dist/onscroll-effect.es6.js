/**
 * -------------------------------------------------------------------
 * onscroll-effect
 * A tiny JavaScript library to enable CSS animations when user scrolls.
 *
 * @author Matthieu Bué <https://twikito.com>
 * @version v1.3.1
 * @link https://twikito.github.io/onscroll-effect/
 * @license MIT
 * -------------------------------------------------------------------
 */

(() => {
	const
		INSIDE_VP = new Event("insideViewport"),
		OUTSIDE_VP = new Event("outsideViewport"),
		PREFIX = document.documentElement.getAttribute("data-onscroll-effect-custom-prefix") || "scroll";

	let warn = false;

	/*
	 * Debounce function: https://davidwalsh.name/javascript-debounce-function
	 */
	const debounce = (func, wait, immediate) => {
		let timeout;
		return function () {
			const
				args = arguments,
				context = this;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				if (!immediate) Reflect.apply(func, context, args);
			}, wait);
			if (immediate && !timeout) Reflect.apply(func, context, args);
		};
	};

	/*
	 * Add a namespace to a property
	 */
	const namespacedProp = property => `onscrollEffect_${property}`;

	/*
	 * Test if undefined
	 */
	const isUndefined = v => typeof v === "undefined";


	/*
	 * scroll effect handler
	 */
	const scrollEffect = () => {
		const nodeList = [...document.querySelectorAll(`[data-${PREFIX}]`)];

		if (!warn && nodeList.length === 0) {
			warn = true;
			return console.warn(`onScroll Effect is not used: there's no element with 'data-${PREFIX}' attribute.`);
		}
		warn = false;

		nodeList.filter(node => isUndefined(node[namespacedProp('isRepeating')]) || node[namespacedProp('isRepeating')]).forEach(node => {
			const
				config = {
					className: node.dataset[PREFIX].split(' ').filter(Boolean),
					repeat: node.dataset[PREFIX + "Repeat"],
					offset: Number(node.dataset[PREFIX + "Offset"]),
					count: Number(node.dataset[PREFIX + "Count"]),
					reverse: node.dataset[PREFIX + "Reverse"]
				},
				nodeRect = node.getBoundingClientRect(),
				REVERSE = config.reverse === "true", // Add class list when inside
				CLASSLIST = config.className.length ? config.className : [(REVERSE ? "is-inside" : "is-outside")],
				INFINITE_REPEAT = config.repeat === "true",
				OFFSET = isNaN(config.offset) ? 0 : config.offset,
				REPEAT = isNaN(Number(config.repeat)) ? 1 : Number(config.repeat),
				HAS_CLASSLIST = !CLASSLIST.filter(item => !node.classList.contains(item)).length;

			node[namespacedProp('repeatingCount')] = isUndefined(node[namespacedProp('repeatingCount')]) ? 0 : node[namespacedProp('repeatingCount')];
			node[namespacedProp('isRepeating')] = isUndefined(node[namespacedProp('isRepeating')]) ? true : node[namespacedProp('isRepeating')];

			// if ( ((add when outside AND has the class list) OR (add when inside AND has not the class list)) AND viewport bottom >= top of object + offset AND viewport top <= bottom of object - offset )
			if (
				(( !REVERSE && HAS_CLASSLIST ) || ( REVERSE && !HAS_CLASSLIST ))
				&& nodeRect.top + OFFSET <= window.innerHeight
				&& nodeRect.bottom - OFFSET >= 0
			) {
				node.classList[REVERSE ? "add" : "remove"](...CLASSLIST);
				node[namespacedProp('repeatingCount')] += 1;
				node[namespacedProp('isInsideViewport')] = true;
				node.dispatchEvent(INSIDE_VP);
				if (!INFINITE_REPEAT && node[namespacedProp('repeatingCount')] >= REPEAT) {
					node[namespacedProp('isRepeating')] = false;
				}
				return true;
			}

			// if ( ((add when outside AND has not the class list) OR (add when inside AND has the class list)) AND first scroll OR ( ( infinite OR less that max ) AND ouside of viewport ) )
			if (
				(( !REVERSE && !HAS_CLASSLIST ) || ( REVERSE && HAS_CLASSLIST ))
				&& (
					node[namespacedProp('repeatingCount')] === 0
					|| (
						(INFINITE_REPEAT || node[namespacedProp('repeatingCount')] < REPEAT)
						&& (nodeRect.top > window.innerHeight || nodeRect.bottom < 0)
					)
				)
			) {
				node.classList[REVERSE ? "remove" : "add"](...CLASSLIST);
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
	const initHandler = () => {
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
	window.onScrollEffect = Object.assign(
		() => {
			scrollEffect();
			scrollEffect();
		},
		{
			'isRepeating': node => node[namespacedProp('isRepeating')],
			'repeatingCount': node => node[namespacedProp('repeatingCount')],
			'isInsideViewport': node => node[namespacedProp('isInsideViewport')]
		}
	);
})();
