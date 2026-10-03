"use strict";

// =========================================================
// EduTrack landing page
// 1. Floating bubbles   2. Header on scroll   3. Active nav link
// 4. Mobile menu        5. Reveal on scroll   6. Contact form   7. Year
// =========================================================

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const rand = (min, max) => Math.random() * (max - min) + min;

// -------- [ 1. BUBBLES ] --------
// Each bubble gets random size / position / speed through CSS variables.
// The CSS does the actual animation (rise + sway), using only transforms.
const createBubbles = () => {
  const container = document.querySelector(".bubbles");
  if (!container) return;

  const count = window.innerWidth < 600 ? 14 : 26; // fewer on phones
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("span");
    bubble.className = "bubble" + (Math.random() < 0.3 ? " is-blue" : "");

    const size = rand(18, 120);
    const duration = rand(16, 32); // seconds to rise
    const style = bubble.style;

    style.setProperty("--s", `${size.toFixed(0)}px`);
    style.setProperty("--x", `${rand(0, 96).toFixed(1)}%`);
    style.setProperty("--d", `${duration.toFixed(1)}s`);
    // Negative delay = bubbles are already mid-flight when the page loads
    style.setProperty("--delay", `${(-rand(0, duration)).toFixed(1)}s`);
    style.setProperty("--o", rand(0.3, 0.75).toFixed(2));
    style.setProperty("--drift", `${rand(12, 42).toFixed(0)}px`);
    style.setProperty("--sway", `${rand(4, 9).toFixed(1)}s`);

    // Reduced motion: scatter them as a static decoration instead
    if (prefersReducedMotion) {
      style.top = `${rand(4, 88).toFixed(0)}%`;
    }

    fragment.appendChild(bubble);
  }

  container.appendChild(fragment);
};

// -------- [ 2. HEADER BACKGROUND ON SCROLL ] --------
const header = document.getElementById("siteHeader");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
};

// -------- [ 3. ACTIVE NAV LINK (scroll spy) ] --------
const navLinks = new Map(
  [...document.querySelectorAll("#mainNav .nav-link")].map((link) => [
    link.getAttribute("href").slice(1),
    link,
  ])
);

const setActiveLink = (id) => {
  navLinks.forEach((link, key) => {
    const isActive = key === id;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
};

const initScrollSpy = () => {
  if (!("IntersectionObserver" in window)) return;

  // A thin band across the middle of the screen decides the current section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && navLinks.has(entry.target.id)) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  document
    .querySelectorAll("main section[id]")
    .forEach((section) => observer.observe(section));
};

// -------- [ 4. CLOSE MOBILE MENU AFTER CLICKING A LINK ] --------
const initMobileMenu = () => {
  const menu = document.getElementById("mainNav");
  if (!menu || !window.bootstrap) return;

  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    })
  );
};

// -------- [ 5. REVEAL ON SCROLL ] --------
const initReveal = () => {
  const items = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => {
    // Small stagger between siblings (cards in the same row/list)
    const index = [...el.parentElement.children].indexOf(el);
    el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
    observer.observe(el);
  });
};

// -------- [ 6. CONTACT FORM ] --------
// Front-end only for now: it validates and shows a confirmation.
// To really send it, POST the data to your backend where marked below.
const initContactForm = () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.classList.remove("is-error");

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("is-error");
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    // TODO: send `data` to the backend here, e.g.
    // await fetch("http://localhost:3000/messages", { method: "POST", ... })
    console.log("Contact message:", data);

    status.textContent = "Thank you! Your message has been sent.";
    form.reset();
    form.classList.remove("was-validated");
  });
};

// -------- [ 7. FOOTER YEAR ] --------
const setYear = () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
};

// -------- [ INIT ] --------
createBubbles();
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
initScrollSpy();
initMobileMenu();
initReveal();
initContactForm();
setYear();