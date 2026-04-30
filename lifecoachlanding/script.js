const CONTACT_EMAIL = "info@goldlevel.co.uk";
const BUILD_VERSION = "life-coach-static-v0.1.3-registry-bound";

const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");

const slides = [
  {
    count: "1 of 3",
    title: "Your coaching work may already have depth.",
    text: "Your website should help people feel that clearly. Many coaches do meaningful work, but their online presence still feels unclear, rushed, or generic."
  },
  {
    count: "2 of 3",
    title: "Turn your message into a calm client pathway.",
    text: "A good landing page shows who you help, what you offer, and the next step — without feeling pushy or confusing."
  },
  {
    count: "3 of 3",
    title: "Trust-led landing pages built for coaches.",
    text: "Start with a clean static page, expand into a fuller coaching presence, and roadmap deeper features later."
  }
];

const carousel = document.querySelector("[data-carousel]");
const viewport = document.querySelector("[data-carousel-viewport]");
const track = document.querySelector("[data-carousel-track]");
const slideCount = document.querySelector("[data-slide-count]");
const slideTitle = document.querySelector("[data-slide-title]");
const slideText = document.querySelector("[data-slide-text]");
const prevSlide = document.querySelector("[data-prev-slide]");
const nextSlide = document.querySelector("[data-next-slide]");
const slideDots = document.querySelectorAll("[data-slide-index]");

const tierButtons = document.querySelectorAll("[data-tier-buttons] .tier-card button");
const tierSelect = document.querySelector("[data-tier-select]");
const contactForm = document.querySelector("[data-contact-form]");
const note = document.querySelector("[data-form-note]");

const emailHandoff = document.querySelector("[data-email-handoff]");
const handoffSummary = document.querySelector("[data-handoff-summary]");
const providerList = document.querySelector("[data-email-provider-list]");
const copyNote = document.querySelector("[data-copy-note]");
const copyFullRequestButton = document.querySelector("[data-copy-full-request]");

let currentSlide = 0;
let preparedEmail = null;
let pointerStartX = 0;
let pointerStartY = 0;
let isPointerDown = false;

console.info(`Goldlevel script loaded: ${BUILD_VERSION}`);

const emailProviders = [
  {
    id: "default-mail",
    name: "Mail app",
    support: "Default email app.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "gmail",
    name: "Gmail",
    support: "Google compose.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "outlook",
    name: "Outlook",
    support: "Microsoft compose.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
];

function cleanEmail(email) {
  return String(email || "")
    .trim()
    .replace(/^mailto:/i, "")
    .replace(/\s+/g, "");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  const slide = slides[currentSlide];

  if (track) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  if (slideCount) slideCount.textContent = slide.count;
  if (slideTitle) slideTitle.textContent = slide.title;
  if (slideText) slideText.textContent = slide.text;

  slideDots.forEach((dot) => {
    const active = Number(dot.dataset.slideIndex) === currentSlide;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-current", active ? "true" : "false");
  });
}

function getRecipientEmail() {
  return cleanEmail(CONTACT_EMAIL);
}

function buildRequestPayload() {
  const data = new FormData(contactForm);
  const to = getRecipientEmail();
  const subject = "Coaching website mockup request";

  const body = `Coaching website mockup request

Name: ${data.get("name") || ""}
Email: ${data.get("email") || ""}
Interest: ${data.get("tier") || ""}
Material type: ${data.get("materialType") || ""}

Short description:
${data.get("description") || ""}

Consent confirmed: ${data.get("consent") ? "Yes" : "No"}

I will attach or link my current page, notes, or coaching material after this email opens.
`;

  return {
    to,
    subject,
    body,
    fullRequest: `To: ${to}
Subject: ${subject}

${body}`
  };
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    if (copyNote) copyNote.textContent = successMessage;
  } catch (error) {
    if (copyNote) copyNote.textContent = "Copy did not complete. Select and copy the request manually.";
  }
}

function renderEmailProviders(payload) {
  if (!providerList) return;
  providerList.innerHTML = "";

  emailProviders.forEach((provider) => {
    const card = document.createElement("a");
    card.className = "email-provider-card";
    card.href = provider.buildUrl(payload);
    card.target = "_blank";
    card.rel = "noopener";
    card.innerHTML = `
      <strong>${escapeHtml(provider.name)}</strong>
      <small>${escapeHtml(provider.support)}</small>
    `;
    providerList.appendChild(card);
  });
}

function showEmailHandoff(payload) {
  preparedEmail = payload;

  if (handoffSummary) {
    handoffSummary.innerHTML = `Email prepared for <strong>${escapeHtml(payload.to)}</strong>.`;
  }

  renderEmailProviders(payload);

  if (emailHandoff) {
    emailHandoff.hidden = false;
    emailHandoff.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (note) {
    note.textContent = "Email options prepared.";
  }
}

function selectTier(card) {
  if (!card || !tierSelect) return;

  const tier = card.dataset.tier;
  const price = card.dataset.price;
  const label = `${tier} — ${price}`;

  [...tierSelect.options].forEach((option) => {
    option.selected = option.textContent.trim() === label;
  });

  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (note) {
    note.textContent = `${label} selected. Complete the form and prepare your email request.`;
  }
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 8);
});

if (prevSlide) prevSlide.addEventListener("click", () => renderSlide(currentSlide - 1));
if (nextSlide) nextSlide.addEventListener("click", () => renderSlide(currentSlide + 1));

slideDots.forEach((dot) => {
  dot.addEventListener("click", () => renderSlide(Number(dot.dataset.slideIndex)));
});

if (viewport) {
  viewport.addEventListener("pointerdown", (event) => {
    isPointerDown = true;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
  });

  viewport.addEventListener("pointerup", (event) => {
    if (!isPointerDown) return;
    isPointerDown = false;

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;

    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      renderSlide(currentSlide + (deltaX < 0 ? 1 : -1));
    }
  });

  viewport.addEventListener("pointercancel", () => {
    isPointerDown = false;
  });
}

tierButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    selectTier(event.currentTarget.closest(".tier-card"));
  });
});

if (copyFullRequestButton) {
  copyFullRequestButton.addEventListener("click", () => {
    if (!preparedEmail) return;
    copyText(preparedEmail.fullRequest, "Copied full request.");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      if (note) note.textContent = "Complete the required fields and consent checkbox before preparing email options.";
      return;
    }

    const recipientEmail = getRecipientEmail();

    if (!isValidEmail(recipientEmail)) {
      if (note) note.textContent = `The contact email is invalid in script.js: ${recipientEmail}`;
      return;
    }

    showEmailHandoff(buildRequestPayload());
  });
}

renderSlide(0);
