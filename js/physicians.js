/* ============================================================
   FAVOR FOOT & ANKLE LEG / WOUND CENTER
   PHYSICIANS PAGE JAVASCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     01. MOBILE NAVIGATION
     
     Uses the existing navigation structure from root.css.
     The root.css file already provides the .is-open behavior.
     ========================================================== */

  const toggle = document.querySelector(".navbar-toggle");
  const nav = document.querySelector("#primary-navigation");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {

      const isOpen = nav.classList.toggle("is-open");

      toggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      toggle.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );

    });


    /* Close mobile navigation after clicking a link */

    nav.querySelectorAll("a").forEach((link) => {

      link.addEventListener("click", () => {

        nav.classList.remove("is-open");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

        toggle.setAttribute(
          "aria-label",
          "Open navigation menu"
        );

      });

    });

  }


  /* ==========================================================
     02. NAVBAR SCROLL STATE
     
     Adds the "scrolled" class after the visitor scrolls down.
     This can be styled by root.css or physicians.css.
     ========================================================== */

  const navbar = document.querySelector(".navbar");

  const updateNavbar = () => {

    if (!navbar) {
      return;
    }

    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 12
    );

  };

  /* Set correct state immediately when page loads */

  updateNavbar();


  /* Update navbar while scrolling */

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );


  /* ==========================================================
     03. DR. WELLS VIDEO
     
     Controls the custom play button and video overlay.
     ========================================================== */

  const video = document.querySelector(
    "#physician-video"
  );

  const videoOverlay = document.querySelector(
    "#video-overlay"
  );

  const videoPlay = document.querySelector(
    "#video-play"
  );


  if (video && videoOverlay && videoPlay) {

    /* Hide the custom overlay */

    const hideOverlay = () => {

      videoOverlay.classList.add(
        "is-hidden"
      );

    };


    /* Show the custom overlay */

    const showOverlay = () => {

      videoOverlay.classList.remove(
        "is-hidden"
      );

    };


    /* Custom play button */

    videoPlay.addEventListener(
      "click",
      async () => {

        try {

          if (video.paused) {

            await video.play();

          } else {

            video.pause();

          }

        } catch (error) {

          console.warn(
            "The physician video could not be started.",
            error
          );

        }

      }
    );


    /* When video starts playing */

    video.addEventListener(
      "play",
      hideOverlay
    );


    /* When video is paused */

    video.addEventListener(
      "pause",
      () => {

        /*
         * Don't immediately show the overlay if the video
         * has not actually started yet.
         */

        if (
          video.currentTime > 0 &&
          !video.ended
        ) {

          showOverlay();

        }

      }
    );


    /* When video finishes */

    video.addEventListener(
      "ended",
      showOverlay
    );

  }


  /* ==========================================================
     04. SCROLL REVEAL ANIMATIONS
     
     Elements using:

       class="reveal-on-scroll"

     will receive:

       class="is-visible"

     when they enter the viewport.
     
     The actual animation is defined in physicians.css.
     ========================================================== */

  const revealItems = document.querySelectorAll(
    ".reveal-on-scroll"
  );


  if (
    revealItems.length &&
    "IntersectionObserver" in window
  ) {

    const observer = new IntersectionObserver(

      (entries, observerInstance) => {

        entries.forEach((entry) => {

          /*
           * Ignore elements that haven't entered
           * the viewport yet.
           */

          if (!entry.isIntersecting) {
            return;
          }


          /* Activate the CSS animation */

          entry.target.classList.add(
            "is-visible"
          );


          /*
           * Stop observing once the animation has
           * been triggered.
           */

          observerInstance.unobserve(
            entry.target
          );

        });

      },

      {
        /*
         * Animation starts when approximately 12%
         * of the element is visible.
         */

        threshold: 0.12,

        /*
         * Trigger slightly before the element reaches
         * the very bottom of the viewport.
         */

        rootMargin: "0px 0px -40px 0px"
      }

    );


    /* Observe every animated element */

    revealItems.forEach((item) => {

      observer.observe(item);

    });

  } else {

    /*
     * Fallback for browsers without
     * IntersectionObserver support.
     *
     * Simply make everything visible.
     */

    revealItems.forEach((item) => {

      item.classList.add(
        "is-visible"
      );

    });

  }


  /* ==========================================================
     05. CURRENT YEAR
     
     Automatically updates:

       <span id="current-year"></span>

     in the footer.
     ========================================================== */

  const year = document.querySelector(
    "#current-year"
  );


  if (year) {

    year.textContent = String(
      new Date().getFullYear()
    );

  }

});
