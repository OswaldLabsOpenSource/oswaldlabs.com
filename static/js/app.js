"use strict";

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    document.attachEvent("onreadystatechange", function () {
      if (document.readyState !== "loading") fn();
    });
  }
}

ready(function () {
  var links = document.querySelectorAll("a");
  links.forEach(function (link) {
    if (link.getAttribute("href") === location.pathname) {
      link.classList.add("active");
    } else if (link.getAttribute("href") !== "/" && location.pathname.includes(link.getAttribute("href"))) {
      link.classList.add("subactive");
    }
  });
});