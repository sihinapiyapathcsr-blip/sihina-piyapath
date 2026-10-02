(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2zm5.8 14.03c-.25.69-1.44 1.32-1.98 1.37-.51.05-.98.24-3.3-.69-2.79-1.1-4.56-3.95-4.7-4.13-.13-.18-1.12-1.49-1.12-2.85 0-1.35.71-2.02.96-2.29.25-.28.55-.35.73-.35h.53c.17 0 .4-.06.62.48.24.56.8 1.94.87 2.08.07.14.12.3.02.48-.09.18-.14.3-.28.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.92 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.18-.28.37-.23.62-.14.25.09 1.6.76 1.88.9.28.14.46.21.53.32.07.12.07.65-.18 1.33z"/></svg>';
  var GENERAL_MSG = "Hi! I'd like to donate to Sihina Piyapath 2.0. Could you tell me how to send the items?";

  /* ---------- WhatsApp ---------- */
  function waLink(number, message) {
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  }
  document.querySelectorAll("a[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"), GENERAL_MSG);
  });
  function donateItem(item) {
    var msg = "Hi! I'd like to donate \"" + item.name + "\" (" + item.remaining + " " + item.unit +
      " still needed) for Sihina Piyapath 2.0. How should I send them?";
    window.open(waLink(C.WHATSAPP_NUMBER, msg), "_blank", "noopener");
  }

  /* ---------- Countdown ---------- */
  function daysUntil(iso) {
    var p = iso.split("-").map(Number);
    var target = new Date(p[0], p[1] - 1, p[2]);
    var now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((target - now) / 86400000);
  }
  (function () {
    var d = daysUntil(C.DONATION_DAY || "2026-10-30");
    var num = document.getElementById("daysToEvent");
    var sub = document.getElementById("daysToEventSub");
    if (d > 0) { num.textContent = d; sub.textContent = (d === 1 ? "day" : "days") + " to go · 30 Oct 2026"; }
    else if (d === 0) { num.textContent = "Today"; sub.textContent = "30 Oct 2026"; }
    else { num.textContent = "Done"; sub.textContent = "Thank you for your support!"; }
  })();

  /* ---------- CSV ---------- */
  function parseCSV(text) {
    var rows = [], row = [], field = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += ch;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }
  function num(v) { var n = parseFloat(String(v || "").replace(/[^0-9.\-]/g, "")); return isNaN(n) ? 0 : n; }

  function toItem(id, cat, name, spec, unit, needed, received) {
    needed = num(needed); received = num(received);
    var remaining = Math.max(0, needed - received);
    var pct = needed > 0 ? Math.min(1, received / needed) : 0;
    return { id: id, cat: cat, name: name, spec: spec, unit: unit || "", needed: needed, received: received,
             remaining: remaining, pct: pct, status: received >= needed ? "done" : received > 0 ? "prog" : "need" };
  }

  function itemsFromCSV(text) {
    var rows = parseCSV(text);
    var hi = rows.findIndex(function (r) { return r.some(function (c) { return c.trim().toLowerCase() === "needed"; }); });
    if (hi < 0) throw new Error("No header row");
    var h = rows[hi].map(function (c) { return c.trim().toLowerCase(); });
    var col = function (name) { return h.indexOf(name); };
    var iId = col("id"), iCat = col("category"), iName = col("item"), iSpec = col("specification"),
        iUnit = col("unit"), iNeed = col("needed"), iRec = col("received");
    var out = [];
    rows.slice(hi + 1).forEach(function (r) {
      var name = (r[iName] || "").trim();
      if (!name || !(r[iNeed] || "").trim()) return;
      out.push(toItem((r[iId] || "").trim(), (r[iCat] || "").trim(), name, (r[iSpec] || "").trim(),
                      (r[iUnit] || "").trim(), r[iNeed], r[iRec]));
    });
    if (!out.length) throw new Error("No items");
    return out;
  }
  function fallbackItems() {
    return (C.FALLBACK_ITEMS || []).map(function (r) { return toItem(r[0], r[1], r[2], r[3], r[4], r[5], r[6]); });
  }

  /* ---------- Render ---------- */
  var ITEMS = [], CAT = "all";
  var itemsEl = document.getElementById("items");
  var hideDone = document.getElementById("hideDone");

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(n) { return Number.isInteger(n) ? n.toLocaleString() : n.toFixed(1); }

  function renderSummary() {
    var avg = ITEMS.length ? ITEMS.reduce(function (s, i) { return s + i.pct; }, 0) / ITEMS.length : 0;
    var pct = Math.round(avg * 100);
    var done = ITEMS.filter(function (i) { return i.status === "done"; }).length;
    var books = ITEMS.filter(function (i) { return i.cat === "Exercise Books"; });
    var bNeed = books.reduce(function (s, i) { return s + i.needed; }, 0);
    var bRec = books.reduce(function (s, i) { return s + Math.min(i.received, i.needed); }, 0);
    document.getElementById("overallPct").textContent = pct + "%";
    document.getElementById("factProgress").textContent = pct + "%";
    document.getElementById("factItems").textContent = ITEMS.length;
    var bar = document.getElementById("overallBar");
    bar.setAttribute("aria-valuenow", pct);
    bar.firstElementChild.style.width = pct + "%";
    document.getElementById("overallStats").innerHTML =
      "<span><b>" + fmt(bRec) + "</b> of " + fmt(bNeed) + " exercise books</span>" +
      "<span><b>" + done + "</b> of " + ITEMS.length + " items fully covered</span>";
  }

  function renderItems() {
    var list = ITEMS.filter(function (i) {
      return (CAT === "all" || i.cat === CAT) && !(hideDone.checked && i.status === "done");
    });
    // still-needed first, fulfilled last
    list.sort(function (a, b) { return (a.status === "done") - (b.status === "done"); });
    if (!list.length) { itemsEl.innerHTML = '<p class="empty">Everything in this group is covered. Thank you! 🎉</p>'; return; }
    var pills = { need: ["pill-need", "Needed"], prog: ["pill-prog", "In progress"], done: ["pill-done", "Fulfilled"] };
    itemsEl.innerHTML = list.map(function (i, k) {
      var p = pills[i.status];
      return '<article class="item' + (i.status === "done" ? " is-done" : "") + '">' +
        '<div class="item-top"><div><div class="item-name">' + esc(i.name) + '</div>' +
        '<div class="item-spec">' + esc(i.cat) + (i.spec ? " · " + esc(i.spec) : "") + '</div></div>' +
        '<span class="pill ' + p[0] + '">' + p[1] + '</span></div>' +
        '<div class="bar' + (i.status === "done" ? " done" : "") + '"><span style="width:' + Math.round(i.pct * 100) + '%"></span></div>' +
        '<div class="item-nums"><span><b>' + fmt(i.received) + '</b> of ' + fmt(i.needed) + ' ' + esc(i.unit) + '</span>' +
        (i.status === "done" ? "" : '<span><b>' + fmt(i.remaining) + '</b> still needed</span>') + '</div>' +
        (i.status === "done"
          ? '<span class="item-thanks">✓ Covered, thank you!</span>'
          : '<button class="item-btn" type="button" data-k="' + k + '">' + WA_ICON + "I'll donate this</button>") +
        '</article>';
    }).join("");
    itemsEl.querySelectorAll(".item-btn").forEach(function (b) {
      b.addEventListener("click", function () { donateItem(list[+b.getAttribute("data-k")]); });
    });
  }

  document.querySelectorAll("#catChips .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.querySelectorAll("#catChips .chip").forEach(function (c) { c.classList.remove("is-on"); });
      chip.classList.add("is-on"); CAT = chip.getAttribute("data-cat"); renderItems();
    });
  });
  hideDone.addEventListener("change", renderItems);

  function setItems(items, note) {
    ITEMS = items; renderSummary(); renderItems();
    document.getElementById("sourceNote").textContent = note;
  }

  if (C.SHEET_CSV_URL) {
    var url = C.SHEET_CSV_URL + (C.SHEET_CSV_URL.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now();
    fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) {
        var now = new Date();
        setItems(itemsFromCSV(t), "Live from our donation tracker · checked " +
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ". Updates can take a few minutes to appear.");
      })
      .catch(function () { setItems(fallbackItems(), "We couldn't reach the live list just now, so this is our starting list. Message us to confirm what's still needed."); });
  } else {
    setItems(fallbackItems(), "Showing our starting list. Message us to confirm what's still needed.");
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lb-cap");
    document.querySelectorAll("[data-full]").forEach(function (el) {
      el.addEventListener("click", function () {
        lbImg.src = el.getAttribute("data-full");
        lbImg.alt = el.querySelector("img").alt;
        lbCap.textContent = el.getAttribute("data-caption") || "";
        lb.showModal();
      });
    });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  }

  /* ---------- Header + sticky CTA ---------- */
  var topbar = document.querySelector(".topbar"), cta = document.querySelector(".sticky-cta");
  var needs = document.getElementById("needs"), donate = document.getElementById("donate");
  function onScroll() {
    var y = window.scrollY;
    topbar.classList.toggle("scrolled", y > 8);
    var inNeeds = needs.getBoundingClientRect(), inDonate = donate.getBoundingClientRect();
    var vh = window.innerHeight;
    var overTarget = (inNeeds.top < vh && inNeeds.bottom > 0) || (inDonate.top < vh && inDonate.bottom > 0);
    cta.classList.toggle("show", y > 500 && !overTarget);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
