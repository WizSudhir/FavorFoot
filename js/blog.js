
/* ============================================================
   FAVOR FOOT & ANKLE LEG / WOUND CENTER
   BLOG PAGE JAVASCRIPT

   Depends on:
   - js/root.js
   - css/root.css
   - css/blog.css

   Responsibilities:
   - Article category filtering
   - Article search
   - Load-more behavior
   - Search/filter reset
   - Accessibility state management
   ============================================================ */

(() => {
    "use strict";

    const $ = (selector, scope = document) => scope.querySelector(selector);

    const $$ = (selector, scope = document) =>
        [...scope.querySelectorAll(selector)];

    /* ============================================================
       01. BLOG LIBRARY
       ============================================================ */

    const initBlogLibrary = () => {
        const grid = $("#blog-grid");
        const searchInput = $("#blog-search-input");
        const searchClear = $("#blog-search-clear");
        const filters = $$(".blog-filter");
        const resultCount = $("#blog-results-count");
        const emptyState = $("#blog-empty");
        const resetButton = $("#blog-reset");
        const loadMoreButton = $("#blog-load-more");

        /*
         * Exit safely if this is not the blog page.
         */

        if (!grid || !searchInput || !filters.length) {
            return;
        }

        const cards = $$(".blog-card", grid);

        /*
         * Number of articles shown per batch.
         */

        const pageSize = 6;

        let activeCategory = "all";
        let searchTerm = "";
        let visibleLimit = pageSize;

        /* ========================================================
           02. NORMALIZE SEARCH VALUES
           ======================================================== */

        const normalize = (value) => {
            return String(value || "")
                .toLowerCase()
                .trim();
        };

        /* ========================================================
           03. FIND MATCHING ARTICLES
           ======================================================== */

        const getMatches = () => {
            return cards.filter((card) => {
                const category = normalize(card.dataset.category);

                const title = normalize(card.dataset.title);

                const body = normalize(card.textContent);

                const categoryMatches =
                    activeCategory === "all" ||
                    category === activeCategory;

                const searchMatches =
                    !searchTerm ||
                    title.includes(searchTerm) ||
                    body.includes(searchTerm);

                return categoryMatches && searchMatches;
            });
        };

        /* ========================================================
           04. UPDATE CATEGORY BUTTON STATES
           ======================================================== */

        const updateFilterState = () => {
            filters.forEach((filter) => {
                const isActive =
                    filter.dataset.category === activeCategory;

                filter.classList.toggle(
                    "is-active",
                    isActive
                );

                filter.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });
        };

        /* ========================================================
           05. UPDATE SEARCH CLEAR BUTTON
           ======================================================== */

        const updateSearchState = () => {
            const hasValue =
                Boolean(searchInput.value.trim());

            if (searchClear) {
                searchClear.hidden = !hasValue;
            }
        };

        /* ========================================================
           06. UPDATE ARTICLE RESULTS
           ======================================================== */

        const updateResults = () => {
            const matches = getMatches();

            /*
             * Hide all cards first.
             */

            cards.forEach((card) => {
                card.classList.add("is-hidden");
            });

            /*
             * Show only the currently allowed number
             * of matching articles.
             */

            matches
                .slice(0, visibleLimit)
                .forEach((card) => {
                    card.classList.remove("is-hidden");
                });

            const shownCount = Math.min(
                visibleLimit,
                matches.length
            );

            /* ====================================================
               RESULT COUNT
               ==================================================== */

            if (resultCount) {
                if (
                    searchTerm ||
                    activeCategory !== "all"
                ) {
                    resultCount.textContent =
                        `Showing ${shownCount} of ${matches.length} matching article${matches.length === 1 ? "" : "s"}`;
                } else {
                    resultCount.textContent =
                        `Showing ${shownCount} of ${matches.length} articles`;
                }
            }

            /* ====================================================
               EMPTY STATE
               ==================================================== */

            if (emptyState) {
                emptyState.hidden =
                    matches.length !== 0;
            }

            /* ====================================================
               LOAD MORE BUTTON
               ==================================================== */

            if (loadMoreButton) {
                loadMoreButton.hidden =
                    matches.length <= visibleLimit;
            }
        };

        /* ========================================================
           07. APPLY SEARCH + FILTERS
           ======================================================== */

        const applyFilters = () => {
            searchTerm =
                normalize(searchInput.value);

            updateSearchState();

            updateFilterState();

            updateResults();
        };

        /* ========================================================
           08. CATEGORY FILTERS
           ======================================================== */

        filters.forEach((filter) => {
            filter.addEventListener(
                "click",
                () => {
                    activeCategory =
                        normalize(
                            filter.dataset.category
                        ) || "all";

                    /*
                     * Reset pagination when
                     * changing categories.
                     */

                    visibleLimit = pageSize;

                    applyFilters();
                }
            );
        });

        /* ========================================================
           09. SEARCH INPUT
           ======================================================== */

        searchInput.addEventListener(
            "input",
            () => {
                /*
                 * Start from the first batch whenever
                 * the search term changes.
                 */

                visibleLimit = pageSize;

                applyFilters();
            }
        );

        /* ========================================================
           10. CLEAR SEARCH
           ======================================================== */

        if (searchClear) {
            searchClear.addEventListener(
                "click",
                () => {
                    searchInput.value = "";

                    visibleLimit = pageSize;

                    searchInput.focus();

                    applyFilters();
                }
            );
        }

        /* ========================================================
           11. LOAD MORE ARTICLES
           ======================================================== */

        if (loadMoreButton) {
            loadMoreButton.addEventListener(
                "click",
                () => {
                    visibleLimit += pageSize;

                    updateResults();
                }
            );
        }

        /* ========================================================
           12. RESET FILTERS
           ======================================================== */

        if (resetButton) {
            resetButton.addEventListener(
                "click",
                () => {
                    activeCategory = "all";

                    searchInput.value = "";

                    visibleLimit = pageSize;

                    applyFilters();

                    /*
                     * Keep keyboard users in the search field
                     * without jumping the page.
                     */

                    searchInput.focus({
                        preventScroll: true
                    });
                }
            );
        }

        /* ========================================================
           13. INITIAL STATE
           ======================================================== */

        applyFilters();
    };

    /* ============================================================
       14. ARTICLE LINK HANDLING
       ============================================================ */

    const initArticleCardLinks = () => {
        /*
         * Article links intentionally remain normal HTML links.
         *
         * This is important for:
         *
         * - SEO
         * - Search engine crawling
         * - Browser navigation
         * - Sharing
         * - Opening links in new tabs
         *
         * We do not prevent the browser's default behavior.
         */

        $$(".blog-card a, .featured-card a").forEach(
            (link) => {
                link.addEventListener(
                    "click",
                    () => {
                        link.dataset.blogNavigation =
                            "true";
                    }
                );
            }
        );
    };

    /* ============================================================
       15. BLOG INITIALIZATION
       ============================================================ */

    const init = () => {
        initBlogLibrary();

        initArticleCardLinks();

        /*
         * Refresh Lucide icons after the blog page
         * has initialized.
         */

        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    /* ============================================================
       16. DOM READY
       ============================================================ */

    if (document.readyState === "loading") {
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
```
