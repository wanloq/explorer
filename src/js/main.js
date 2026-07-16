(() => {
  "use strict";

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header scroll state */
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu toggle */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Estate filters */
  const filterButtons = document.querySelectorAll("#estate-filters .pill-filter");
  const cards = document.querySelectorAll("#estate-grid .estate-card");
  const noResults = document.getElementById("no-results");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      const filter = btn.dataset.filter;
      let visibleCount = 0;
      cards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        const show = filter === "all" || categories.includes(filter);
        card.classList.toggle("hidden", !show);
        if (show) visibleCount += 1;
      });
      if (noResults) noResults.classList.toggle("hidden", visibleCount !== 0);
    });
  });

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");
    const icon = item.querySelector(".faq-icon");
    if (!trigger || !panel) return;
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-trigger").forEach((t) => {
        t.setAttribute("aria-expanded", "false");
        t.parentElement.querySelector(".faq-panel")?.classList.add("hidden");
        t.parentElement.querySelector(".faq-icon")?.classList.remove("rotate-180");
      });
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        panel.classList.remove("hidden");
        icon?.classList.add("rotate-180");
      }
    });
  });

  /* Testimonial slider */
  const track = document.getElementById("testi-track");
  const prevBtn = document.getElementById("testi-prev");
  const nextBtn = document.getElementById("testi-next");
  if (track) {
    const slides = track.children.length;
    let index = 0;
    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };
    nextBtn?.addEventListener("click", () => {
      index = (index + 1) % slides;
      update();
    });
    prevBtn?.addEventListener("click", () => {
      index = (index - 1 + slides) % slides;
      update();
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }
})();
