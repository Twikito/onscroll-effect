# onScroll Effect

This library toggles a class to an element when it appears on viewport when user scrolls. It lets you build CSS transitions or animations launched only when user scrolls on it.

Note that in order to not be JavaScript dependant, this library add the class when the element __is outside__ of the viewport. This way, if you have a JS error, it's the default state that will appears on scroll.

[![dependencies Status](https://david-dm.org/Twikito/onscroll-effect/status.svg?style=flat-square)](https://david-dm.org/Twikito/onscroll-effect)
[![devDependencies Status](https://david-dm.org/Twikito/onscroll-effect/dev-status.svg?style=flat-square)](https://david-dm.org/Twikito/onscroll-effect?type=dev)
[![GitHub license](https://img.shields.io/github/license/Twikito/onscroll-effect.svg?style=flat-square)](https://github.com/Twikito/onscroll-effect/blob/master/LICENSE)

## Usage

```html
data-scroll="class"
```
A CSS class name, added when this element is outside of viewport, `is-outside` if empty.

```html
data-scroll-repeat="('true'|'false'|number)"
```
_optional_ — Specify if the class will be added each time the element appears in viewport or not, or a maximum number of iteration. `false` if not specified.

```html
data-scroll-offset="(number)"
```
_optional_ — Specify an offset in pixels to take into account from the top and bottom edges of the viewport.

## Examples

```html
<div data-scroll> … </div>

<div data-scroll="my-class"> … </div>

<div data-scroll="my-class" data-scroll-repeat="true"> … </div>

<div data-scroll="my-class" data-scroll-repeat="10" data-scroll-offset="100"> … </div>

```

## License

MIT. Copyright (c) [Matthieu Bué](https://twikito.com)
