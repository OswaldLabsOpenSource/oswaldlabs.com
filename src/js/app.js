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

// String.prototype.includes() polyfill
if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
	  'use strict';
	  if (typeof start !== 'number') {
		start = 0;
	  }
  
	  if (start + search.length > this.length) {
		return false;
	  } else {
		return this.indexOf(search, start) !== -1;
	  }
	};
  }
  
// Array.includes polyfill
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
	  value: function(valueToFind, fromIndex) {
  
		if (this == null) {
		  throw new TypeError('"this" is null or not defined');
		}
  
		// 1. Let O be ? ToObject(this value).
		var o = Object(this);
  
		// 2. Let len be ? ToLength(? Get(O, "length")).
		var len = o.length >>> 0;
  
		// 3. If len is 0, return false.
		if (len === 0) {
		  return false;
		}
  
		// 4. Let n be ? ToInteger(fromIndex).
		//    (If fromIndex is undefined, this step produces the value 0.)
		var n = fromIndex | 0;
  
		// 5. If n ≥ 0, then
		//  a. Let k be n.
		// 6. Else n < 0,
		//  a. Let k be len + n.
		//  b. If k < 0, let k be 0.
		var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
  
		function sameValueZero(x, y) {
		  return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
		}
  
		// 7. Repeat, while k < len
		while (k < len) {
		  // a. Let elementK be the result of ? Get(O, ! ToString(k)).
		  // b. If SameValueZero(valueToFind, elementK) is true, return true.
		  if (sameValueZero(o[k], valueToFind)) {
			return true;
		  }
		  // c. Increase k by 1. 
		  k++;
		}
  
		// 8. Return false
		return false;
	  }
	});
  }

const HELLO_BAR_SHOW = true;

