(function ($) {
  "use strict";

  /* Page Loader active
  ========================================================*/
  $("#preloader").fadeOut();

  /* 
 VIDEO POP-UP
 ========================================================================== */
  $(".video-popup").magnificPopup({
    disableOn: 700,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  /* 
   Back Top Link
   ========================================================================== */
  var offset = 200;
  var duration = 500;
  $(window).scroll(function () {
    if ($(this).scrollTop() > offset) {
      $(".back-to-top").fadeIn(400);
    } else {
      $(".back-to-top").fadeOut(400);
    }
  });

  $(".back-to-top").on("click", function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      600
    );
    return false;
  });

  if ($(window).width() < 500) {
    $(".nav-dis").addClass("menu-bg");
  }
  /* 
   One Page Navigation
   ========================================================================== */
  $(window).on("load", function () {
    $("body").scrollspy({
      target: ".navbar-collapse",
      offset: 195,
    });

    $(window).on("scroll", function () {
      if ($(window).width() > 500) {
        if ($(window).scrollTop() > 100) {
          $(".nav-dis").addClass("menu-bg");
        } else {
          $(".nav-dis").removeClass("menu-bg");
        }
      }
    });
  });

  /* Auto Close Responsive Navbar on Click
  ========================================================*/
  function close_toggle() {
    if ($(window).width() <= 768) {
      $(".coll").on("click", function () {
        $(".navbar-collapse").collapse("hide");
      });
    } else {
      $(".navbar .navbar-inverse a").off("click");
    }
  }
  close_toggle();
  $(window).resize(close_toggle);

  /* Nivo Lightbox
  ========================================================*/
  $(".lightbox").nivoLightbox({
    effect: "fadeScale",
    keyboardNav: true,
  });
})(jQuery);

const title = document.getElementById("title");
const cursor = document.getElementById("cursor");

const textArray = ["easy.", "fast.", "convenient."];
const typingDelay = 40;
const eraseDelay = 40;
const newTextDelay = 1000;
let textArrayIndex = 0;
let charIndex = 0;

let type = () => {
  if (charIndex < textArray[textArrayIndex].length) {
    if (!cursor.classList.contains("cursorActive"))
      cursor.classList.add("cursorActive");
    title.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    cursor.classList.remove("cursorActive");
    setTimeout(erase, newTextDelay);
  }
};

let erase = () => {
  if (charIndex > 0) {
    if (!cursor.classList.contains("cursorActive"))
      cursor.classList.add("cursorActive");
    title.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, eraseDelay);
  } else {
    cursor.classList.remove("cursorActive");
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) {
      textArrayIndex = 0;
    }
    setTimeout(type, typingDelay + 1100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (textArray.length) setTimeout(type, 400);
});

document.querySelector(".prod-link").removeEventListener("click", () => {});
