(() => {
  function byId(id) { return document.getElementById(id); }
  function metaValue(name, fallback = "") {
    const node = document.querySelector(`meta[name="${name}"]`);
    return node ? (node.getAttribute("content") || fallback).trim() : fallback;
  }
  function sanitizeText(value) {
    return (value || "").normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  }
  async function copyText(value, successMessage, setStatus) {
    if (!value) {
      if (setStatus) setStatus("warn", "Nothing is available to copy yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      if (setStatus) setStatus("info", successMessage);
    } catch (_error) {
      if (setStatus) setStatus("warn", "Copy failed on this device. You can still copy the visible text manually.");
    }
  }
  const domain = metaValue("glv:domain", "goldlevel.co.uk");
  const proton = metaValue("glv:proton", "publicgoldlevel@pm.me");
  const signal = metaValue("glv:signal", "@goldlevel0.5");
  const price = metaValue("glv:price", "Starting from £44");
  const trace = metaValue("glv:trace", "GLV-STATIC-ROOT");
  const priceText = byId("priceText");
  const pricingAnchor = byId("pricingAnchor");
  const footerDomain = byId("footerDomainText");
  const footerProton = byId("footerProtonText");
  const footerSignal = byId("footerSignalText");
  const footerHandle = byId("footerHandleText");
  if (priceText) priceText.textContent = price;
  if (pricingAnchor) pricingAnchor.textContent = price;
  if (footerDomain) footerDomain.textContent = domain;
  if (footerProton) footerProton.textContent = proton;
  if (footerSignal) footerSignal.textContent = signal;
  if (footerHandle) footerHandle.textContent = metaValue("glv:public", "@tomsg3");
  const form = byId("quietHelix");
  if (!form) return;
  const FIELD = { trapA:"thornWicket", trapB:"glassHarbor", fullName:"vantaMerrow", email:"cipherOriel", support:"selkaDrift", pressure:"lumenFall", timing:"oryxWindow", budget:"kiteWeight", details:"atlasBraid", terms:"quietTerms", sensitive:"quietSensitive" };
  const statusBox = byId("formStatus");
  const qualifiedBox = byId("qualifiedNextStep");
  const nonQualifiedBox = byId("nonQualifiedNextStep");
  const summaryBox = byId("summaryBox");
  const summaryPreview = byId("summaryPreview");
  const nonQualSummaryBox = byId("nonQualSummaryBox");
  const nonQualSummaryPreview = byId("nonQualSummaryPreview");
  const pulseRill = byId("pulseRill");
  const traceRill = byId("traceRill");
  const hushVault = byId("hushVault");
  const signalCopyButton = byId("signalCopyButton");
  const protonCopyButton = byId("protonCopyButton");
  const copySummaryButton = byId("copySummaryButton");
  const nonQualSignalCopyButton = byId("nonQualSignalCopyButton");
  const nonQualProtonCopyButton = byId("nonQualProtonCopyButton");
  const nonQualCopySummaryButton = byId("nonQualCopySummaryButton");
  const footerCopySignalButton = byId("footerCopySignalButton");
  const footerCopyProtonButton = byId("footerCopyProtonButton");
  const footerCopyDomainButton = byId("footerCopyDomainButton");
  let interactionCount = 0;
  let dynamicTrapInput = null;
  let lastFullSummary = "";
  function setStatus(type, message) {
    if (!statusBox) return;
    statusBox.className = `status show ${type}`;
    statusBox.textContent = message;
  }
  function clearStatus() {
    if (statusBox) { statusBox.className = "status"; statusBox.textContent = ""; }
    if (qualifiedBox) qualifiedBox.hidden = true;
    if (nonQualifiedBox) nonQualifiedBox.hidden = true;
    if (summaryBox) summaryBox.hidden = true;
    if (nonQualSummaryBox) nonQualSummaryBox.hidden = true;
    if (summaryPreview) summaryPreview.textContent = "";
    if (nonQualSummaryPreview) nonQualSummaryPreview.textContent = "";
  }
  function inputValue(id) { const node = byId(id); return sanitizeText(node ? node.value : ""); }
  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email); }
  function qualifies(values) { return ["now", "month"].includes(values.timing) && ["high", "mid"].includes(values.budget); }
  function tooFast() { const loadedAt = Number(pulseRill ? pulseRill.value : "0"); if (!loadedAt) return true; return Date.now() - loadedAt < 4800; }
  function cooldownActive() { try { const last = Number(localStorage.getItem("glv-static-last-submit-at") || "0"); return last && Date.now() - last < 45000; } catch (_error) { return false; } }
  function markCooldown() { try { localStorage.setItem("glv-static-last-submit-at", String(Date.now())); } catch (_error) {} }
  function createDynamicTrap() {
    if (!hushVault) return;
    const trapId = `veil_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
    const label = document.createElement("label");
    label.setAttribute("for", trapId);
    label.textContent = "Leave this field empty";
    const input = document.createElement("input");
    input.type = "text"; input.name = trapId; input.id = trapId; input.autocomplete = "off"; input.tabIndex = -1;
    hushVault.append(label, input); dynamicTrapInput = input;
  }
  function buildFullSummary(values) {
    return [
      `Trace tag: ${trace}`,
      `Session ID: ${traceRill ? traceRill.value : ""}`,
      `Name: ${values.fullName}`,
      `Email: ${values.email}`,
      `Support type: ${values.support}`,
      `Main pressure: ${values.pressure}`,
      `Timing: ${values.timing}`,
      `Investment readiness: ${values.budget}`,
      `Details: ${values.details}`
    ].join("\n");
  }
  if (pulseRill) pulseRill.value = String(Date.now());
  if (traceRill) traceRill.value = window.crypto && typeof window.crypto.randomUUID === "function" ? window.crypto.randomUUID() : `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  createDynamicTrap();
  Object.values(FIELD).forEach((id) => {
    const node = byId(id);
    if (!node) return;
    const eventName = node.tagName === "SELECT" || node.type === "checkbox" ? "change" : "input";
    node.addEventListener(eventName, () => { interactionCount += 1; });
  });
  if (signalCopyButton) signalCopyButton.addEventListener("click", () => copyText(signal, "Signal handle copied.", setStatus));
  if (protonCopyButton) protonCopyButton.addEventListener("click", () => copyText(proton, "Proton Mail address copied.", setStatus));
  if (copySummaryButton) copySummaryButton.addEventListener("click", () => copyText(lastFullSummary, "Application summary copied locally.", setStatus));
  if (nonQualSignalCopyButton) nonQualSignalCopyButton.addEventListener("click", () => copyText(signal, "Signal handle copied.", setStatus));
  if (nonQualProtonCopyButton) nonQualProtonCopyButton.addEventListener("click", () => copyText(proton, "Proton Mail address copied.", setStatus));
  if (nonQualCopySummaryButton) nonQualCopySummaryButton.addEventListener("click", () => copyText(lastFullSummary, "Application summary copied locally.", setStatus));
  if (footerCopySignalButton) footerCopySignalButton.addEventListener("click", () => copyText(signal, "Signal handle copied.", setStatus));
  if (footerCopyProtonButton) footerCopyProtonButton.addEventListener("click", () => copyText(proton, "Proton Mail address copied.", setStatus));
  if (footerCopyDomainButton) footerCopyDomainButton.addEventListener("click", () => copyText(domain, "Domain copied.", setStatus));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearStatus();
    const trapA = inputValue(FIELD.trapA);
    const trapB = inputValue(FIELD.trapB);
    const trapC = dynamicTrapInput ? sanitizeText(dynamicTrapInput.value) : "";
    if (trapA || trapB || trapC) { setStatus("warn", "We could not accept this submission. Please try again in a clean browser session."); return; }
    if (tooFast() || interactionCount < 4) { setStatus("warn", "This submission was blocked by the anti-bot checks. Wait a few seconds, review the form, and try again."); return; }
    if (cooldownActive()) { setStatus("warn", "Please wait a short moment before submitting again."); return; }
    if (!form.checkValidity()) { setStatus("warn", "Please complete the required fields and acknowledgements before continuing."); form.reportValidity(); return; }
    const values = { fullName: inputValue(FIELD.fullName), email: inputValue(FIELD.email).toLowerCase(), support: inputValue(FIELD.support), pressure: inputValue(FIELD.pressure), timing: inputValue(FIELD.timing), budget: inputValue(FIELD.budget), details: inputValue(FIELD.details) };
    if (!isValidEmail(values.email)) { setStatus("warn", "Please enter a valid email address."); return; }
    if (values.details.length < 24) { setStatus("warn", "Please add a slightly fuller current-situation note before continuing."); return; }
    lastFullSummary = buildFullSummary(values);
    markCooldown();
    if (!qualifies(values)) {
      if (nonQualifiedBox) nonQualifiedBox.hidden = false;
      if (nonQualSummaryBox) nonQualSummaryBox.hidden = false;
      if (nonQualSummaryPreview) nonQualSummaryPreview.textContent = lastFullSummary;
      setStatus("warn", "This page is optimized for the bounded paid path when timing and readiness are already clearer. You can still keep your note local and move through Signal or Proton Mail without forcing a false qualification.");
      return;
    }
    if (summaryBox) summaryBox.hidden = false;
    if (summaryPreview) summaryPreview.textContent = lastFullSummary;
    if (qualifiedBox) qualifiedBox.hidden = false;
    setStatus("good", "You look like a fit for the bounded diagnostic path. This static version keeps Signal and Proton Mail as the only onward routes.");
  });
})();
