/* ============================================================
   FAVOR FOOT & ANKLE LEG / WOUND CENTER
   PATIENTS PAGE JAVASCRIPT
   ------------------------------------------------------------
   root.js remains responsible for global site behavior such as
   the shared navbar. This file contains patient-page behavior:
   - Lucide icon refresh
   - Scroll reveal
   - FAQ accordion
   - Smooth anchor handling
   - Accessibility
   ============================================================ */

(function () {
    "use strict";


    /* ============================================================
       01. LUCIDE ICONS
       ============================================================ */

    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }


    /* ============================================================
       02. SCROLL REVEAL
       ============================================================ */

    function initReveal() {

        const elements =
            document.querySelectorAll("[data-reveal]");

        if (!elements.length) {
            return;
        }


        /*
         * If the browser does not support IntersectionObserver,
         * show the content immediately.
         */

        if (!("IntersectionObserver" in window)) {

            elements.forEach(function (element) {
                element.classList.add("is-visible");
            });

            return;
        }


        const observer =
            new IntersectionObserver(
                function (entries, observerInstance) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        elements.forEach(function (element) {
            observer.observe(element);
        });

    }


    /* ============================================================
       03. FAQ ACCORDION
       ============================================================ */

    function initAccordion() {

        const items =
            document.querySelectorAll(
                ".patient-accordion__item"
            );

        if (!items.length) {
            return;
        }


        items.forEach(function (item) {

            const button =
                item.querySelector(
                    ".patient-accordion__button"
                );

            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                function () {

                    const currentlyOpen =
                        item.classList.contains(
                            "is-open"
                        );


                    /*
                     * Close all other FAQ items.
                     * This keeps the section compact and prevents
                     * a very long expanded FAQ stack.
                     */

                    items.forEach(function (otherItem) {

                        if (otherItem === item) {
                            return;
                        }

                        otherItem.classList.remove(
                            "is-open"
                        );

                        const otherButton =
                            otherItem.querySelector(
                                ".patient-accordion__button"
                            );

                        if (otherButton) {

                            otherButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    });


                    if (currentlyOpen) {

                        item.classList.remove(
                            "is-open"
                        );

                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    } else {

                        item.classList.add(
                            "is-open"
                        );

                        button.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                }
            );


            /*
             * Keyboard behavior.
             * Native buttons already support Enter and Space,
             * so no manual keydown handler is required.
             */

        });

    }


    /* ============================================================
       04. SMOOTH INTERNAL ANCHORS
       ============================================================ */

    function initAnchorScrolling() {

        const anchors =
            document.querySelectorAll(
                'a[href^="#"]'
            );

        if (!anchors.length) {
            return;
        }


        anchors.forEach(function (anchor) {

            anchor.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        anchor.getAttribute("href");


                    /*
                     * Leave placeholder "#" links untouched.
                     * These can later be replaced with real URLs.
                     */

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const navbar =
                        document.querySelector(
                            ".navbar"
                        );

                    const navbarHeight =
                        navbar
                            ? navbar.offsetHeight
                            : 0;


                    const targetTop =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        navbarHeight -
                        16;


                    window.scrollTo({
                        top: targetTop,
                        behavior: "smooth"
                    });

                }
            );

        });

    }


    /* ============================================================
       05. CLOSE FAQ WITH ESCAPE
       ============================================================ */

    function initEscapeBehavior() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Escape") {
                    return;
                }


                const openItem =
                    document.querySelector(
                        ".patient-accordion__item.is-open"
                    );

                if (!openItem) {
                    return;
                }


                openItem.classList.remove(
                    "is-open"
                );


                const button =
                    openItem.querySelector(
                        ".patient-accordion__button"
                    );

                if (button) {

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    button.focus();

                }

            }
        );

    }


    /* ============================================================
       06. INITIALIZATION
       ============================================================ */

    function init() {

        refreshIcons();

        initReveal();

        initAccordion();

        initAnchorScrolling();

        initEscapeBehavior();

        /*
         * root.js may also initialize Lucide.
         * Calling it here after the page-specific DOM is ready
         * ensures any icons introduced by patients.html are rendered.
         */
        refreshIcons();

    }


    /*
     * root.js and patients.js are both loaded with defer.
     * DOMContentLoaded guarantees the full document is available.
     */

    if (
        document.readyState === "loading"
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