const request = (url, data, callback) => {
	const req = new XMLHttpRequest();
	req.onreadystatechange = () => {
		if (req.readyState == 4) {
			if (req.status >= 200 && req.status < 300) {
				typeof callback === "function" && callback(JSON.parse(req.responseText));
			} else {
				let error = false;
				try {
					error = JSON.parse(req.responseText).error;
				} catch (e) {}
				error && console.error("Agastya error", error);
			}
		}
	};
	req.open(data ? "POST" : "GET", url, true);
	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	req.send(data && JSON.stringify(data));
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

window.a11ySettings = window.a11ySettings || {};
window.a11ySettings.api = true;

ready(() => {
	const navbarToggler = document.querySelector(".navbar-toggler");
	if (navbarToggler) {
		navbarToggler.addEventListener("click", () => {
			document.querySelector(".navbar-collapse").classList.toggle("show");
		});
	}
	document.body.addEventListener("click", event => {
		const dropdownElements = document.querySelectorAll("[data-toggle='dropdown']");
		for (let i = 0; i < dropdownElements.length; i++) {
			document
				.querySelector(`[aria-labelledby="${dropdownElements[i].getAttribute("id")}"]`)
				.classList.remove("show");
			if (event.composedPath().includes(dropdownElements[i])) {
				document
					.querySelector(`[aria-labelledby="${dropdownElements[i].getAttribute("id")}"]`)
					.classList.add("show");
				event.preventDefault();
				return false;
			}
		}
	});
	function initMe(container) {
		if (navbarToggler) {
			document.querySelector(".navbar-collapse").classList.remove("show");
		}
		if (container && container.querySelector(".page-meta .page-slug")) {
			let hasMoved = false;
			if (document.body.className.includes("hello-bar--has-moved")) {
				hasMoved = true;
			}
			document.body.className =
				"page-" +
				container.querySelector(".page-meta .page-slug").innerHTML +
				(hasMoved ? " hello-bar--has-moved" : "");
		}
		const simplify = url => {
			if (!url || typeof url.toLowerCase === "undefined") return;
			return url.toLowerCase().replace(/\//g, "");
		};
		// Show Hello Bar on home page
		if (HELLO_BAR_SHOW) {
			loadCss("https://unpkg.com/hello-bar@1.3.0/build/index.css", () => {
				loadJS("https://unpkg.com/hello-bar@1.3.0/build/index.js", () => {
					if (
						window.HelloBar &&
						window.HelloBar.default &&
						!document.querySelector(".hello-bar")
					) {
						new window.HelloBar.default({
							id: "augmenta11y-2",
							text:
								"<strong>Just launched:</strong> Augmented reality reading app for children with dyslexia. <a href='/platform/shravan/apps/augmenta11y/?utm_source=hellobar&utm_terms=augmenta11y-2'>Download Augmenta11y &rarr;</a>",
							background: "#dc3545",
							move: "header",
							targeting: {
								onceUser: true
							}
						});
						// window.darkMessage = new window.HelloBar.default({
						// 	text: "🌙 Good evening! Do you want to switch to our dark theme? <button class='cta lh-1' onclick='window.agastya.api(\"cssClass\", \"night\"); window.darkMessage.hideBar()'>Activate dark theme</button>",
						// 	background: "#000",
						// 	size: "large",
						// 	fixed: true,
						// 	position: "bottom",
						// 	targeting: {
						// 		once: true,
						// 		time: {
						// 			after: {
						// 				hour: 20
						// 			}
						// 		}
						// 	}
						// });
					}
				});
			});
		}
		// Add Agastya tracking listener for external link
		// then add/remove listener from links on barba
		const links = document.querySelectorAll("a");
		for (let i = 0; i < links.length; i++) {
			const link = links[i];
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
			if (location.hostname !== link.hostname && !link.querySelectorAll("img").length) {
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
							"ref=oswaldlabs.com&utm_source=oswald_labs&utm_medium=website&utm_campaign=external_link&utm_content=oswaldlabs.com"
					);
				}
			}
		}
		setTimeout(() => {
			const subNav = document.querySelector(".subnav-menu nav, .subnav nav");
			if (subNav && !subNav.querySelector(".active") && subNav.querySelector(".subactive")) {
				subNav
					.querySelectorAll(".subactive")
					[subNav.querySelectorAll(".subactive").length - 1].classList.add("active");
			}
		}, 1);
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
					document.querySelector(".agastya-has-custom").style.display = "inline-block";
				} else {
					document.querySelector(".agastya-no-custom").style.display = "inline-block";
					document.querySelector(".agastya-has-custom").style.display = "none";
					amountSelector.innerHTML = pricingValues[selectedCurrency][
						pricingSelector.value
					].toLocaleString();
				}
			}
			if (btnRequest) {
				btnRequest.setAttribute(
					"href",
					"/platform/agastya/register/?pageviews=" +
						pricingSelector.value +
						"&currency=" +
						selectedCurrency
				);
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
			loadJS(
				"https://cdn.jsdelivr.net/npm/@microlink/vanilla@latest/umd/microlink.min.js",
				() => {
					microlink(".microlink", {
						video: true
					});
				}
			);
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
			fetch("https://ipinfo.io/json?token=07089fada04d89")
				.then(response => response.json())
				.then(json => {
					if (json.ip) ipAddress.value = json.ip;
					["city", "country", "org", "region", "postal", "loc"].forEach(value => {
						if (json[value] && document.querySelector(`.${value}-fill`)) {
							document.querySelector(`.${value}-fill`).value = json[value];
						}
					});
				});
		}
		const globalParams = new URLSearchParams(window.location.search);
		for (let param of globalParams.keys()) {
			document.body.classList.add(`has-param-${param}`);
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
		const urlPrefill = document.querySelector(".agastya-url-prefill");
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
		if (urlPrefill) {
			urlPrefill.value = location.href;
		}
		const prefillDataEvents = document.querySelectorAll(".prefill-data-events");
		const prefillDataEventsMin = document.querySelectorAll(".prefill-data-events-min");
		if (prefillDataEvents.length) {
			request("https://platform.oswaldlabs.com/data", undefined, data => {
				if (typeof data === "object" && !!data.eventsThisMonth) {
					data.eventsThisMonth = parseInt(data.eventsThisMonth || 0);
					let perMinute = 0;
					const now = new Date();
					const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
					perMinute =
						data.eventsThisMonth / ((now.getTime() - firstDay.getTime()) / 60000);
					for (let i = 0; i < prefillDataEvents.length; i++)
						prefillDataEvents[i].innerHTML =
							data.eventsThisMonth.toLocaleString().toString() + "+";
					for (let i = 0; i < prefillDataEventsMin.length; i++)
						prefillDataEventsMin[i].innerHTML = Math.ceil(perMinute)
							.toLocaleString()
							.toString();
					if (!window.countInterval)
						window.countInterval = setInterval(() => {
							let prefillDataEventsNew = document.querySelectorAll(
								".prefill-data-events"
							);
							const newNumber = Math.ceil(
								data.eventsThisMonth +
									((new Date().getTime() - now.getTime()) / 60000) * perMinute
							);
							for (let i = 0; i < prefillDataEventsNew.length; i++)
								prefillDataEventsNew[i].innerHTML =
									newNumber.toLocaleString().toString() + "+";
						}, 1000);
				}
			});
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
				Promise.all([this.newContainerLoading, this.fadeOut()]).then(
					this.fadeIn.bind(this)
				);
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
