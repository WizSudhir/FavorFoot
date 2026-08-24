/* ============================================================
   FAVOR FOOT & ANKLE LEG / WOUND CENTER
   CONTACT PAGE JAVASCRIPT

   Purpose:
   - Patient testimonial video loading
   - Load YouTube iframe only after user interaction
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
     INITIALIZATION
     ============================================================ */

  const initContactPage = () => {

    initTestimonialVideos();

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
