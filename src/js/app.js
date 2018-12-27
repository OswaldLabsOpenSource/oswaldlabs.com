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

// Agastya tracking event listener funciton
const agastyaTrackLink = event => {
	const eventElement = event.target || event.toElement || event.srcElement;
	if (eventElement && window.agastya && typeof window.agastya.track === "function") {
		window.agastya.track("custom", {
			className: eventElement.className,
			href: eventElement.href,
			innerText: eventElement.innerText
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
		// Add Agastya tracking listener for external link
		// then add/remove listener from links on barba
		const links = document.querySelectorAll("a");
		links.forEach(link => {
			link.classList.remove("active");
			link.classList.remove("subactive");
			link.removeEventListener("click", agastyaTrackLink);
			if (simplify(link.getAttribute("href")) === simplify(location.pathname)) {
				link.classList.add("active");
			} else if (
				link.getAttribute("href") !== "/" &&
				simplify(location.pathname).includes(simplify(link.getAttribute("href")))
			) {
				link.classList.add("subactive");
			}
			if (location.hostname !== link.hostname) {
				link.addEventListener("click", agastyaTrackLink);
				link.setAttribute("target", "_blank");
				link.setAttribute("rel", "noopener noreferrer");
				if (
					!link.getAttribute("href").includes("mailto:") &&
					!link.getAttribute("href").includes("tel:")
				) {
					link.classList.add("has-external-link");
					if (link.getAttribute("href").includes("?")) {
						link.setAttribute("href", link.getAttribute("href") + "&");
					} else {
						link.setAttribute("href", link.getAttribute("href") + "?");
					}
					link.setAttribute(
						"href",
						link.getAttribute("href") +
							"utm_source=oswald_labs&utm_medium=website&utm_campaign=external_link&utm_content=oswaldlabs.com"
					);
				}
			}
		});
		const subNav = document.querySelector(".subnav-menu nav, .subnav nav");
		if (subNav && !subNav.querySelector(".active") && subNav.querySelector(".subactive")) {
			subNav.querySelectorAll(".subactive")[subNav.querySelectorAll(".subactive").length - 1].classList.add("active");
			subNav.querySelectorAll(".subactive")[subNav.querySelectorAll(".subactive").length - 1].classList.remove("subactive");
		}
		const pricingSelector = document.querySelector(".agastya-pricing-selector");
		const amountSelector = document.querySelector(".agastya-calculated-price");
		const btnRequest = document.querySelector(".btn-request");
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
				if (btnRequest) {
					btnRequest.setAttribute("href", "/platform/agastya/register/?pageviews=" + pricingSelector.value);
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
		const calendlyLink = document.querySelector(".calendly-button");
		if (calendlyLink) {
			loadJS("https://assets.calendly.com/assets/external/widget.js");
		}
		const ipAddress = document.querySelector(".ip-address-fill");
		if (ipAddress) {
			fetch("https://ipinfo.io/json")
				.then(response => response.json())
				.then(json => {
					if (json.ip) ipAddress.value = json.ip;
					["city", "country", "org", "region", "postal", "loc"].forEach(value => {
						if (json[value] && document.querySelector(`.${value}-fill`)) {
							document.querySelector(`.${value}-fill`).value = json[value];
						}
					});
				})
		}
		const departmentSelect = document.querySelector(".department-select");
		if (departmentSelect) {
			const urlParams = new URLSearchParams(window.location.search);
			const departmentInfo = urlParams.get("department");
			if (departmentInfo) {
				departmentSelect.value = departmentInfo;
			}
		}
		const pricingSelectPrefill = document.querySelector(".agastya-pricing-prefill");
		if (pricingSelectPrefill) {
			const urlParams = new URLSearchParams(window.location.search);
			const planInfo = urlParams.get("pageviews");
			if (planInfo) {
				pricingSelectPrefill.value = planInfo;
			}
		}
		// gtag('config', 'UA-58910975-1', {
		// 	'page_title': document.title,
		// 	'page_path': location.pathname
		// });
	}
	initMe();
	const Barba = Barba || window.Barba;
	if (Barba) {
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
	}
});
