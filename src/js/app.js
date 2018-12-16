/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
var loadJS = function(src, cb, ordered) {
	var tmp,
		w = window;
	var ref = w.document.getElementsByTagName("script")[0];
	var script = w.document.createElement("script");
	if (typeof cb === "boolean") {
		tmp = ordered;
		ordered = cb;
		cb = tmp;
	}
	script.src = src;
	script.async = !ordered;
	ref.parentNode.insertBefore(script, ref);
	if (cb && typeof cb === "function") {
		script.onload = cb;
	}
	return script;
};

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
		const simplify = url => {
			if (!url || typeof url.toLowerCase === "undefined") return;
			return url.toLowerCase().replace(/\//g, "");
		};
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
			if (location.hostname !== link.hostname) {
				link.classList.add("has-external-link");
				link.setAttribute("target", "_blank");
				link.setAttribute("rel", "noopener noreferrer");
				if (!link.getAttribute("href").includes("mailto:")) {
					if (link.getAttribute("href").includes("?")) {
						link.setAttribute("href", link.getAttribute("href") + "&");
					} else {
						link.setAttribute("href", link.getAttribute("href") + "?");
					}
					link.setAttribute(
						"href",
						link.getAttribute("href") +
							"utm_source=oswald_labs&utm_medium=website&utm_campaign=external_link&utm_content=oswaldlabs.com&ref=oswaldlabs.com"
					);
				}
			}
		});
		const pricingSelector = document.querySelector(".agastya-pricing-selector");
		const amountSelector = document.querySelector(".agastya-calculated-price");
		const pricingValues = {
			"100k": 99,
			"250k": 249,
			"500k": 499,
			"1m": 749,
			"5m": 999,
			"10m": "custom"
		};
		if (pricingSelector) {
			pricingSelector.addEventListener("change", () => {
				if (amountSelector) {
					if (pricingValues[pricingSelector.value] === "custom") {
						document.querySelector(".agastya-no-custom").style.display = "none";
						document.querySelector(".agastya-has-custom").style.display =
							"inline-block";
					} else {
						document.querySelector(".agastya-no-custom").style.display = "inline-block";
						document.querySelector(".agastya-has-custom").style.display = "none";
						amountSelector.innerHTML = pricingValues[pricingSelector.value];
					}
				}
			});
		}
		const contributeAmount = document.querySelector(".contribute-amount");
		const contributeForm = document.querySelector(".contribute-form");
		if (contributeAmount && contributeForm) {
			contributeForm.addEventListener("submit", e => {
				loadJS("https://checkout.stripe.com/checkout.js", () => {
					const handler = StripeCheckout.configure({
						key: "pk_live_2khUYvJReOob9xJ2QG4l1UoQ",
						image: "https://stripe.com/img/documentation/checkout/marketplace.png",
						locale: "auto",
						token: () => {
							alert("Thank you for your contribution!");
						}
					});
					handler.open({
						name: "Research Fund",
						description: "Oswald Labs",
						currency: "eur",
						amount: contributeAmount.value * 100
					});
					window.addEventListener("popstate", function() {
						handler.close();
					});
				});
				e.preventDefault();
			});
		}
		// gtag('config', 'UA-58910975-1', {
		// 	'page_title': document.title,
		// 	'page_path': location.pathname
		// });
	}
	initMe();
	const FadeTransition = Barba.BaseTransition.extend({
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
