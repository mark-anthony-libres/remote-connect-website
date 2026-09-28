const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealTargets = document.querySelectorAll(".reveal");
if (prefersReducedMotion) {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

const siteHeader = document.querySelector(".site-header");
const parallaxEls = document.querySelectorAll("[data-parallax]");

function onScroll() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);

  if (!prefersReducedMotion) {
    const y = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      el.style.transform = `translateY(${y * speed}px)`;
    });
  }

  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
}

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    onScroll();
    scrollTicking = false;
  });
});
onScroll();

const mockTilt = document.getElementById("mock-tilt");
const mockWindowEl = mockTilt ? mockTilt.querySelector(".mock-window") : null;

if (mockTilt && mockWindowEl && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const maxTiltDeg = 6;

  mockTilt.addEventListener("pointermove", (e) => {
    const rect = mockTilt.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 2 * maxTiltDeg;
    const rx = (0.5 - py) * 2 * maxTiltDeg;
    mockWindowEl.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    mockWindowEl.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
  });

  mockTilt.addEventListener("pointerleave", () => {
    mockWindowEl.style.setProperty("--rx", "0deg");
    mockWindowEl.style.setProperty("--ry", "0deg");
  });
}

const typedTextEl = document.getElementById("typed-text");

if (typedTextEl) {
  const typedWords = ["computer", "laptop", "workstation", "server", "PC"];

  if (prefersReducedMotion) {
    typedTextEl.textContent = typedWords[0];
  } else {
    const typeSpeedMs = 90;
    const deleteSpeedMs = 45;
    const holdMs = 1400;
    const pauseBeforeTypeMs = 300;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tickTypedWord() {
      const word = typedWords[wordIndex];

      if (isDeleting) {
        charIndex--;
        typedTextEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % typedWords.length;
          setTimeout(tickTypedWord, pauseBeforeTypeMs);
          return;
        }
        setTimeout(tickTypedWord, deleteSpeedMs);
        return;
      }

      charIndex++;
      typedTextEl.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        isDeleting = true;
        setTimeout(tickTypedWord, holdMs);
        return;
      }
      setTimeout(tickTypedWord, typeSpeedMs);
    }

    setTimeout(tickTypedWord, pauseBeforeTypeMs);
  }
}

if (window.particlesJS) {
  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 900 } },
      color: { value: ["#29F6FF", "#2F5FED", "#FF3DD6"] },
      shape: { type: "circle" },
      opacity: { value: 0.6, random: true },
      size: { value: 2.6, random: true },
      line_linked: {
        enable: true,
        distance: 140,
        color: "#2F5FED",
        opacity: 0.35,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 160, line_linked: { opacity: 0.7 } },
        push: { particles_nb: 3 },
      },
    },
    retina_detect: true,
  });
}
