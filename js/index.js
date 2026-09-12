/* ============================================================
   FAVOR FOOT & ANKLE LEG / WOUND CENTER
   HOMEPAGE JAVASCRIPT
   ============================================================

   Purpose:
   - Homepage-specific interactions
   - Hero visual behavior
   - Condition navigation
   - Scroll reveal
   - Appointment CTA interactions
   - Testimonial/video controls
   - FAQ accordion
   - Accessibility enhancements
   - Reduced-motion support

   This file is designed to work alongside:
   - root.js
   - root.css

   Global navigation and global utilities remain in root.js.
   ============================================================ */

(() => {
  "use strict";

  /* ============================================================
     01. DOM HELPERS
     ============================================================ */

  const $ = (selector, scope = document) => scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const html = document.documentElement;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* ============================================================
     02. HOMEPAGE STATE
     ============================================================ */

  const state = {
    activeCondition: "pain",
    activeTestimonial: 0,
    videoPlaying: false
  };


  /* ============================================================
     03. HERO PARALLAX
     ============================================================

     Creates a very subtle movement effect on the hero visual.
     The effect is intentionally restrained so the page remains
     clinical and premium rather than looking like a SaaS landing
     page.
     ============================================================ */

  const initHeroParallax = () => {
    const hero = $(".home-hero");
    const visual = $(".home-hero-visual");

    if (!hero || !visual || prefersReducedMotion) {
      return;
    }

    let ticking = false;

    const updateParallax = () => {
      const rect = hero.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom < 0 || rect.top > viewportHeight) {
        ticking = false;
        return;
      }

      const progress =
        (viewportHeight - rect.top) /
        (viewportHeight + rect.height);

      const clamped = Math.max(0, Math.min(1, progress));
      const movement = (clamped - 0.5) * 18;

      visual.style.transform = `translate3d(0, ${movement}px, 0)`;

      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestUpdate, {
      passive: true
    });

    window.addEventListener("resize", requestUpdate);

    requestUpdate();
  };


  /* ============================================================
     04. CONDITION FINDER
     ============================================================

     Allows visitors to select a condition category and instantly
     see relevant conditions.

     This keeps the homepage patient-focused:
     "I have this problem → show me the care."
     ============================================================ */

  const initConditionFinder = () => {
    const finder = $("[data-condition-finder]");

    if (!finder) {
      return;
    }

    const categories = $$("[data-condition-category]", finder);
    const groups = $$("[data-condition-group]", finder);
    const title = $("[data-condition-title]", finder);

    const activateCategory = (category) => {
      state.activeCondition = category;

      categories.forEach((button) => {
        const isActive =
          button.dataset.conditionCategory === category;

        button.classList.toggle("is-active", isActive);
        button.setAttribute(
          "aria-selected",
          isActive ? "true" : "false"
        );

        if (isActive) {
          button.setAttribute("tabindex", "0");
        } else {
          button.setAttribute("tabindex", "-1");
        }
      });

      groups.forEach((group) => {
        const isActive =
          group.dataset.conditionGroup === category;

        group.classList.toggle("is-active", isActive);
        group.hidden = !isActive;
      });

      const activeButton = categories.find(
        (button) =>
          button.dataset.conditionCategory === category
      );

      if (title && activeButton) {
        const label = activeButton.querySelector(
          "[data-condition-label]"
        );

        title.textContent = label
          ? label.textContent.trim()
          : activeButton.textContent.trim();
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    categories.forEach((button, index) => {
      button.addEventListener("click", () => {
        activateCategory(button.dataset.conditionCategory);
      });

      button.addEventListener("keydown", (event) => {
        let nextIndex = null;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % categories.length;
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex =
            (index - 1 + categories.length) %
            categories.length;
        }

        if (nextIndex !== null) {
          event.preventDefault();

          categories[nextIndex].focus();

          activateCategory(
            categories[nextIndex].dataset.conditionCategory
          );
        }
      });
    });

    groups.forEach((group) => {
      group.hidden =
        group.dataset.conditionGroup !== state.activeCondition;
    });

    activateCategory(state.activeCondition);
  };


  /* ============================================================
     05. CONDITION RESULT INTERACTIONS
     ============================================================

     Condition cards can point patients toward the Services page.
     ============================================================ */

  const initConditionResults = () => {
    const results = $$("[data-condition-result]");

    if (!results.length) {
      return;
    }

    results.forEach((result) => {
      result.addEventListener("click", () => {
        const condition =
          result.dataset.conditionResult ||
          result.textContent.trim();

        const servicesUrl = result.dataset.servicesUrl;

        if (servicesUrl) {
          window.location.href =
            `${servicesUrl}?condition=${encodeURIComponent(condition)}`;
          return;
        }

        window.location.href = "services.html";
      });
    });
  };


  /* ============================================================
     06. HOME FAQ ACCORDION
     ============================================================ */

  const initFaq = () => {
    const faqItems = $$("[data-faq-item]");

    if (!faqItems.length) {
      return;
    }

    faqItems.forEach((item) => {
      const trigger = $("[data-faq-trigger]", item);
      const answer = $("[data-faq-answer]", item);

      if (!trigger || !answer) {
        return;
      }

      const setState = (open) => {
        item.classList.toggle("is-open", open);

        trigger.setAttribute(
          "aria-expanded",
          open ? "true" : "false"
        );

        answer.hidden = !open;
      };

      setState(item.classList.contains("is-open"));

      trigger.addEventListener("click", () => {
        const currentlyOpen =
          trigger.getAttribute("aria-expanded") === "true";

        faqItems.forEach((otherItem) => {
          if (otherItem === item) {
            return;
          }

          const otherTrigger =
            $("[data-faq-trigger]", otherItem);

          const otherAnswer =
            $("[data-faq-answer]", otherItem);

          if (otherTrigger && otherAnswer) {
            otherItem.classList.remove("is-open");
            otherTrigger.setAttribute(
              "aria-expanded",
              "false"
            );
            otherAnswer.hidden = true;
          }
        });

        setState(!currentlyOpen);
      });
    });
  };


  /* ============================================================
     07. TESTIMONIAL / VIDEO OVERLAY
     ============================================================ */

  const initVideo = () => {
    const video = $("#home-video");
    const playButton = $("[data-video-play]");
    const overlay = $("[data-video-overlay]");

    if (!video) {
      return;
    }

    const updateVideoState = () => {
      const playing = !video.paused && !video.ended;

      state.videoPlaying = playing;

      if (overlay) {
        overlay.classList.toggle("is-hidden", playing);
      }

      if (playButton) {
        playButton.setAttribute(
          "aria-label",
          playing
            ? "Pause practice video"
            : "Play practice video"
        );
      }
    };

    if (playButton) {
      playButton.addEventListener("click", async () => {
        try {
          if (video.paused) {
            await video.play();
          } else {
            video.pause();
          }
        } catch (error) {
          console.warn(
            "Video playback could not be started.",
            error
          );
        }

        updateVideoState();
      });
    }

    video.addEventListener("play", updateVideoState);
    video.addEventListener("pause", updateVideoState);
    video.addEventListener("ended", updateVideoState);

    updateVideoState();
  };


  /* ============================================================
     08. SCROLL REVEAL
     ============================================================

     Homepage-specific reveal behavior.

     root.js may already provide global reveal functionality.
     This function only targets elements using the homepage
     attribute [data-home-reveal].
     ============================================================ */

  const initScrollReveal = () => {
    const elements = $$("[data-home-reveal]");

    if (!elements.length) {
      return;
    }

    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  };


  /* ============================================================
     09. COUNTER ANIMATION
     ============================================================

     Animates numerical trust indicators such as:
     29+ Years
     100% Patient Focus
     etc.

     HTML example:

     <strong data-counter="29" data-suffix="+">0</strong>
     ============================================================ */

  const initCounters = () => {
    const counters = $$("[data-counter]");

    if (!counters.length) {
      return;
    }

    if (prefersReducedMotion) {
      counters.forEach((counter) => {
        counter.textContent =
          counter.dataset.counter +
          (counter.dataset.suffix || "");
      });

      return;
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach((counter) => {
        counter.textContent =
          counter.dataset.counter +
          (counter.dataset.suffix || "");
      });

      return;
    }

    const animateCounter = (element) => {
      const target = Number(element.dataset.counter);

      if (!Number.isFinite(target)) {
        return;
      }

      const suffix = element.dataset.suffix || "";
      const duration = 1200;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(
          elapsed / duration,
          1
        );

        const eased =
          1 - Math.pow(1 - progress, 3);

        const value = Math.round(
          target * eased
        );

        element.textContent =
          value + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(update);
        }
      };

      window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.6
      }
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  };


  /* ============================================================
     10. APPOINTMENT CTA TRACKING
     ============================================================

     Adds a lightweight interaction state to appointment buttons.

     No external analytics dependency is required.
     ============================================================ */

  const initAppointmentCtas = () => {
    const buttons = $$(
      'a[href*="contact.html"], a[href^="tel:"]'
    );

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.add("is-clicked");

        window.setTimeout(() => {
          button.classList.remove("is-clicked");
        }, 450);
      });
    });
  };


  /* ============================================================
     11. MOBILE CONDITION NAVIGATION
     ============================================================

     Improves horizontal condition category navigation on smaller
     screens by automatically bringing the active category into
     view.
     ============================================================ */

  const initMobileConditionScroll = () => {
    const container =
      $("[data-condition-categories]");

    if (!container) {
      return;
    }

    const observer = new MutationObserver(() => {
      const active = $(
        "[data-condition-category].is-active",
        container
      );

      if (!active) {
        return;
      }

      if (window.innerWidth <= 768) {
        active.scrollIntoView({
          behavior: prefersReducedMotion
            ? "auto"
            : "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    });

    observer.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  };


  /* ============================================================
     12. STICKY MOBILE CTA
     ============================================================

     Displays a mobile appointment bar after the user moves past
     the hero.

     HTML:

     <div class="mobile-appointment-bar" data-mobile-cta>
       ...
     </div>
     ============================================================ */

  const initMobileCta = () => {
    const bar = $("[data-mobile-cta]");
    const hero = $(".home-hero");

    if (!bar || !hero) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        bar.classList.toggle(
          "is-visible",
          !entry.isIntersecting
        );
      },
      {
        threshold: 0
      }
    );

    observer.observe(hero);
  };


  /* ============================================================
     13. HERO CTA FOCUS
     ============================================================

     Ensures that keyboard users can clearly identify the primary
     conversion action.
     ============================================================ */

  const initHeroCtaFocus = () => {
    const primaryCta =
      $(".home-hero [data-primary-cta]");

    if (!primaryCta) {
      return;
    }

    primaryCta.addEventListener("focus", () => {
      primaryCta.classList.add("is-focus-visible");
    });

    primaryCta.addEventListener("blur", () => {
      primaryCta.classList.remove("is-focus-visible");
    });
  };


  /* ============================================================
     14. IMAGE ERROR HANDLING
     ============================================================

     Adds a diagnostic class if a homepage image fails to load.

     It does not replace the image with fabricated content.
     ============================================================ */

  const initImageErrors = () => {
    const images = $$("img");

    images.forEach((image) => {
      image.addEventListener("error", () => {
        image.classList.add("is-image-error");
      });
    });
  };


  /* ============================================================
     15. LAZY MEDIA INITIALIZATION
     ============================================================ */

  const initMedia = () => {
    const videos = $$("video");

    videos.forEach((video) => {
      if (!video.hasAttribute("preload")) {
        video.setAttribute("preload", "metadata");
      }

      video.setAttribute(
        "playsinline",
        ""
      );
    });
  };


  /* ============================================================
     16. BACKGROUND VISUAL PERFORMANCE
     ============================================================

     Disables decorative motion when the browser tab is hidden.
     ============================================================ */

  const initVisibilityOptimization = () => {
    document.addEventListener(
      "visibilitychange",
      () => {
        const heroVisual =
          $(".home-hero-visual");

        if (!heroVisual) {
          return;
        }

        if (document.hidden) {
          heroVisual.style.willChange = "auto";
        } else if (!prefersReducedMotion) {
          heroVisual.style.willChange =
            "transform";
        }
      }
    );
  };


  /* ============================================================
     17. REDUCED MOTION
     ============================================================ */

  const initReducedMotion = () => {
    if (prefersReducedMotion) {
      html.classList.add("reduce-motion");
    }
  };


  /* ============================================================
     18. CURRENT YEAR
     ============================================================ */

  const initCurrentYear = () => {
    const yearElements =
      $$("[data-current-year]");

    if (!yearElements.length) {
      return;
    }

    const year =
      new Date().getFullYear();

    yearElements.forEach((element) => {
      element.textContent = year;
    });
  };


  /* ============================================================
     19. EXTERNAL LINKS
     ============================================================

     Adds safe target/rel attributes to external links while
     leaving internal navigation untouched.
     ============================================================ */

  const initExternalLinks = () => {
    $$(
      'a[href^="http://"], a[href^="https://"]'
    ).forEach((link) => {
      try {
        const url =
          new URL(
            link.href,
            window.location.href
          );

        if (
          url.origin !==
          window.location.origin
        ) {
          link.target = "_blank";
          link.rel =
            "noopener noreferrer";
        }
      } catch {
        /* Ignore malformed URLs. */
      }
    });
  };


  /* ============================================================
     20. KEYBOARD ACCESSIBILITY
     ============================================================ */

  const initKeyboardMode = () => {
    const handleKeyboard = (event) => {
      if (event.key === "Tab") {
        html.classList.add(
          "using-keyboard"
        );
      }
    };

    const handlePointer = () => {
      html.classList.remove(
        "using-keyboard"
      );
    };

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    document.addEventListener(
      "mousedown",
      handlePointer,
      { passive: true }
    );

    document.addEventListener(
      "touchstart",
      handlePointer,
      { passive: true }
    );
  };


  /* ============================================================
     21. LUCIDE ICON REFRESH
     ============================================================ */

  const refreshIcons = () => {
    if (
      window.lucide &&
      typeof window.lucide.createIcons ===
        "function"
    ) {
      window.lucide.createIcons();
    }
  };


  /* ============================================================
     22. HOMEPAGE INITIALIZATION
     ============================================================ */

  const init = () => {
    initHeroParallax();
    initConditionFinder();
    initConditionResults();
    initFaq();
    initVideo();
    initScrollReveal();
    initCounters();
    initAppointmentCtas();
    initMobileConditionScroll();
    initMobileCta();
    initHeroCtaFocus();
    initImageErrors();
    initMedia();
    initVisibilityOptimization();
    initReducedMotion();
    initCurrentYear();
    initExternalLinks();
    initKeyboardMode();
    refreshIcons();

    html.classList.add(
      "homepage-js-ready"
    );
  };


  /* ============================================================
     23. DOM READY
     ============================================================ */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
