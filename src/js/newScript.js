// Banner video
window.addEventListener("load", () => {
  const container = document.getElementById("videoContainer");
  const video = document.getElementById("mainVideo");
  const loader = document.getElementById("videoLoader");
  const youtubeURL = container?.dataset.youtube;

  if (!container) return;

  const hideLoader = () => {
    if (loader) loader.style.display = "none";
  };

  const loadYouTubeFallback = () => {
    if (youtubeURL) {
      container.innerHTML = `
        <div class="loader" id="videoLoader"></div>
        <iframe
          src="${youtubeURL}"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
          onload="document.getElementById('videoLoader')?.style?.display='none'">
        </iframe>
      `;
    } else {
      // No YouTube fallback — just hide the loader
      hideLoader();
    }
  };

  if (video) {
    // Try to play the HTML5 video
    const playPromise = video.play?.();

    if (playPromise && typeof playPromise.then === "function") {
      playPromise.then(hideLoader).catch(() => {
        // If video fails to autoplay or load, fallback to YouTube
        loadYouTubeFallback();
      });
    } else {
      // If no promise (e.g., no source), fallback
      loadYouTubeFallback();
    }

    // Also hide loader when enough video data is loaded
    video.addEventListener("loadeddata", hideLoader);
  } else {
    // No video element at all — fallback
    loadYouTubeFallback();
  }
});

// Swiper
let swiperInstance = null;
const initSwiper = () => {
  if (window.innerWidth <= 768 && !swiperInstance) {
    swiperInstance = new Swiper(".three-cols-cards", {
      slidesPerView: 1.26,
      spaceBetween: 21,
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      },
    });
  } else if (window.innerWidth > 768 && swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }
};

initSwiper();
window.addEventListener("resize", initSwiper);

// Counter
const counters = document.querySelectorAll(".counter");
let started = false;
const animateCounters = () => {
  if (started) return;
  const block = document.getElementById("counterBlock");
  if (!block || counters.length === 0) return;

  if (block.getBoundingClientRect().top < window.innerHeight - 100) {
    started = true;
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const countSpan = counter.querySelector(".count");
      if (!countSpan || isNaN(target)) return;

      let current = 0;
      const increment = target / 100;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          countSpan.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          countSpan.textContent = target;
        }
      };
      updateCounter();
    });
  }
};
window.addEventListener("scroll", animateCounters);

// Masonry
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#masonry-grid");
  if (!grid) return;

  imagesLoaded(grid, () => {
    const msnry = new Masonry(grid, {
      itemSelector: ".masonry__item",
      percentPosition: true,
      horizontalOrder: true,
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => msnry.layout(), 300);
    });
  });
});

// Video Player --------------------------------
// document.querySelectorAll(".video-poster").forEach((poster) => {
//   poster.addEventListener("click", () => {
//     const videoURL = poster.dataset.video;
//     const captionText = poster.querySelector(".video-caption")?.innerText || "";
//     const wrapper = poster.closest(".video-wrapper");
//     if (!wrapper || !videoURL) return;

//     wrapper.innerHTML = `
//       <iframe src="${videoURL}"
//               allow="autoplay; encrypted-media"
//               allowfullscreen></iframe>
//       <div class="video-caption">${captionText}</div>
//     `;
//   });
// });
// document.querySelectorAll(".video-poster").forEach((poster) => {
//   poster.addEventListener("click", () => {
//     const videoURL = poster.dataset.video;
//     const videoType = poster.dataset.type;
//     const wrapper = poster.closest(".video-wrapper");
//     if (!wrapper || !videoURL || !videoType) return;

//     let embedCode = "";

//     if (videoType === "youtube") {
//       embedCode = `
//         <iframe src="${videoURL}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
//       `;
//     } else if (videoType === "mp4") {
//       embedCode = `
//         <video controls autoplay width="100%" height="100%">
//           <source src="${videoURL}" type="video/mp4">
//           Your browser does not support the video tag.
//         </video>
//       `;
//     }

