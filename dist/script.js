const root = document.documentElement;
const rotatingText = document.querySelector("#rotating-text");
const phrases = [
  "software engineering",
  "cloud systems",
  "human-centered interfaces",
  "applied AI",
];

let phraseIndex = 0;
let charIndex = phrases[0].length;
let deleting = true;
let typingTimer;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  const nextText = phrase.slice(0, charIndex);
  rotatingText.textContent = nextText;

  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    typingTimer = window.setTimeout(typeLoop, 1700);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingTimer = window.setTimeout(typeLoop, 320);
    return;
  }

  charIndex += deleting ? -1 : 1;
  typingTimer = window.setTimeout(typeLoop, deleting ? 34 : 62);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typingTimer = window.setTimeout(typeLoop, 1500);

  window.addEventListener("pointermove", (event) => {
    root.style.setProperty("--mouse-x", `${event.clientX}px`);
    root.style.setProperty("--mouse-y", `${event.clientY}px`);
  }, { passive: true });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(element);
});

document.querySelector("#year").textContent = new Date().getFullYear();

window.addEventListener("pagehide", () => window.clearTimeout(typingTimer));
