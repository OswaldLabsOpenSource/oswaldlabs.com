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
  function initMe(container) {
    if (container && container.querySelector(".page-meta .page-slug")) {
      document.body.className = "page-" + container.querySelector(".page-meta .page-slug").innerHTML;
    }

    var links = document.querySelectorAll("a");
    links.forEach(function (link) {
      link.classList.remove("active");
      link.classList.remove("subactive");

      if (link.getAttribute("href") === location.pathname) {
        link.classList.add("active");
      } else if (link.getAttribute("href") !== "/" && location.pathname.includes(link.getAttribute("href"))) {
        link.classList.add("subactive");
      }
    }); // gtag('config', 'UA-58910975-1', {
    // 	'page_title': document.title,
    // 	'page_path': location.pathname
    // });
  }

  initMe();
  var FadeTransition = Barba.BaseTransition.extend({
    start: function start() {
      Promise.all([this.newContainerLoading, this.fadeOut()]).then(this.fadeIn.bind(this));
    },
    fadeOut: function fadeOut() {
      document.body.classList.add("fade-out");
      return new Promise(function (resolve) {
        window.scrollTo(0, 0);
        resolve();
      });
    },
    fadeIn: function fadeIn() {
      document.body.classList.remove("fade-out");
      this.newContainer.classList.toggle("fade-in");
      this.done();
    }
  });

  Barba.Pjax.getTransition = function () {
    return FadeTransition;
  };

  Barba.Pjax.start();
  Barba.Dispatcher.on("newPageReady", function (currentStatus, oldStatus, container) {
    initMe(container);
  });
});