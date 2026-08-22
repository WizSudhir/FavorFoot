/* ============================================================
   FAVOR FOOT & ANKLE LEG & WOUND CENTER
   SERVICES PAGE JAVASCRIPT
   ------------------------------------------------------------
   Page-specific JavaScript only.

   Global functionality such as the navbar remains inside
   root.js.

   This file controls:
   - Lucide icons
   - Scroll reveal
   - Specialty service interaction
   - Dynamic service detail panel
   - URL hash state
   - Smooth navigation
   - Accessibility
   ============================================================ */

(function () {

    "use strict";


    /* ============================================================
       01. SERVICE DATA
       ============================================================ */

    const serviceData = {

        wound: {

            eyebrow: "LIMB PRESERVATION",

            title:
                "Diabetic Limb Salvage & Wound Care",

            icon:
                "heart-pulse",

            visualLabel:
                "ADVANCED WOUND CARE",

            visualTitle:
                "Protecting Tissue. Supporting Healing. Preserving Mobility.",

            lead:
                "Complex wounds require more than routine treatment. Our approach focuses on identifying contributing factors, supporting healing and protecting the health and function of the lower extremity.",

            features: [

                "Comprehensive wound assessment",

                "Diabetic foot risk management",

                "Limb-preservation focused care",

                "Individualized treatment planning"

            ]

        },


        regenerative: {

            eyebrow: "REGENERATIVE CARE",

            title:
                "Regenerative Medicine",

            icon:
                "sparkles",

            visualLabel:
                "REGENERATIVE CARE",

            visualTitle:
                "Supporting the Body's Recovery Through Targeted Care.",

            lead:
                "Regenerative treatment approaches may be considered for selected musculoskeletal conditions as part of an individualized treatment strategy.",

            features: [

                "Condition-specific evaluation",

                "Individualized treatment planning",

                "Support for tissue recovery",

                "Integrated conservative care"

            ]

        },


        diagnostics: {

            eyebrow: "PRECISION DIAGNOSTICS",

            title:
                "High-Tech Diagnostics",

            icon:
                "scan-search",

            visualLabel:
                "PRECISION DIAGNOSTICS",

            visualTitle:
                "Better Information. More Informed Clinical Decisions.",

            lead:
                "Modern diagnostic tools can help our clinical team better understand structure, function, circulation and the potential causes of foot and ankle symptoms.",

            features: [

                "Comprehensive clinical assessment",

                "Advanced diagnostic evaluation",

                "Structural and functional assessment",

                "Treatment planning based on findings"

            ]

        },


        laser: {

            eyebrow: "SPECIALIZED THERAPIES",

            title:
                "Laser & Specialized Therapies",

            icon:
                "scan-line",

            visualLabel:
                "SPECIALIZED THERAPIES",

            visualTitle:
                "Technology-Enabled Care When It Fits Your Treatment Plan.",

            lead:
                "Specialized and non-invasive treatment technologies may be incorporated into an individualized care plan when clinically appropriate.",

            features: [

                "Non-invasive treatment options",

                "Condition-specific therapy planning",

                "Technology-assisted care",

                "Integrated treatment approach"

            ]

        },


        surgery: {

            eyebrow: "SURGICAL CARE",

            title:
                "Reconstructive Foot Surgery",

            icon:
                "scissors",

            visualLabel:
                "RECONSTRUCTIVE CARE",

            visualTitle:
                "Restoring Structure, Function and Confidence.",

            lead:
                "Selected structural problems, deformities and injuries may require reconstructive surgical care when conservative treatment is not sufficient.",

            features: [

                "Structural evaluation",

                "Surgical treatment planning",

                "Deformity-focused care",

                "Recovery and rehabilitation planning"

            ]

        },


        orthotics: {

            eyebrow: "BIOMECHANICAL SUPPORT",

            title:
                "Custom Orthotics & Bracing",

            icon:
                "footprints",

            visualLabel:
                "BIOMECHANICAL SUPPORT",

            visualTitle:
                "Personalized Support for Alignment, Pressure and Function.",

            lead:
                "Custom orthotics and bracing can provide targeted support for selected biomechanical conditions, helping improve comfort, alignment and function.",

            features: [

                "Biomechanical assessment",

                "Custom device planning",

                "Pressure redistribution",

                "Support for mobility and function"

            ]

        }

    };


    /* ============================================================
       02. DOM ELEMENTS
       ============================================================ */

    const cards =
        document.querySelectorAll(
            ".service-specialty-card"
        );


    const detailSection =
        document.querySelector(
            "#service-detail"
        );


    const detailTitle =
        document.querySelector(
            "#service-detail-title"
        );


    const detailLead =
        document.querySelector(
            ".services-detail__lead"
        );


    const detailVisualLabel =
        document.querySelector(
            ".services-detail__visual-label"
        );


    const detailVisualTitle =
        document.querySelector(
            ".services-detail__visual strong"
        );


    const detailFeatures =
        document.querySelector(
            ".services-detail__features"
        );


    const detailVisualIcon =
        document.querySelector(
            ".services-detail__visual-icon"
        );


    const serviceTriggers =
        document.querySelectorAll(
            ".service-specialty-card__trigger"
        );


    /* ============================================================
       03. LUCIDE ICON REFRESH
       ============================================================ */

    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            window.lucide.createIcons();

        }

    }


    /* ============================================================
       04. BUILD FEATURE LIST
       ============================================================ */

    function buildFeatureList(features) {

        if (!detailFeatures) {
            return;
        }


        detailFeatures.innerHTML = "";


        features.forEach(function (feature) {

            const item =
                document.createElement("div");


            item.innerHTML = `

                <i
                    data-lucide="circle-check"
                    aria-hidden="true"
                ></i>

                <span>
                    ${feature}
                </span>

            `;


            detailFeatures.appendChild(item);

        });


        refreshIcons();

    }


    /* ============================================================
       05. UPDATE DETAIL PANEL ICON
       ============================================================ */

    function updateDetailIcon(iconName) {

        if (!detailVisualIcon) {
            return;
        }


        detailVisualIcon.innerHTML = `

            <i
                data-lucide="${iconName}"
                aria-hidden="true"
            ></i>

        `;


        refreshIcons();

    }


    /* ============================================================
       06. UPDATE SERVICE DETAIL
       ============================================================ */

    function updateService(
        serviceKey,
        shouldScroll
    ) {

        const service =
            serviceData[serviceKey];


        if (!service) {
            return;
        }


        /*
         * Update main title.
         */

        if (detailTitle) {

            detailTitle.textContent =
                service.title;

        }


        /*
         * Update eyebrow.
         */

        const detailEyebrow =
            document.querySelector(
                ".services-detail__content .section-eyebrow"
            );


        if (detailEyebrow) {

            detailEyebrow.textContent =
                service.eyebrow;

        }


        /*
         * Update lead paragraph.
         */

        if (detailLead) {

            detailLead.textContent =
                service.lead;

        }


        /*
         * Update visual label.
         */

        if (detailVisualLabel) {

            detailVisualLabel.textContent =
                service.visualLabel;

        }


        /*
         * Update large visual heading.
         */

        if (detailVisualTitle) {

            detailVisualTitle.textContent =
                service.visualTitle;

        }


        /*
         * Update icon.
         */

        updateDetailIcon(
            service.icon
        );


        /*
         * Update feature list.
         */

        buildFeatureList(
            service.features
        );


        /*
         * Update active card.
         */

        cards.forEach(function (card) {

            const isActive =
                card.dataset.service === serviceKey;


            card.classList.toggle(
                "is-active",
                isActive
            );


            const trigger =
                card.querySelector(
                    ".service-specialty-card__trigger"
                );


            if (trigger) {

                trigger.setAttribute(
                    "aria-expanded",
                    isActive
                        ? "true"
                        : "false"
                );

            }

        });


        /*
         * Update URL hash.
         */

        try {

            window.history.replaceState(
                null,
                "",
                "#service-" + serviceKey
            );

        } catch (error) {

            /*
             * History API may be unavailable in
             * certain restricted environments.
             */

        }


        /*
         * Scroll to detail section when the user
         * actively selects a service.
         */

        if (
            shouldScroll &&
            detailSection
        ) {

            const navbar =
                document.querySelector(
                    ".navbar"
                );


            const navbarHeight =
                navbar
                    ? navbar.offsetHeight
                    : 0;


            const targetPosition =
                detailSection.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight -
                20;


            window.scrollTo({

                top: targetPosition,

                behavior:
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "auto"
                        : "smooth"

            });

        }

    }


    /* ============================================================
       07. SERVICE CARD EVENTS
       ============================================================ */

    function initServiceCards() {

        if (!cards.length) {
            return;
        }


        cards.forEach(function (card) {

            const serviceKey =
                card.dataset.service;


            const trigger =
                card.querySelector(
                    ".service-specialty-card__trigger"
                );


            if (!trigger || !serviceKey) {
                return;
            }


            trigger.addEventListener(
                "click",
                function () {

                    updateService(
                        serviceKey,
                        true
                    );

                }
            );


            /*
             * Allow the entire card to behave as a
             * discoverable interactive surface while
             * preserving the actual button semantics.
             */

            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        /*
                         * Don't duplicate the event when
                         * the actual button has focus.
                         */

                        if (
                            document.activeElement === trigger
                        ) {
                            return;
                        }


                        event.preventDefault();


                        updateService(
                            serviceKey,
                            true
                        );

                    }

                }
            );

        });

    }


    /* ============================================================
       08. HASH INITIALIZATION
       ============================================================ */

    function initHashState() {

        const hash =
            window.location.hash;


        if (!hash) {
            return;
        }


        if (
            hash.indexOf("#service-") !== 0
        ) {
            return;
        }


        const serviceKey =
            hash.replace(
                "#service-",
                ""
            );


        if (!serviceData[serviceKey]) {
            return;
        }


        /*
         * Do not automatically scroll on initial
         * page load. We only update the selected
         * service state.
         */

        updateService(
            serviceKey,
            false
        );

    }


    /* ============================================================
       09. HASH CHANGE
       ============================================================ */

    function initHashChange() {

        window.addEventListener(
            "hashchange",
            function () {

                const hash =
                    window.location.hash;


                if (
                    hash.indexOf("#service-") !== 0
                ) {
                    return;
                }


                const serviceKey =
                    hash.replace(
                        "#service-",
                        ""
                    );


                if (!serviceData[serviceKey]) {
                    return;
                }


                updateService(
                    serviceKey,
                    true
                );

            }
        );

    }


    /* ============================================================
       10. SCROLL REVEAL
       ============================================================ */

    function initReveal() {

        const elements =
            document.querySelectorAll(
                "[data-reveal]"
            );


        if (!elements.length) {
            return;
        }


        /*
         * Reduced-motion users should see
         * everything immediately.
         */

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {

            elements.forEach(function (element) {

                element.classList.add(
                    "is-visible"
                );

            });

            return;

        }


        if (
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(function (element) {

                element.classList.add(
                    "is-visible"
                );

            });

            return;

        }


        const observer =
            new IntersectionObserver(
                function (
                    entries,
                    observerInstance
                ) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            observerInstance.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -50px 0px"

                }
            );


        elements.forEach(
            function (element) {

                observer.observe(
                    element
                );

            }
        );

    }


    /* ============================================================
       11. SMOOTH ANCHOR NAVIGATION
       ============================================================ */

    function initAnchors() {

        const anchors =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        anchors.forEach(
            function (anchor) {

                anchor.addEventListener(
                    "click",
                    function (event) {

                        const href =
                            anchor.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#"
                        ) {
                            return;
                        }


                        /*
                         * Service hashes are handled
                         * separately by the service system.
                         */

                        if (
                            href.indexOf(
                                "#service-"
                            ) === 0
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                href
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


                        const targetPosition =
                            target.getBoundingClientRect().top +
                            window.scrollY -
                            navbarHeight -
                            16;


                        window.scrollTo({

                            top:
                                targetPosition,

                            behavior:
                                window.matchMedia(
                                    "(prefers-reduced-motion: reduce)"
                                ).matches
                                    ? "auto"
                                    : "smooth"

                        });


                        /*
                         * Keep the URL useful without
                         * causing a browser jump.
                         */

                        try {

                            window.history.pushState(
                                null,
                                "",
                                href
                            );

                        } catch (error) {}

                    }
                );

            }
        );

    }


    /* ============================================================
       12. ESCAPE KEY
       ============================================================ */

    function initEscapeBehavior() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }


                /*
                 * Return focus to the currently
                 * active service trigger.
                 */

                const activeCard =
                    document.querySelector(
                        ".service-specialty-card.is-active"
                    );


                if (!activeCard) {
                    return;
                }


                const trigger =
                    activeCard.querySelector(
                        ".service-specialty-card__trigger"
                    );


                if (trigger) {

                    trigger.focus();

                }

            }
        );

    }


    /* ============================================================
       13. INITIAL SERVICE
       ============================================================ */

    function initDefaultService() {

        /*
         * If no service was supplied in the URL,
         * show the first service by default.
         */

        if (
            window.location.hash
        ) {
            return;
        }


        if (!cards.length) {
            return;
        }


        const firstCard =
            cards[0];


        const firstService =
            firstCard.dataset.service;


        if (!firstService) {
            return;
        }


        updateService(
            firstService,
            false
        );

    }


    /* ============================================================
       14. INITIALIZATION
       ============================================================ */

    function init() {

        refreshIcons();

        initServiceCards();

        initHashState();

        initHashChange();

        initReveal();

        initAnchors();

        initEscapeBehavior();

        initDefaultService();

        /*
         * Re-render icons after dynamic service content
         * has been inserted.
         */

        refreshIcons();

    }


    /* ============================================================
       15. DOM READY
       ============================================================ */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();

    }

})();
