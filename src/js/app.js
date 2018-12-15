function ready(fn) {
	if (document.readyState !== "loading") {
		fn();
	} else if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", fn);
	} else {
		document.attachEvent("onreadystatechange", function() {
			if (document.readyState !== "loading") fn();
		});
	}
}

ready(() => {
	function initMe(container) {
		if (container && container.querySelector(".page-meta .page-slug")) {
			document.body.className =
				"page-" + container.querySelector(".page-meta .page-slug").innerHTML;
		}
		function simplify(url) {
			if (!url || typeof url.toLowerCase === "undefined") return;
			return url.toLowerCase().replace(/\//g, "");
		}
		const links = document.querySelectorAll("a");
		links.forEach(link => {
			link.classList.remove("active");
			link.classList.remove("subactive");
			if (simplify(link.getAttribute("href")) === simplify(location.pathname)) {
				link.classList.add("active");
			} else if (
				link.getAttribute("href") !== "/" &&
				simplify(location.pathname).includes(simplify(link.getAttribute("href")))
			) {
				link.classList.add("subactive");
			}
		});
		var pricingSelector = document.querySelector(".agastya-pricing-selector");
		var amountSelector = document.querySelector(".agastya-calculated-price");
		var pricingValues = {
			"100k": 99,
			"250k": 249,
			"500k": 499,
			"1m": 749,
			"5m": 999,
			"10m": "custom"
		}
		if (pricingSelector) {
			pricingSelector.addEventListener("change", () => {
				if (amountSelector) {
					if (pricingValues[pricingSelector.value] === "custom") {
						document.querySelector(".agastya-no-custom").style.display = "none";
						document.querySelector(".agastya-has-custom").style.display = "inline-block";
					} else {
						document.querySelector(".agastya-no-custom").style.display = "inline-block";
						document.querySelector(".agastya-has-custom").style.display = "none";
						amountSelector.innerHTML = pricingValues[pricingSelector.value];
					}
				}
			});
		}
		// gtag('config', 'UA-58910975-1', {
		// 	'page_title': document.title,
		// 	'page_path': location.pathname
		// });
	}
	initMe();
	var FadeTransition = Barba.BaseTransition.extend({
		start: function() {
			Promise.all([this.newContainerLoading, this.fadeOut()]).then(this.fadeIn.bind(this));
		},
		fadeOut: function() {
			document.body.classList.add("fade-out");
			return new Promise(function(resolve) {
				window.scrollTo(0, 0);
				resolve();
			});
		},
		fadeIn: function() {
			document.body.classList.remove("fade-out");
			this.newContainer.classList.toggle("fade-in");
			this.done();
		}
	});
	Barba.Pjax.getTransition = function() {
		return FadeTransition;
	};
	Barba.Pjax.start();
	Barba.Dispatcher.on("newPageReady", function(currentStatus, oldStatus, container) {
		initMe(container);
	});
});
