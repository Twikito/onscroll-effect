/**
 * -------------------------------------------------------------------
 * onscroll-effect
 * Toggle class to enable CSS animations when element appears on viewport when scrolling.
 *
 * @author Matthieu Bué <https://twikito.com>
 * @version v1.0.0
 * @link https://github.com/Twikito/onscroll-effect#readme
 * @license MIT
 * -------------------------------------------------------------------
 */

(() => {
	const PREFIX = "scroll";

	// Debounce function: https://davidwalsh.name/javascript-debounce-function
	const debounce = (func, wait, immediate) => {
		let timeout;
		return function() {
			const
				context = this,
				args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (immediate && !timeout) func.apply(context, args);
		};
	};

	const scrollEffect = () => {
		let windowScrollTop = window.scrollY,
			windowInnerHeight = window.innerHeight;

		[...document.querySelectorAll(`[data-${PREFIX}]`)].forEach(node => {
			const
				config = {
					className: node.dataset[PREFIX],
					repeat: node.dataset[PREFIX + "Repeat"],
					offset: +node.dataset[PREFIX + "Offset"],
					count: +node.dataset[PREFIX + "Count"]
				},
				scrollClass = config.className || "is-outside",
				scrollOffset = isNaN(config.offset) ? 0 : config.offset,
				scrollCount = isNaN(node.scrollCount) ? 0 : node.scrollCount,
				scrollRepeat = isNaN(+config.repeat) ? 1 : +config.repeat,
				scrollInfiniteRepeat = config.repeat === "true",
				nodeRect = node.getBoundingClientRect();

			// if ( has the class AND viewport bottom >= top of object + offset AND viewport top <= bottom of object - offset )
			if (
				node.classList.contains(scrollClass) &&
				nodeRect.top + scrollOffset <= windowInnerHeight &&
				nodeRect.bottom - scrollOffset >= 0
			) {
				node.classList.remove(scrollClass);
			}

			// if ( first scroll OR ( ( infinite OR less that max ) AND ( has not the class AND ouside of viewport ) ) )
			if (
				(!node.classList.contains(scrollClass) && scrollCount === 0) ||
				((scrollInfiniteRepeat || scrollCount < scrollRepeat) &&
					(!node.classList.contains(scrollClass) &&
						(nodeRect.top > windowInnerHeight || nodeRect.bottom < 0)))
			) {
				node.classList.add(scrollClass);
				node.scrollCount = scrollCount + 1;
			}
		});
	};

	// Trigger two times – on each readystatechange – to animate elements already in viewport:
	// First, add the class, then remove it, so you can see the animation
	document.addEventListener("readystatechange", function(e) {
		scrollEffect();
		if (document.readyState === "complete") {
			e.target.removeEventListener(e.type, arguments.callee);
		}
	});

	window.addEventListener("scroll", debounce(scrollEffect, 10), true);

	window.initScrollEffect = () => {
		scrollEffect();
		scrollEffect();
	}
})();
