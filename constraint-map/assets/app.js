const $ = (sel) => document.querySelector(sel);

function serializeForm(form) {
  const data = {};
  const fd = new FormData(form);
  for (const [key, value] of fd.entries()) data[key] = value;
  for (const el of form.querySelectorAll('input[type="checkbox"]')) data[el.name] = el.checked;
  return data;
}

function downloadText(filename, text, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied.");
  } catch (err) {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    alert("Copied.");
  }
}

function classifyFit(data) {
  const combined = Object.values(data).join(" ").toLowerCase();
  const hasLive = (data.liveAttached || "").toLowerCase().startsWith("yes");
  const partly = (data.liveAttached || "").toLowerCase().startsWith("partly");
  const hasObject = (data.moveForward || "").trim().length > 12;
  const hasDrag = (data.notClean || "").trim().length > 12;
  const hasNow = (data.importantNow || "").trim().length > 8;

  const noFitSignals = [
    "regulated", "professional advice", "guarantee", "guaranteed",
    "no project", "no offer", "no decision", "just validation"
  ].some(x => combined.includes(x));

  if (noFitSignals || (!hasLive && !partly)) {
    return {
      status: "NO FIT",
      klass: "no",
      message: "This does not yet look like the right diagnostic. It needs one live offer, project, page, decision, buyer conversation, launch, deadline, or opportunity attached before payment should be requested."
    };
  }

  if (hasLive && hasObject && hasDrag && hasNow) {
    return {
      status: "FIT",
      klass: "fit",
      message: "This sounds like a fit for the 48-Hour Constraint Map. The next move is payment + full intake. The 48-hour delivery clock starts once both are complete."
    };
  }

  return {
    status: "MAYBE",
    klass: "maybe",
    message: "This may fit, but one thing needs to be clearer first: what is the specific offer, project, page, or decision you want mapped?"
  };
}

function fitEmail(data, result = null) {
  return `Subject: 48-Hour Constraint Map fit check

What I am trying to move forward:
${data.moveForward || ""}

Where it is not converting / deciding / sequencing / landing cleanly:
${data.notClean || ""}

What made this important now:
${data.importantNow || ""}

Live object attached:
${data.liveAttached || ""}

First artifact / link:
${data.firstArtifact || ""}

${result ? `Fit classification: ${result.status}\n${result.message}` : ""}`;
}

$("#microFitForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = serializeForm(e.currentTarget);
  const result = classifyFit(data);
  const box = $("#fitResult");
  box.hidden = false;
  box.className = `result-box ${result.klass}`;
  const statusLine = document.createElement("p");
  statusLine.className = "eyebrow";
  statusLine.textContent = `Classification: ${result.status}`;

  const message = document.createElement("h3");
  message.textContent = result.message;

  const note = document.createElement("p");
  note.className = "muted";
  note.textContent = "Use this as a guide, not an automatic acceptance. Fit still requires judgment before taking payment.";

  const actions = document.createElement("div");
  actions.className = "form-actions";

  const copyButton = document.createElement("button");
  copyButton.className = "button primary";
  copyButton.id = "copyFitResult";
  copyButton.type = "button";
  copyButton.textContent = "Copy fit-check summary";

  const downloadButton = document.createElement("button");
  downloadButton.className = "button secondary";
  downloadButton.id = "downloadFitResult";
  downloadButton.type = "button";
  downloadButton.textContent = "Download fit-check JSON";

  actions.append(copyButton, downloadButton);
  box.replaceChildren(statusLine, message, note, actions);

  copyButton.addEventListener("click", () => copyText(fitEmail(data, result)));
  downloadButton.addEventListener("click", () => downloadText("constraint-map-fit-check.json", JSON.stringify({ createdAt: new Date().toISOString(), data, result }, null, 2)));
});

$("#copyFitEmail")?.addEventListener("click", () => {
  const data = serializeForm($("#microFitForm"));
  copyText(fitEmail(data));
});

function intakeEmail(data) {
  const lines = ["Subject: 48-Hour Constraint Map intake", ""];
  for (const [key, val] of Object.entries(data)) {
    lines.push(`## ${key}`);
    lines.push(String(val || ""));
    lines.push("");
  }
  return lines.join("\n");
}

$("#downloadIntake")?.addEventListener("click", () => {
  const data = serializeForm($("#intakeForm"));
  downloadText("48h-constraint-map-intake.json", JSON.stringify({ createdAt: new Date().toISOString(), data }, null, 2));
});

$("#copyIntake")?.addEventListener("click", () => {
  const data = serializeForm($("#intakeForm"));
  copyText(intakeEmail(data));
});


function getSiteConfig() {
  return window.SITE_CONFIG || {};
}
function isPlaceholder(value) {
  return !value || String(value).includes("YOUR_") || String(value).trim() === "";
}
function openConfiguredLink(kind) {
  const cfg = getSiteConfig();
  const map = {
    payment: cfg.paymentLink,
    kit: cfg.kitPaymentLink || cfg.paymentLink,
    intake: cfg.intakeLink,
    contact: cfg.contactEmail ? `mailto:${cfg.contactEmail}?subject=${encodeURIComponent("48-Hour Constraint Map fit check")}` : ""
  };
  const value = map[kind];
  if (isPlaceholder(value)) {
    alert(`Configure ${kind} in assets/site-config.js before using this public route commercially.`);
    return;
  }
  window.location.href = value;
}
document.querySelectorAll("[data-config-action]")?.forEach((button) => {
  button.addEventListener("click", () => openConfiguredLink(button.dataset.configAction));
});