//     wrapper.innerHTML = embedCode;
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const posters = document.querySelectorAll(".video-poster");

  if (!posters.length) return; // Exit if no video posters in DOM

  posters.forEach((poster) => {
    poster.addEventListener("click", () => {
      const videoURL = poster.dataset.video;
      const videoType = poster.dataset.type;
      const wrapper = poster.closest(".video-wrapper");
      if (!wrapper || !videoURL || !videoType) return;

      // Pause all MP4 <video> elements
      document.querySelectorAll("video").forEach((vid) => {
        if (!vid.paused) {
          vid.pause();
        }
      });

      // Pause all YouTube iframes via postMessage
      document.querySelectorAll("iframe").forEach((frame) => {
        try {
          frame.contentWindow?.postMessage(
            JSON.stringify({
              event: "command",
              func: "pauseVideo",
              args: "",
            }),
            "*"
          );
        } catch (e) {
          console.warn("Could not send pause message to iframe:", e);
        }
      });

      let embedCode = "";

      if (videoType === "youtube") {
        // Ensure enablejsapi=1 is present
        const youtubeURL = new URL(videoURL, window.location.origin);
        youtubeURL.searchParams.set("enablejsapi", "1");

        embedCode = `
          <iframe src="${youtubeURL.toString()}"
                  allow="autoplay; encrypted-media"
                  allowfullscreen></iframe>
        `;
      } else if (videoType === "mp4") {
        embedCode = `
          <video controls autoplay width="100%" height="100%">
            <source src="${videoURL}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      }

      wrapper.innerHTML = embedCode;
    });
  });
});

// SVG Animation
const svgs = document.querySelectorAll(".loading-svg");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const path = entry.target.querySelector(".loading-path");
        if (path) path.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
svgs.forEach((svg) => observer.observe(svg));

// Side Button Show
window.addEventListener("load", () => {
  setTimeout(() => {
    const sideBtn = document.querySelector(".side-btn-fixed");
    sideBtn?.classList.add("show");
  }, 500);
});

// Timeline
document.addEventListener("DOMContentLoaded", () => {
  const allItems = Array.from(document.querySelectorAll(".timeline-item"));
  const timeline = document.querySelector(".timeline");
  const loader = document.querySelector(".loader");
  const filters = document.querySelectorAll(".filters button");

  let currentCategory = "all";
  let loadedCount = 0;
  const itemsPerLoad = 4;
  let isLoading = false;

  const resetTimeline = () => {
    loadedCount = 0;
    allItems.forEach((item) => {
      item.style.display = "none";
      item.classList.remove("visible", "left", "right");
    });
  };

  const loadItems = () => {
    const filtered =
      currentCategory === "all"
        ? allItems
        : allItems.filter((item) => item.dataset.category === currentCategory);

    const itemsToShow = filtered.slice(loadedCount, loadedCount + itemsPerLoad);
    itemsToShow.forEach((item) => (item.style.display = "block"));

    const visibleItems = filtered.slice(0, loadedCount + itemsPerLoad);
    visibleItems.forEach((item, i) => {
      item.classList.add(i % 2 === 0 ? "left" : "right");
      setTimeout(() => item.classList.add("visible"), 100);
    });

    loadedCount += itemsToShow.length;
    if (loadedCount >= filtered.length) loader.classList.add("hidden");
  };

  window.addEventListener("scroll", () => {
    const nearBottom =
      timeline?.getBoundingClientRect().bottom <= window.innerHeight + 150;
    const filtered =
      currentCategory === "all"
        ? allItems
        : allItems.filter((item) => item.dataset.category === currentCategory);

    if (nearBottom && !isLoading && loadedCount < filtered.length) {
      isLoading = true;
      loader.classList.remove("loader-hidden");

      setTimeout(() => {
        loadItems();
        loader.classList.add("loader-hidden");
        isLoading = false;
      }, 800);
    }
  });

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      resetTimeline();
      loader.classList.remove("loader-hidden");
      setTimeout(() => {
        loadItems();
        loader.classList.add("loader-hidden");
      }, 500);
    });
  });

  resetTimeline();
  loadItems();
});

// Anchors
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("scroll-navbar");
  const header = document.querySelector(".header");
  const navLinks = document.querySelectorAll(".scroll-nav--link");
  const sections = document.querySelectorAll("section");
  const headerToggle = document.getElementById("headerToggle");
  const scrollNav = document.querySelector(".scroll-nav");
  const currentLabel = document.getElementById("currentSectionLabel");

  if (
    !navbar ||
    !header ||
    !scrollNav ||
    !headerToggle ||
    !currentLabel ||
    navLinks.length === 0
  )
    return;

  const navbarTop = navbar.offsetTop;

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href")?.replace("#", "");
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const offset = header.offsetHeight + navbar.offsetHeight;
        const scrollTo =
          targetSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: scrollTo, behavior: "smooth" });
        currentLabel.textContent = link.textContent;

        if (window.innerWidth <= 768) {
          scrollNav.classList.remove("open");
          headerToggle.classList.remove("open");
        }
      }
    });
  });

  // Sticky navbar and progressive nav tracking
  window.addEventListener("scroll", () => {
    if (window.scrollY > navbarTop + 100) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPos = window.scrollY + window.innerHeight / 2;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }

      // DESKTOP-ONLY progressive btn-active logic
      if (window.innerWidth > 768) {
        const id = section.getAttribute("id");
        const link = document.querySelector(`.scroll-nav--link[href="#${id}"]`);
        if (link) {
          if (window.scrollY + 10 >= sectionTop) {
            // Scrolling down: add btn-active
            link.classList.add("btn-active");
          } else {
            // Scrolling up: remove btn-active
            link.classList.remove("btn-active");
          }
        }
      }
    });

    // Always highlight the current section with 'active'
    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });

    // Update current section label on mobile
    if (window.innerWidth <= 768 && currentSection) {
      const activeLink = document.querySelector(
        `.scroll-nav--link[href="#${currentSection}"]`
      );
      if (activeLink) {
        currentLabel.textContent = activeLink.textContent;
      }
    }
  });

  headerToggle.addEventListener("click", () => {
    scrollNav.classList.toggle("open");
    headerToggle.classList.toggle("open");
  });
});
