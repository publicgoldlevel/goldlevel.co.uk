const CONTACT_EMAIL = "info@goldlevel.co.uk";
const BUILD_VERSION = "life-coach-static-v0.1.0";

const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");

const slides = [
  {
    count: "1 of 3",
    image: "assets/slide-01-awareness.jpg",
    alt: "Slide 1 of 3: Awareness",
    title: "Your coaching work may already have depth.",
    text: "Your website should help people feel that clearly. Many coaches do meaningful work, but their online presence still feels unclear, rushed, or generic."
  },
  {
    count: "2 of 3",
    image: "assets/slide-02-pathway.jpg",
    alt: "Slide 2 of 3: Pathway",
    title: "Turn your message into a calm client pathway.",
    text: "A good landing page shows who you help, what you offer, and the next step — without feeling pushy or confusing."
  },
  {
    count: "3 of 3",
    image: "assets/slide-03-invitation.jpg",
    alt: "Slide 3 of 3: Invitation",
    title: "Trust-led landing pages built for coaches.",
    text: "From a clean static page to a fuller coaching presence, the offer can start simple and expand as your client pathway grows."
  }
];

const slideImage = document.querySelector("[data-slide-image]");
const slideCount = document.querySelector("[data-slide-count]");
const slideTitle = document.querySelector("[data-slide-title]");
const slideText = document.querySelector("[data-slide-text]");
const prevSlide = document.querySelector("[data-prev-slide]");
const nextSlide = document.querySelector("[data-next-slide]");
const slideThumbs = document.querySelectorAll("[data-slide-index]");

const tierButtons = document.querySelectorAll("[data-tier-buttons] .tier-card button");
const tierSelect = document.querySelector("[data-tier-select]");
const contactForm = document.querySelector("[data-contact-form]");
const note = document.querySelector("[data-form-note]");

const emailHandoff = document.querySelector("[data-email-handoff]");
const handoffSummary = document.querySelector("[data-handoff-summary]");
const providerList = document.querySelector("[data-email-provider-list]");
const copyNote = document.querySelector("[data-copy-note]");
const copyRecipientButton = document.querySelector("[data-copy-recipient]");
const copySubjectButton = document.querySelector("[data-copy-subject]");
const copyBodyButton = document.querySelector("[data-copy-body]");
const copyFullRequestButton = document.querySelector("[data-copy-full-request]");

let currentSlide = 0;
let preparedEmail = null;

console.info(`Goldlevel script loaded: ${BUILD_VERSION}`);

const emailProviders = [
  {
    id: "default-mail",
    name: "Default mail app",
    support: "Apple Mail, Windows Mail, Thunderbird, or any browser-registered mail app.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "gmail",
    name: "Gmail / Google Workspace",
    support: "Opens Gmail compose with recipient, subject, and body.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "outlook",
    name: "Outlook / Hotmail / Live",
    support: "Opens Outlook web compose where supported.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    support: "Opens Yahoo compose where supported.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "proton",
    name: "Proton Mail",
    support: "Copies the request, then opens Proton Mail.",
    mode: "copy-open",
    buildUrl: () => "https://mail.proton.me/"
  },
  {
    id: "icloud",
    name: "iCloud Mail",
    support: "Copies the request, then opens iCloud Mail.",
    mode: "copy-open",
    buildUrl: () => "https://www.icloud.com/mail/"
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

  if (slideImage) {
    slideImage.src = slide.image;
    slideImage.alt = slide.alt;
  }

  if (slideCount) slideCount.textContent = slide.count;
  if (slideTitle) slideTitle.textContent = slide.title;
  if (slideText) slideText.textContent = slide.text;

  slideThumbs.forEach((thumb) => {
    thumb.classList.toggle("active", Number(thumb.dataset.slideIndex) === currentSlide);
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
    if (copyNote) copyNote.textContent = "Copy did not complete. Select and copy the visible email details manually.";
  }
}

function renderEmailProviders(payload) {
  if (!providerList) return;

  providerList.innerHTML = "";

  emailProviders.forEach((provider) => {
    const url = provider.buildUrl(payload);
    const card = document.createElement(provider.mode === "direct" ? "a" : "button");

    card.className = "email-provider-card";
    card.dataset.providerId = provider.id;

    if (provider.mode === "direct") {
      card.href = url;
      card.target = "_blank";
      card.rel = "noopener";
    } else {
      card.type = "button";
      card.addEventListener("click", async () => {
        await copyText(payload.fullRequest, `Copied the full request. Opened ${provider.name}; paste it into a new email.`);
        window.open(url, "_blank", "noopener");
      });
    }

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
    handoffSummary.innerHTML = `Email options are prepared for <strong>${escapeHtml(payload.to)}</strong>.`;
  }

  renderEmailProviders(payload);

  if (emailHandoff) {
    emailHandoff.hidden = false;
    emailHandoff.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (note) {
    note.textContent = "Email options prepared. Choose your email client below.";
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

if (prevSlide) {
  prevSlide.addEventListener("click", () => renderSlide(currentSlide - 1));
}

if (nextSlide) {
  nextSlide.addEventListener("click", () => renderSlide(currentSlide + 1));
}

slideThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => renderSlide(Number(thumb.dataset.slideIndex)));
});

tierButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    selectTier(event.currentTarget.closest(".tier-card"));
  });
});

if (copyRecipientButton) {
  copyRecipientButton.addEventListener("click", () => {
    if (!preparedEmail) return;
    copyText(preparedEmail.to, `Copied recipient: ${preparedEmail.to}`);
  });
}

if (copySubjectButton) {
  copySubjectButton.addEventListener("click", () => {
    if (!preparedEmail) return;
    copyText(preparedEmail.subject, "Copied subject.");
  });
}

if (copyBodyButton) {
  copyBodyButton.addEventListener("click", () => {
    if (!preparedEmail) return;
    copyText(preparedEmail.body, "Copied body.");
  });
}

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
