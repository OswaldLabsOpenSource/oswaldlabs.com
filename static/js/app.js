"use strict";var loadJS=function(e,t,n){var a,o=window,r=o.document.getElementsByTagName("script")[0],c=o.document.createElement("script");return"boolean"==typeof t&&(a=n,n=t,t=a),c.src=e,c.async=!n,r.parentNode.insertBefore(c,r),t&&"function"==typeof t&&(c.onload=t),c};function ready(e){"loading"!==document.readyState?e():document.addEventListener?document.addEventListener("DOMContentLoaded",e):document.attachEvent("onreadystatechange",function(){"loading"!==document.readyState&&e()})}ready(function(){function a(e){e&&e.querySelector(".page-meta .page-slug")&&(document.body.className="page-"+e.querySelector(".page-meta .page-slug").innerHTML);var t=function(e){if(e&&void 0!==e.toLowerCase)return e.toLowerCase().replace(/\//g,"")};document.querySelectorAll("a").forEach(function(e){e.classList.remove("active"),e.classList.remove("subactive"),t(e.getAttribute("href"))===t(location.pathname)?e.classList.add("active"):"/"!==e.getAttribute("href")&&t(location.pathname).includes(t(e.getAttribute("href")))&&e.classList.add("subactive"),location.hostname!==e.hostname&&(e.classList.add("has-external-link"),e.setAttribute("target","_blank"),e.setAttribute("rel","noopener noreferrer"),e.getAttribute("href").includes("?")?e.setAttribute("href",e.getAttribute("href")+"&"):e.setAttribute("href",e.getAttribute("href")+"?"),e.setAttribute("href",e.getAttribute("href")+"utm_source=oswald_labs&utm_medium=website&utm_campaign=external_link&utm_content=oswaldlabs.com&ref=oswaldlabs.com"))});var n=document.querySelector(".agastya-pricing-selector"),a=document.querySelector(".agastya-calculated-price"),o={"100k":99,"250k":249,"500k":499,"1m":749,"5m":999,"10m":"custom"};n&&n.addEventListener("change",function(){a&&("custom"===o[n.value]?(document.querySelector(".agastya-no-custom").style.display="none",document.querySelector(".agastya-has-custom").style.display="inline-block"):(document.querySelector(".agastya-no-custom").style.display="inline-block",document.querySelector(".agastya-has-custom").style.display="none",a.innerHTML=o[n.value]))});var r=document.querySelector(".contribute-amount"),c=document.querySelector(".contribute-form");r&&c&&c.addEventListener("submit",function(e){loadJS("https://checkout.stripe.com/checkout.js",function(){var e=StripeCheckout.configure({key:"pk_live_2khUYvJReOob9xJ2QG4l1UoQ",image:"https://stripe.com/img/documentation/checkout/marketplace.png",locale:"auto",token:function(){alert("Thank you for your contribution!")}});e.open({name:"Research Fund",description:"Oswald Labs",currency:"eur",amount:100*r.value}),window.addEventListener("popstate",function(){e.close()})}),e.preventDefault()})}a();var e=Barba.BaseTransition.extend({start:function(){Promise.all([this.newContainerLoading,this.fadeOut()]).then(this.fadeIn.bind(this))},fadeOut:function(){return document.body.classList.add("fade-out"),new Promise(function(e){window.scrollTo(0,0),e()})},fadeIn:function(){document.body.classList.remove("fade-out"),this.newContainer.classList.toggle("fade-in"),this.done()}});Barba.Pjax.getTransition=function(){return e},Barba.Pjax.start(),Barba.Dispatcher.on("newPageReady",function(e,t,n){a(n)})});