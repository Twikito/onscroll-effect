(() => {

	const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

	const container = document.querySelector(".demo");

	for (let i = 0; i <= 27; i++) {

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

	// ---

	fetch('filesize.json')
		.then(response => response.json())
		.then(json => {
			['es6.min.js', 'es6.js'].forEach(element => {
				document.querySelector(`[data-file-size='${element}']`).innerHTML = Math.round(json[element].default/10)/100;
				document.querySelector(`[data-file-size='${element}.gzip']`).innerHTML = Math.round(json[element].gzipped/10)/100;
			});
		});

})();
