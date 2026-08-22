/* ============================================================
   FAVOR FOOT & ANKLE LEG / WOUND CENTER
   GLOBAL / ROOT JAVASCRIPT

   Purpose:
   - Mobile navigation
   - Navbar scroll state
   - Active navigation state
   - Smooth anchor navigation
   - Scroll reveal animations
   - Footer current year
   - Back-to-top control
   - Scroll progress
   - Lazy image safety / loading helpers
   - Accessibility helpers
   - Reduced-motion support

   Load once on every page AFTER root.css and before page-specific JS.

   Example:
     <script src="js/root.js"></script>
     <script src="js/physicians.js"></script>
   ============================================================ */

(() => {
  "use strict";

  /* ============================================================
     01. GLOBAL STATE / HELPERS
     ============================================================ */

  const html = document.documentElement;
  const body = document.body;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector)
  ];

  const rafThrottle = (callback) => {
    let ticking = false;

    return (...args) => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        callback(...args);
        ticking = false;
      });
    };
  };


  /* ============================================================
     02. MOBILE NAVIGATION

     Expected markup:
       .navbar-toggle
       #primary-navigation

     Uses the existing .is-open class from root.css.
     ============================================================ */

  const initNavigation = () => {
    const toggle = $(".navbar-toggle");
    const nav = $("#primary-navigation");

    if (!toggle || !nav) return;

    const setNavigationState = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
      );

      body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      setNavigationState(!isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setNavigationState(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setNavigationState(false);
        toggle.focus({ preventScroll: true });
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;

      const clickedInsideNav = nav.contains(event.target);
      const clickedToggle = toggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        setNavigationState(false);
      }
    });

    const mobileBreakpoint = window.matchMedia("(min-width: 901px)");

    const handleBreakpoint = (event) => {
      if (event.matches) setNavigationState(false);
    };

    if (typeof mobileBreakpoint.addEventListener === "function") {
      mobileBreakpoint.addEventListener("change", handleBreakpoint);
    } else {
      mobileBreakpoint.addListener(handleBreakpoint);
    }
  };


  /* ============================================================
     03. NAVBAR SCROLL STATE

     Adds:
       .scrolled

     to the navbar after the page moves away from the top.
     ============================================================ */

  const initNavbarScroll = () => {
    const navbar = $(".navbar");

    if (!navbar) return;

    const updateNavbar = rafThrottle(() => {
      navbar.classList.toggle("scrolled", window.scrollY > 12);
    });

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
  };


  /* ============================================================
     04. ACTIVE NAVIGATION

     Automatically marks the current page link with:
       .is-active
       aria-current="page"

     The existing HTML may already provide aria-current, so this
     only adds the class and does not disturb intentional states.
     ============================================================ */

  const initActiveNavigation = () => {
    const currentFile = (
      window.location.pathname.split("/").pop() || "index.html"
    ).split("?")[0].split("#")[0];

    const links = $$(".navbar-link");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) {
        return;
      }

      const linkFile = href.split("/").pop().split("?")[0].split("#")[0] || "index.html";
      const isCurrent = linkFile === currentFile;

      link.classList.toggle("is-active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      }
    });
  };


  /* ============================================================
     05. SMOOTH ANCHOR NAVIGATION
     ============================================================ */

  const initSmoothAnchors = () => {
    const anchors = $$('a[href^="#"]');

    anchors.forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      anchor.addEventListener("click", (event) => {
        event.preventDefault();

        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });

        if (history.pushState) {
          history.pushState(null, "", href);
        }
      });
    });
  };


  /* ============================================================
     06. SCROLL REVEAL

     Expected markup:
       class="reveal-on-scroll"

     Adds:
       .is-visible

     Components can define their own animation in CSS.
     ============================================================ */

  const initScrollReveal = () => {
    const items = $$(".reveal-on-scroll");

    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
  };


  /* ============================================================
     07. SCROLL PROGRESS

     Uses an existing element if available:
       #scroll-progress

     If absent, it creates a lightweight progress element so the
     feature can be enabled globally without repeating markup.

     CSS can target:
       .scroll-progress
     ============================================================ */

  const initScrollProgress = () => {
    let progress = $("#scroll-progress");

    if (!progress) {
      progress = document.createElement("div");
      progress.id = "scroll-progress";
      progress.className = "scroll-progress";
      progress.setAttribute("aria-hidden", "true");
      body.prepend(progress);
    }

    const updateProgress = rafThrottle(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollable > 0
        ? (window.scrollY / scrollable) * 100
        : 0;

      progress.style.setProperty("--scroll-progress", `${percentage}%`);
    });

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
  };


  /* ============================================================
     08. BACK TO TOP

     Expected markup, optional:
       <button id="back-to-top" ...>

     If the button does not exist, no DOM element is created.
     This keeps the JS non-invasive across pages.
     ============================================================ */

  const initBackToTop = () => {
    const button = $("#back-to-top");

    if (!button) return;

    const updateVisibility = rafThrottle(() => {
      button.classList.toggle("is-visible", window.scrollY > 500);
    });

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
  };


  /* ============================================================
     09. FOOTER CURRENT YEAR

     Expected markup:
       <span id="current-year"></span>
     ============================================================ */

  const initCurrentYear = () => {
    const currentYear = $("#current-year");

    if (currentYear) {
      currentYear.textContent = String(new Date().getFullYear());
    }
  };


  /* ============================================================
     10. LAZY IMAGE SAFETY

     Adds native lazy loading to non-critical images when the
     author has not explicitly selected loading behavior.
     ============================================================ */

  const initImageLoading = () => {
    $("img");

    $$('img:not([loading])').forEach((image) => {
      const isCritical = image.hasAttribute("fetchpriority") &&
        image.getAttribute("fetchpriority") === "high";

      if (!isCritical) {
        image.setAttribute("loading", "lazy");
      }

      image.setAttribute("decoding", image.getAttribute("decoding") || "async");
    });
  };


  /* ============================================================
     11. IMAGE ERROR HANDLING

     Adds a diagnostic class instead of replacing images with
     fabricated content. This keeps failures visible during
     development and harmless in production.
     ============================================================ */

  const initImageErrors = () => {
    $$('img').forEach((image) => {
      image.addEventListener("error", () => {
        image.classList.add("is-image-error");
      });
    });
  };


  /* ============================================================
     12. FOCUS VISIBILITY

     Adds a keyboard-user class to the document so CSS can provide
     stronger focus treatment without affecting mouse users.
     ============================================================ */

  const initFocusMode = () => {
    const handlePointer = () => {
      html.classList.remove("using-keyboard");
    };

    const handleKeyboard = (event) => {
      if (event.key === "Tab") {
        html.classList.add("using-keyboard");
      }
    };

    document.addEventListener("mousedown", handlePointer, { passive: true });
    document.addEventListener("touchstart", handlePointer, { passive: true });
    document.addEventListener("keydown", handleKeyboard);
  };


  /* ============================================================
     13. EXTERNAL LINKS

     Adds safe target/rel attributes only to clearly external HTTP
     links. Internal navigation is untouched.
     ============================================================ */

  const initExternalLinks = () => {
    $$('a[href^="http://"], a[href^="https://"]').forEach((link) => {
      try {
        const url = new URL(link.href, window.location.href);

        if (url.origin !== window.location.origin) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      } catch {
        /* Ignore malformed URLs rather than interrupting page JS. */
      }
    });
  };


  /* ============================================================
     14. GLOBAL INITIALIZATION
     ============================================================ */

  const init = () => {
    initNavigation();
    initNavbarScroll();
    initActiveNavigation();
    initSmoothAnchors();
    initScrollReveal();
    initScrollProgress();
    initBackToTop();
    initCurrentYear();
    initImageLoading();
    initImageErrors();
    initFocusMode();
    initExternalLinks();

    html.classList.add("js-ready");

    if (prefersReducedMotion) {
      html.classList.add("reduce-motion");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
