/* ============================================================
   FAVOR FOOT & ANKLE LEG / WOUND CENTER
   CONTACT PAGE JAVASCRIPT

   Purpose:
   - Patient testimonial video loading
   - Load YouTube iframe only after user interaction
   - Google Reviews loading
   - Keyboard accessibility
   - No duplication of root.js functionality
   ============================================================ */

(() => {
  "use strict";

  /* ============================================================
     PATIENT TESTIMONIAL VIDEOS
     ============================================================ */

  const initTestimonialVideos = () => {
    const videos = document.querySelectorAll(
      ".contact-testimonial-video[data-youtube-id]"
    );

    if (!videos.length) return;

    const loadVideo = (container) => {
      if (container.dataset.videoLoaded === "true") return;

      const videoId = container.dataset.youtubeId;

      if (!videoId || videoId === "VIDEO_ID_1" ||
          videoId === "VIDEO_ID_2" ||
          videoId === "VIDEO_ID_3" ||
          videoId === "VIDEO_ID_4" ||
          videoId === "VIDEO_ID_5" ||
          videoId === "VIDEO_ID_6") {
        console.warn(
          "YouTube video ID is missing or still uses a placeholder.",
          container
        );

        return;
      }

      const iframe = document.createElement("iframe");

      iframe.src =
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` +
        "?autoplay=1&rel=0";

      iframe.title = "Patient wound care testimonial video";

      iframe.loading = "lazy";

      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

      iframe.referrerPolicy = "strict-origin-when-cross-origin";

      iframe.allowFullscreen = true;

      container.replaceChildren(iframe);

      container.dataset.videoLoaded = "true";
    };


    /* ==========================================================
       MOUSE / TOUCH
       ========================================================== */

    videos.forEach((video) => {

      video.addEventListener("click", () => {
        loadVideo(video);
      });


      /* ========================================================
         KEYBOARD ACCESSIBILITY
         ======================================================== */

      video.addEventListener("keydown", (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          loadVideo(video);
        }

      });

    });

  };


  /* ============================================================
     GOOGLE REVIEWS
     ============================================================ */

  const initGoogleReviews = async () => {

    const reviewsList =
      document.getElementById("google-reviews-list");

    if (!reviewsList) return;


    /* ==========================================================
       GOOGLE REVIEW ELEMENTS
       ========================================================== */

    const ratingElement =
      document.getElementById("google-review-rating");

    const countElement =
      document.getElementById("google-review-count");

    const starsElement =
      document.getElementById("google-review-stars");

    const reviewsLink =
      document.getElementById("google-reviews-link");


    try {

      /* ========================================================
         FETCH REVIEWS FROM OUR BACKEND
         ======================================================== */

      const response = await fetch(
        "/api/google-reviews",
        {
          method: "GET",

          headers: {
            "Accept": "application/json"
          }
        }
      );


      if (!response.ok) {

        throw new Error(
          `Google reviews request failed: ${response.status}`
        );

      }


      const data = await response.json();


      /* ========================================================
         GOOGLE RATING
         ======================================================== */

      if (
        ratingElement &&
        typeof data.rating === "number"
      ) {

        ratingElement.textContent =
          data.rating.toFixed(1);

      }


      /* ========================================================
         GOOGLE REVIEW COUNT
         ======================================================== */

      if (
        countElement &&
        typeof data.userRatingCount === "number"
      ) {

        countElement.textContent =
          `${data.userRatingCount} Google reviews`;

      }


      /* ========================================================
         GOOGLE STAR DISPLAY
         ======================================================== */

      if (
        starsElement &&
        typeof data.rating === "number"
      ) {

        const roundedRating =
          Math.round(data.rating);

        starsElement.textContent =
          "★".repeat(roundedRating) +
          "☆".repeat(5 - roundedRating);

        starsElement.setAttribute(
          "aria-label",
          `${data.rating.toFixed(1)} out of 5 stars`
        );

      }


      /* ========================================================
         GOOGLE REVIEWS PAGE LINK
         ======================================================== */

      if (
        reviewsLink &&
        data.reviewsUri
      ) {

        reviewsLink.href =
          data.reviewsUri;

      }


      /* ========================================================
         VALIDATE REVIEWS
         ======================================================== */

      if (
        !Array.isArray(data.reviews) ||
        !data.reviews.length
      ) {

        reviewsList.innerHTML = `
          <div class="contact-google-review-error">
            Google reviews are temporarily unavailable.
          </div>
        `;

        return;

      }


      /* ========================================================
         REMOVE LOADING MESSAGE
         ======================================================== */

      reviewsList.replaceChildren();


      /* ========================================================
         CREATE REVIEW CARDS
         ======================================================== */

      data.reviews.forEach((review) => {

        const card =
          document.createElement("article");

        card.className =
          "contact-google-review-card";


        /* ======================================================
           REVIEW AUTHOR
           ====================================================== */

        const author =
          review.authorAttribution || {};

        const authorName =
          author.displayName ||
          "Google user";

        const authorUri =
          author.uri || "#";

        const photoUri =
          author.photoUri || "";


        const authorSection =
          document.createElement("div");

        authorSection.className =
          "contact-google-review-author";


        /* ======================================================
           AUTHOR PHOTO
           ====================================================== */

        if (photoUri) {

          const avatar =
            document.createElement("img");

          avatar.className =
            "contact-google-review-avatar";

          avatar.src =
            photoUri;

          avatar.alt =
            `${authorName} profile photo`;

          avatar.loading =
            "lazy";

          avatar.width =
            44;

          avatar.height =
            44;

          authorSection.appendChild(
            avatar
          );

        }


        /* ======================================================
           AUTHOR INFORMATION
           ====================================================== */

        const authorInfo =
          document.createElement("div");

        authorInfo.className =
          "contact-google-review-author-info";


        const authorNameElement =
          document.createElement("a");

        authorNameElement.className =
          "contact-google-review-author-name";

        authorNameElement.href =
          authorUri;

        authorNameElement.target =
          "_blank";

        authorNameElement.rel =
          "noopener noreferrer";

        authorNameElement.textContent =
          authorName;


        authorInfo.appendChild(
          authorNameElement
        );


        /* ======================================================
           REVIEW DATE
           ====================================================== */

        const dateElement =
          document.createElement("span");

        dateElement.className =
          "contact-google-review-date";

        dateElement.textContent =
          review.relativePublishTimeDescription ||
          "";


        authorInfo.appendChild(
          dateElement
        );


        authorSection.appendChild(
          authorInfo
        );


        card.appendChild(
          authorSection
        );


        /* ======================================================
           REVIEW STAR RATING
           ====================================================== */

        const rating =
          Number(review.rating || 0);

        const reviewRating =
          document.createElement("div");

        reviewRating.className =
          "contact-google-review-rating";


        const roundedReviewRating =
          Math.max(
            0,
            Math.min(
              5,
              Math.round(rating)
            )
          );


        reviewRating.textContent =
          "★".repeat(roundedReviewRating) +
          "☆".repeat(5 - roundedReviewRating);


        reviewRating.setAttribute(
          "aria-label",
          `${rating} out of 5 stars`
        );


        card.appendChild(
          reviewRating
        );


        /* ======================================================
           REVIEW TEXT
           ====================================================== */

        const text =
          document.createElement("p");

        text.className =
          "contact-google-review-text";

        text.textContent =
          review.text?.text ||
          review.originalText?.text ||
          "";


        card.appendChild(
          text
        );


        /* ======================================================
           REVIEW FOOTER
           ====================================================== */

        const footer =
          document.createElement("div");

        footer.className =
          "contact-google-review-footer";


        /* ======================================================
           GOOGLE SOURCE
           ====================================================== */

        const source =
          document.createElement("span");

        source.className =
          "contact-google-review-source";

        source.innerHTML =
          '<span class="contact-google-review-source-g">G</span> Google';


        footer.appendChild(
          source
        );


        /* ======================================================
           READ REVIEW ON GOOGLE MAPS
           ====================================================== */

        if (review.googleMapsUri) {

          const reviewLink =
            document.createElement("a");

          reviewLink.className =
            "contact-google-review-link";

          reviewLink.href =
            review.googleMapsUri;

          reviewLink.target =
            "_blank";

          reviewLink.rel =
            "noopener noreferrer";

          reviewLink.textContent =
            "Read on Google Maps";


          footer.appendChild(
            reviewLink
          );

        }


        card.appendChild(
          footer
        );


        /* ======================================================
           ADD CARD TO REVIEW GRID
           ====================================================== */

        reviewsList.appendChild(
          card
        );

      });


    } catch (error) {

      console.error(
        "Unable to load Google reviews:",
        error
      );


      reviewsList.innerHTML = `
        <div class="contact-google-review-error">
          Google reviews are temporarily unavailable.
        </div>
      `;

    }

  };


  /* ============================================================
     INITIALIZATION
     ============================================================ */

  const initContactPage = () => {

    initTestimonialVideos();

    initGoogleReviews();

  };


  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initContactPage,
      { once: true }
    );

  } else {

    initContactPage();

  }

})();
