const CONTACT_EMAIL = "info@goldlevel.co.uk";
const BUILD_VERSION = "0.1.6-email-handoff-cachebust";

const tierButtons = document.querySelectorAll("[data-tier-buttons] .price-card button");
const tierSelect = document.querySelector("[data-tier-select]");
const intakeForm = document.querySelector("[data-intake-form]");
const note = document.querySelector("[data-form-note]");

const emailHandoff = document.querySelector("[data-email-handoff]");
const handoffSummary = document.querySelector("[data-handoff-summary]");
const providerList = document.querySelector("[data-email-provider-list]");
const copyNote = document.querySelector("[data-copy-note]");
const copyRecipientButton = document.querySelector("[data-copy-recipient]");
const copySubjectButton = document.querySelector("[data-copy-subject]");
const copyBodyButton = document.querySelector("[data-copy-body]");
const copyFullRequestButton = document.querySelector("[data-copy-full-request]");

let preparedEmail = null;

console.info(`Goldlevel landing page script loaded: ${BUILD_VERSION}`);

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
    support: "Uses Gmail web compose with recipient, subject, and body prefilled.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "outlook",
    name: "Outlook / Hotmail / Live",
    support: "Uses Outlook web compose with recipient, subject, and body prefilled.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    support: "Uses Yahoo web compose with recipient, subject, and body prefilled.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    support: "Uses Zoho web compose where supported after sign-in.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://mail.zoho.com/zm/#compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "aol",
    name: "AOL Mail",
    support: "Uses AOL compose where supported after sign-in.",
    mode: "direct",
    buildUrl: ({ to, subject, body }) =>
      `https://mail.aol.com/webmail-std/en-gb/compose-message?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  },
  {
    id: "proton",
    name: "Proton Mail",
    support: "Open Proton Mail, then paste the copied request if compose is not prefilled.",
    mode: "copy-open",
    buildUrl: () => "https://mail.proton.me/"
  },
  {
    id: "icloud",
    name: "iCloud Mail",
    support: "Open iCloud Mail, then paste the copied request into a new email.",
    mode: "copy-open",
    buildUrl: () => "https://www.icloud.com/mail/"
  },
  {
    id: "fastmail",
    name: "Fastmail",
    support: "Open Fastmail, then paste the copied request if compose is not prefilled.",
    mode: "copy-open",
    buildUrl: () => "https://app.fastmail.com/mail/"
  },
  {
    id: "hey",
    name: "HEY",
    support: "Open HEY, then paste the copied request into a new email.",
    mode: "copy-open",
    buildUrl: () => "https://app.hey.com/"
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

function getRecipientEmail() {
  return cleanEmail(CONTACT_EMAIL);
}

function buildRequestPayload() {
  const data = new FormData(intakeForm);
  const to = getRecipientEmail();
  const subject = "Governed Artifact Clarity Read request";

  const body = `Governed Artifact Clarity Read request

Name: ${data.get("name") || ""}
Email: ${data.get("email") || ""}
Tier: ${data.get("tier") || ""}
Material type: ${data.get("materialType") || ""}

Short description:
${data.get("description") || ""}

Consent confirmed: ${data.get("consent") ? "Yes" : "No"}

I will attach or link the material after this email opens.
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
        await copyText(
          payload.fullRequest,
          `Copied the full request. Opened ${provider.name}; paste it into a new email.`
        );
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

  document.querySelector("#intake")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  if (note) {
    note.textContent = `${label} selected. Complete the form and prepare email options.`;
  }
}

tierButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    selectTier(event.currentTarget.closest(".price-card"));
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

if (intakeForm) {
  intakeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!intakeForm.reportValidity()) {
      if (note) {
        note.textContent = "Complete the required fields and consent checkbox before preparing email options.";
      }
      return;
    }

    const recipientEmail = getRecipientEmail();

    if (!isValidEmail(recipientEmail)) {
      if (note) {
        note.textContent = `The contact email is invalid in script.js: ${recipientEmail}`;
      }
      return;
    }

    showEmailHandoff(buildRequestPayload());
  });
}
