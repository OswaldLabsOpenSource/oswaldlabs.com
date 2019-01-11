/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
const loadedScripts = [];
const loadJS = (src, cb, ordered) => {
	if (loadedScripts.includes(src)) return;
	loadedScripts.push(src);
	const script = window.document.createElement("script");
	const ref = window.document.getElementsByTagName("script")[0];
	script.src = src;
	script.async = !ordered;
	ref.parentNode.insertBefore(script, ref);
	if (cb && typeof cb === "function") {
		script.onload = cb;
	}
	return script;
};

const loadCss = (src, callback) => {
	if (loadedScripts.includes(src)) return;
	loadedScripts.push(src);
	const link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("href", src);
	link.onload = () => {
		if (callback && typeof callback === "function") callback();
	};
	link.onreadystatechange = () => {
		const state = link.readyState;
		if (state === "loaded" || state === "complete") {
			if (callback && typeof callback === "function") callback();
		} 
	};
	(document.head || document.documentElement || document.body).appendChild(link);
}

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
	if (eventElement && window.agastya && typeof window.agastya.secureTrack === "function") {
		window.agastya.secureTrack({
			className: eventElement.className,
			href: eventElement.href,
			innerText: eventElement.innerText
		});
	}
}

ready(() => {
	const navbarToggler = document.querySelector(".navbar-toggler");
	if (navbarToggler) {
		navbarToggler.addEventListener("click", () => {
			document.querySelector(".navbar-collapse").classList.toggle("show");
		});
	}
	const dropdownElements = document.querySelectorAll("[data-toggle='dropdown']");
	x.addEventListener("click", event => {
		document.querySelector("[aria-labelledby='platformDropdown']").classList.toggle("show");
		event.preventDefault();
		return false;
	});
	function initMe(container) {
		if (container && container.querySelector(".page-meta .page-slug")) {
			let hasMoved = false;
			if (document.body.className.includes("hello-bar--has-moved")) {
				hasMoved = true;
			}
			document.body.className =
				"page-" + container.querySelector(".page-meta .page-slug").innerHTML + (hasMoved ? " hello-bar--has-moved" : "");
		}
		const simplify = url => {
			if (!url || typeof url.toLowerCase === "undefined") return;
			return url.toLowerCase().replace(/\//g, "");
		};
		// Show Hello Bar on home page
		loadCss("https://unpkg.com/hello-bar@1.0.0/build/index.css", () => {
			loadJS("https://unpkg.com/hello-bar@1.0.0/build/index.js", () => {
				if (window.HelloBar && window.HelloBar.default && !document.querySelector(".hello-bar")) {
					const HelloBar = new window.HelloBar.default({
						text: "What do you think of our new website? <a href='/contact/?department=Feedback'>Give us feedback</a>.",
						background: "#231463",
						move: "header",
						targeting: {
							once: true
						}
					});
				}
			});
		})
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
				if (!link.getAttribute("href")) return;
				if (
					!link.getAttribute("href").includes("mailto:") &&
					!link.getAttribute("href").includes("tel:") &&
					!link.getAttribute("href").includes("utm_source")
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
		const currencySymbols = {
			eur: "€",
			usd: "$",
			inr: "₹"
		};
		const pricingValues = {
			eur: {
				"100k": 99,
				"250k": 249,
				"500k": 499,
				"1m": 749,
				"5m": 999,
				"10m": "custom"
			},
			usd: {
				"100k": 119,
				"250k": 289,
				"500k": 579,
				"1m": 869,
				"5m": 1159,
				"10m": "custom"
			},
			inr: {
				"100k": 7899,
				"250k": 18999,
				"500k": 38999,
				"1m": 58999,
				"5m": 78999,
				"10m": "custom"
			}
		};
		const updatePriceValues = () => {
			if (amountSelector) {
				if (pricingValues[selectedCurrency][pricingSelector.value] === "custom") {
					document.querySelector(".agastya-no-custom").style.display = "none";
					document.querySelector(".agastya-has-custom").style.display =
						"inline-block";
				} else {
					document.querySelector(".agastya-no-custom").style.display = "inline-block";
					document.querySelector(".agastya-has-custom").style.display = "none";
					amountSelector.innerHTML = pricingValues[selectedCurrency][pricingSelector.value].toLocaleString();
				}
			}
			if (btnRequest) {
				btnRequest.setAttribute("href", "/platform/agastya/register/?pageviews=" + pricingSelector.value + "&currency=" + selectedCurrency);
			}
		};
		let selectedCurrency = "eur";
		const agastyaCurrencySpan = document.querySelector(".agastya-currency");
		const switchToUsd = document.querySelectorAll("input[name='agastya-currency-selector']");
		if (switchToUsd.length) {
			for (let i = 0; i < switchToUsd.length; i++) {
				switchToUsd[i].addEventListener("change", () => {
					selectedCurrency = switchToUsd[i].value;
					agastyaCurrencySpan.innerHTML = currencySymbols[switchToUsd[i].value];
					updatePriceValues();
				});
			}
		}
		if (pricingSelector) {
			pricingSelector.addEventListener("change", () => {
				updatePriceValues();
			});
		}
		const microLinks = document.querySelectorAll(".microlink");
		if (microLinks && microLinks.length) {
			loadJS("https://cdn.jsdelivr.net/npm/@microlink/vanilla@latest/umd/microlink.min.js", () => {
				microlink(".microlink", {
					video: true
				});
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
		const currencyPrefill = document.querySelector(".agastya-currency-prefill");
		if (pricingSelectPrefill) {
			const urlParams = new URLSearchParams(window.location.search);
			const planInfo = urlParams.get("pageviews");
			if (planInfo) {
				pricingSelectPrefill.value = planInfo;
			}
		}
		if (currencyPrefill) {
			const urlParams = new URLSearchParams(window.location.search);
			const planInfo = urlParams.get("currency");
			if (planInfo) {
				currencyPrefill.value = planInfo;
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
