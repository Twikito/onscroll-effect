(() => {

	const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

	const container = document.querySelector(".demo");

	for (let i = 0; i <= 97; i++) {

		let btn = document.createElement("button");

		btn.setAttribute("type", "button");
		btn.setAttribute("data-scroll", "");
		btn.classList.add(`anime-${getRandomInt(4)+1}`)
		btn.setAttribute("title", "data-scroll");

		if (getRandomInt(3)) {
			btn.classList.add("is-round");
			if (getRandomInt(2)) {
				btn.setAttribute("data-scroll-repeat", "true");
				btn.setAttribute("title", `${btn.getAttribute("title")} data-scroll-repeat="true"`);
			} else {
				btn.setAttribute("data-scroll-repeat", getRandomInt(9)+1);
				btn.setAttribute("title", `${btn.getAttribute("title")} data-scroll-repeat="${btn.getAttribute("data-scroll-repeat")}"`);
			}
		}

		if (getRandomInt(2)) {
			btn.setAttribute("data-scroll-offset", getRandomInt(30)*10);
				btn.setAttribute("title", `${btn.getAttribute("title")} data-scroll-offset="${btn.getAttribute("data-scroll-offset")}"`);
		}

		container.appendChild(btn);
	}

})();
