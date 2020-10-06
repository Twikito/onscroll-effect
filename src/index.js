(() => {
	const
		INSIDE_VP = new Event("insideViewport"),
		OUTSIDE_VP = new Event("outsideViewport"),
		PREFIX = document.documentElement.getAttribute("data-onscroll-effect-custom-prefix") || "scroll";

	let warn = false;

	// Debounce function: https://davidwalsh.name/javascript-debounce-function
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

	const namespacedProp = property => `onscrollEffect_${property}`;

	const isUndefined = v => typeof v === "undefined";

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

			node[namespacedProp('repeatCount')] = isUndefined(node[namespacedProp('repeatCount')]) ? 0 : node[namespacedProp('repeatCount')];
			node[namespacedProp('isRepeating')] = isUndefined(node[namespacedProp('isRepeating')]) ? true : node[namespacedProp('isRepeating')];

			// if ( has the class AND viewport bottom >= top of object + offset AND viewport top <= bottom of object - offset )
			if (
				scrollClassToggled &&
				nodeRect.top + scrollOffset <= window.innerHeight &&
				nodeRect.bottom - scrollOffset >= 0
			) {
				node.classList[scrollReverse ? "add" : "remove"](scrollClass);
				node[namespacedProp('repeatCount')] += 1;
				node[namespacedProp('isInViewport')] = true;
				node.dispatchEvent(INSIDE_VP);
				if (!scrollInfiniteRepeat && node[namespacedProp('repeatCount')] >= scrollRepeat) {
					node[namespacedProp('isRepeating')] = false;
				}
				return node[namespacedProp('isInViewport')];
			}

			// if ( first scroll OR ( ( infinite OR less that max ) AND ( has not the class AND ouside of viewport ) ) )
			if (
				(!scrollClassToggled && node[namespacedProp('repeatCount')] === 0) ||
				((scrollInfiniteRepeat || node[namespacedProp('repeatCount')] < scrollRepeat) &&
					(!scrollClassToggled &&
						(nodeRect.top > window.innerHeight || nodeRect.bottom < 0)))
			) {
				node.classList[scrollReverse ? "remove" : "add"](scrollClass);
				node[namespacedProp('isInViewport')] = false;
				node.dispatchEvent(OUTSIDE_VP);
				return node[namespacedProp('isInViewport')];
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

	window.addEventListener("scroll", debounce(scrollEffect, 10), true);

	window.initOnScrollEffect = () => {
		scrollEffect();
		scrollEffect();
	};
})();
