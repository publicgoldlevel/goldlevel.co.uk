
(function () {
  "use strict";

  if (window.__goldlevelStoryExamplesLoaded) return;
  window.__goldlevelStoryExamplesLoaded = true;

  const ROUTE = "constraint-map";
  const VERSION = "20260504T163806Z";
  const CASES = [{"id": "set_01", "title": "Clarity Map", "scenario": "SignalNest AI", "category": "Website / landing-page clarity", "summary": "Traffic and curiosity exist, but the homepage does not clearly show who owns the problem, what risk is reduced, or why the buyer should act now.", "file": "set_01.png", "cleanPath": "assets/img/professional-examples/set_01.png", "stuck": [["What are they trying to move forward?", "A homepage and demo path that should convert partner-webinar momentum into qualified requests."], ["Where is it not landing?", "Buyers are curious, but cannot quickly tell whether the product is for RevOps, sales leadership, or founder-led teams."], ["What made this important now?", "Referral traffic and partner attention are active, but the page is creating interest without enough qualified demo movement."], ["What live object is attached?", "Live homepage, demo CTA, webinar traffic, referral conversations, and the first-screen positioning decision."]], "preview": [["Situation named", "SignalNest AI has traffic and attention, but the homepage is not converting curiosity into role-specific action."], ["Visible symptoms", "Curiosity, soft praise, demo hesitation, unclear buyer ownership, and weak urgency on the first screen."], ["Likely hidden constraint", "The first screen does not make the buyer role, reduced risk, and next action obvious enough."], ["Compensation pattern", "More explanation, more feature language, and more proof fragments instead of clearer entry framing."], ["What not to do next", "Do not add another broad product section before fixing the first-screen buyer meaning."], ["Smallest testable move", "Rewrite the hero around one buyer role, one risk being reduced, and one next action."], ["Proof needed", "More role-specific demo requests and fewer clarification questions about who the product is for."]]}, {"id": "set_02", "title": "Custom Moment Map", "scenario": "Studio Cartographer", "category": "Creator monetization", "summary": "The studio has strong creative attention, but the buying path has too many service doors and no clear first route.", "file": "set_02.png", "cleanPath": "assets/img/professional-examples/set_02.png", "stuck": [["What are they trying to move forward?", "A layered creative studio practice with a newsletter, template, workshop, coaching offer, and custom work."], ["Where is it not landing?", "People admire the work, but cannot tell what to buy first, what to send, or how the offers relate."], ["What made this important now?", "A workshop launch is approaching and the last launch produced strong replies but weak sales."], ["What live object is attached?", "Workshop page, template page, coaching offer, newsletter audience, and current public CTA."]], "preview": [["Situation named", "Studio Cartographer has attention across useful assets, but the buyer cannot see one coherent next step."], ["Visible symptoms", "Admiration, saved posts, thoughtful replies, launch hesitation, and questions about which offer to choose."], ["Likely hidden constraint", "Offer-path fragmentation: each service makes sense alone, but not as one buyer route."], ["Compensation pattern", "More explanation, more examples, more service language, and more attempts to show the full practice."], ["What not to do next", "Do not add another offer, bonus, or larger explanation map before selecting the first route."], ["Smallest testable move", "Make the workshop the visible bridge: template prepares, workshop maps, coaching follows implementation."], ["Proof needed", "Replies shift from confusion about which path to workshop-specific buying questions or purchases."]]}, {"id": "set_03", "title": "Custom Moment Card", "scenario": "Northline Labs", "category": "Execution bottleneck", "summary": "AI implementation demand exists, but client kickoff becomes custom sprawl before the first week begins.", "file": "set_03.png", "cleanPath": "assets/img/professional-examples/set_03.png", "stuck": [["What are they trying to move forward?", "A repeatable AI implementation kickoff method that can work across different client starting points."], ["Where is it not landing?", "Each new client enters through a different problem, so the team keeps customizing before delivery stabilizes."], ["What made this important now?", "A signed kickoff is approaching and several warm prospects are waiting for a clearer first step."], ["What live object is attached?", "Signed client kickoff, proposal deck, onboarding checklist, and the first diagnostic move decision."]], "preview": [["Situation named", "Northline Labs is selling AI implementation before stabilizing a repeatable diagnostic entry point."], ["Visible symptoms", "Warm demand, accepted proposals, unclear first week, different kickoff paths, and founder-dependent scoping."], ["Likely hidden constraint", "The constraint is first-move repeatability: no standardized diagnostic object starts every engagement."], ["Compensation pattern", "More calls, more custom scoping, more checklists, and heavier founder explanation."], ["What not to do next", "Do not build a full methodology or expand the audit menu before stabilizing the first move."], ["Smallest testable move", "Use one kickoff card that records one workflow, one owner, one input, one failure point, one candidate, and one proof metric."], ["Proof needed", "The team can run kickoff without founder improvisation and prospects understand what happens first."]]}, {"id": "set_04", "title": "Visual API Ledger", "scenario": "LedgerBridge Advisory", "category": "Proof loop clarity", "summary": "Campaign attention exists, but visibility, reply quality, buyer fit, and proof are being read as one signal.", "file": "set_04.png", "cleanPath": "assets/img/professional-examples/set_04.png", "stuck": [["What are they trying to move forward?", "A live advisory campaign where several messages are getting attention but the repeatable commercial signal is unclear."], ["Where is it not landing?", "Likes, replies, peer interest, buyer fit, next-step movement, and paid movement are being interpreted as the same signal."], ["What made this important now?", "The next 30-day campaign decision is due, and John needs to know which message deserves repetition."], ["What live object is attached?", "Active content campaign, response log, reply patterns, buyer conversations, and next message decision."]], "preview": [["Situation named", "LedgerBridge Advisory has attention and campaign motion, but not a clean proof trail."], ["Visible symptoms", "Good engagement, mixed replies, unclear buyer quality, inconsistent next steps, and too much interpretation after each post."], ["Likely hidden constraint", "The constraint is the absence of a proof ledger separating attention from qualified buyer movement."], ["Compensation pattern", "More posts, more campaign variations, more interpretation of soft signals, and more debate about what is working."], ["What not to do next", "Do not choose the next campaign message from likes, impressions, or general attention alone."], ["Smallest testable move", "Create one ledger that records message, audience, response type, buyer quality, next step, paid movement, and repeatable language."], ["Proof needed", "Which message produces qualified replies, clear commercial next steps, paid movement, or buyer language worth repeating."]]}];

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function routeBase() {
    const path = window.location.pathname;
    const marker = "/" + ROUTE + "/";
    const idx = path.indexOf(marker);

    if (idx >= 0) {
      return path.slice(0, idx + marker.length);
    }

    if (path.endsWith("/" + ROUTE)) {
      return path + "/";
    }

    const parts = path.split("/").filter(Boolean);
    const routeIndex = parts.indexOf(ROUTE);

    if (routeIndex >= 0) {
      return "/" + parts.slice(0, routeIndex + 1).join("/") + "/";
    }

    return new URL("./", window.location.href).pathname;
  }

  function assetUrl(cleanPath) {
    return routeBase() + cleanPath + "?v=" + encodeURIComponent(VERSION);
  }

  function detailRows(items) {
    return '<dl class="case-detail-list">' + items.map(function (row) {
      return '<div class="case-kv"><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>';
    }).join("") + '</dl>';
  }

  function card(item) {
    const src = assetUrl(item.cleanPath);
    return [
      '<article class="case-visual-card" id="' + esc(item.id) + '">',
      '  <div class="case-visual-media">',
      '    <a href="' + esc(src) + '">',
      '      <img loading="lazy" decoding="async" src="' + esc(src) + '" data-clean-path="' + esc(item.cleanPath) + '" alt="' + esc(item.title + " synthetic example for " + item.scenario) + '">',
      '    </a>',
      '  </div>',
      '  <div class="case-visual-body">',
      '    <p class="eyebrow">' + esc(item.category) + '</p>',
      '    <h3>' + esc(item.title) + '</h3>',
      '    <p class="case-subtitle">' + esc(item.scenario) + '</p>',
      '    <p class="case-summary">' + esc(item.summary) + '</p>',
      '    <details class="case-detail">',
      '      <summary>View submitted stuck point</summary>',
      '      <div class="case-detail-body">' + detailRows(item.stuck) + '</div>',
      '    </details>',
      '    <details class="case-detail">',
      '      <summary>View diagnostic map preview</summary>',
      '      <div class="case-detail-body">' + detailRows(item.preview) + '</div>',
      '    </details>',
      '    <p class="fine">Synthetic John Doe example. Not a client result, testimonial, or proof of revenue.</p>',
      '  </div>',
      '</article>'
    ].join("");
  }

  function sectionHtml() {
    return [
      '<!-- STORY_FIRST_CASE_VISUALS_START -->',
      '<section class="section story-first-case-visuals" id="story-first-examples">',
      '  <div class="wrap">',
      '    <div class="section-head">',
      '      <p class="eyebrow">Story-first professional examples</p>',
      '      <h2>What people send before the map is made</h2>',
      '      <p class="muted">Synthetic John Doe examples showing the kind of live, complex intake that can become a Constraint Map. These are not client-result claims, testimonials, or proof of revenue.</p>',
      '    </div>',
      '    <div class="case-visual-list">',
      CASES.map(card).join(""),
      '    </div>',
      '  </div>',
      '</section>',
      '<!-- STORY_FIRST_CASE_VISUALS_END -->'
    ].join("");
  }

  function findInsertionPoint() {
    const main = document.querySelector("main") || document.body;
    const anchors = [
      document.querySelector("#story-first-examples"),
      document.querySelector("#intake"),
      document.querySelector("#receipt-state"),
      document.querySelector(".toolkit")
    ].filter(Boolean);

    if (anchors.length) return { parent: anchors[0].parentNode, before: anchors[0] };
    return { parent: main, before: null };
  }

  function replaceStorySection() {
    const existing = document.querySelector("#story-first-examples");

    if (existing) {
      existing.outerHTML = sectionHtml();
      return;
    }

    const headings = Array.from(document.querySelectorAll("h2, h3, p"));
    const storyHeading = headings.find(function (node) {
      const text = (node.textContent || "").trim();
      return text === "Story-first professional examples" || text === "What people send before the map is made";
    });

    if (storyHeading) {
      let section = storyHeading.closest("section");
      if (section) {
        section.outerHTML = sectionHtml();
        return;
      }
    }

    const target = findInsertionPoint();
    const temp = document.createElement("div");
    temp.innerHTML = sectionHtml();
    target.parent.insertBefore(temp.firstElementChild, target.before);
  }

  function addImageFallbacks() {
    document.querySelectorAll(".case-visual-media img[data-clean-path]").forEach(function (img) {
      const cleanPath = img.getAttribute("data-clean-path");
      const base = cleanPath.replace(/\.(png|jpg|jpeg|webp)$/i, "");
      const candidates = [
        cleanPath,
        base + ".png",
        base + ".jpg",
        base + ".jpeg",
        base + ".webp"
      ].filter(function (value, index, arr) {
        return arr.indexOf(value) === index;
      });

      let index = 0;
      img.onerror = function () {
        index += 1;
        if (index < candidates.length) {
          img.src = assetUrl(candidates[index]);
        } else {
          img.classList.add("image-load-failed");
          img.alt = img.alt + " — image failed to load";
        }
      };
    });
  }

  function run() {
    replaceStorySection();
    addImageFallbacks();
    document.documentElement.classList.add("story-examples-dynamic-loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
