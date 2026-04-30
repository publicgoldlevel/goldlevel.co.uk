const CONTACT_EMAIL = "info@goldlevel.co.uk"; 

const tierButtons = document.querySelectorAll("[data-tier-buttons] .price-card button");
const tierSelect = document.querySelector("[data-tier-select]");
const intakeForm = document.querySelector("[data-intake-form]");
const note = document.querySelector("[data-form-note]");

function selectTier(card) {
  const tier = card.dataset.tier;
  const price = card.dataset.price;
  if (!tierSelect) return;
  const label = `${tier} — ${price}`;
  [...tierSelect.options].forEach((option) => {
    option.selected = option.textContent.trim() === label;
  });
  document.querySelector("#intake")?.scrollIntoView({ behavior: "smooth", block: "start" });
  note.textContent = `${label} selected. Add a short description and prepare the request email.`;
}

tierButtons.forEach((button) => {
  button.addEventListener("click", (event) => selectTier(event.currentTarget.closest(".price-card")));
});

if (intakeForm) {
  intakeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(intakeForm);
    const subject = encodeURIComponent("Governed Artifact Clarity Read request");
    const body = encodeURIComponent(`Governed Artifact Clarity Read request\n\nName: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\nTier: ${data.get("tier") || ""}\nMaterial type: ${data.get("materialType") || ""}\n\nShort description:\n${data.get("description") || ""}\n\nI will attach or link the material after this email opens.\n`);
    const email = CONTACT_EMAIL === "YOUR_EMAIL_HERE" ? "YOUR_EMAIL_HERE" : CONTACT_EMAIL;
    const href = `mailto:${email}?subject=${subject}&body=${body}`;
    note.textContent = CONTACT_EMAIL === "YOUR_EMAIL_HERE"
      ? "Email placeholder still active. Replace YOUR_EMAIL_HERE in script.js before publishing, or copy this request manually."
      : "Opening your email client. Attach the material before sending.";
    window.location.href = href;
  });
}
