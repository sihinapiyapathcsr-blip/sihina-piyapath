(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};

  /* ---------- Back to top (works even with the sticky header) ---------- */
  document.querySelectorAll("[data-top]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  });

  /* ---------- Year ---------- */
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Final report button ---------- */
  var rb = document.getElementById("reportBtn");
  if (rb && C.REPORT_URL) {
    rb.href = C.REPORT_URL; rb.target = "_blank"; rb.rel = "noopener";
    rb.removeAttribute("aria-disabled"); rb.textContent = "Open report";
  } else if (rb) {
    rb.addEventListener("click", function (e) { e.preventDefault(); });
  }

  /* ---------- 3.0 school suggestion form → WhatsApp ---------- */
  var form = document.getElementById("suggest");
  var openBtn = document.getElementById("openSuggest");
  function showForm() {
    if (!form) return;
    form.hidden = false; if (openBtn) { openBtn.setAttribute("aria-expanded", "true"); openBtn.hidden = true; }
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { var f = form.querySelector("input"); if (f) f.focus({ preventScroll: true }); }, 500);
  }
  if (openBtn) openBtn.addEventListener("click", showForm);
  document.querySelectorAll('a[href="#next"]').forEach(function (a) {
    if (/suggest/i.test(a.textContent)) a.addEventListener("click", function (e) { e.preventDefault(); showForm(); });
  });
  if (form) {
    var alt = document.getElementById("altForm");
    if (alt && C.SUGGEST_FORM_URL) { alt.href = C.SUGGEST_FORM_URL; alt.hidden = false; }
    var err = document.getElementById("formError");
    form.addEventListener("input", function (e) { if (e.target.classList) e.target.classList.remove("invalid"); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = [];
      form.querySelectorAll("[required]").forEach(function (f) {
        var ok = String(f.value || "").trim() !== "";
        f.classList.toggle("invalid", !ok); if (!ok) bad.push(f);
      });
      if (bad.length) { err.hidden = false; bad[0].focus(); return; }
      err.hidden = true;
      var v = function (n) { var f = form.elements[n]; return f ? String(f.value || "").trim() : ""; };
      var lines = [
        "*School suggestion – Sihina Piyapath 3.0*", "",
        "*School:* " + v("school"),
        "*Location:* " + v("town") + ", " + v("district") + " District",
        "*Why this school:* " + v("why"), "",
        "*Suggested by:* " + v("name"),
        "*Phone:* " + v("phone")
      ];
      var url = "https://wa.me/" + (C.WHATSAPP_NUMBER || "94740087127") + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- 2.0 gallery ---------- */
  var g2 = document.getElementById("gallery2");
  if (g2) {
    (C.GALLERY_2 || []).forEach(function (p) {
      if (!p || !p[0]) return;
      var b = document.createElement("button");
      b.type = "button"; b.className = "ph" + (p[2] ? " " + p[2] : "");
      b.setAttribute("data-full", p[0]); b.setAttribute("data-caption", p[1] || "");
      var img = document.createElement("img"); img.src = p[0]; img.alt = p[1] || "Sihina Piyapath 2.0 photo"; img.loading = "lazy";
      b.appendChild(img);
      if (p[1]) { var c = document.createElement("span"); c.className = "cap"; c.textContent = p[1]; b.appendChild(c); }
      g2.appendChild(b);
    });
  }

  /* ---------- Lightbox with next / previous ---------- */
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lb-cap");
    var set = [], idx = 0;
    function show(i) {
      idx = (i + set.length) % set.length; var el = set[idx];
      lbImg.src = el.getAttribute("data-full");
      var im = el.querySelector("img"); lbImg.alt = im ? im.alt : "";
      lbCap.textContent = el.getAttribute("data-caption") || "";
    }
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-full]"); if (!el) return;
      var group = el.closest(".pgrid, .gallery, section") || document;
      set = Array.prototype.slice.call(group.querySelectorAll("[data-full]"));
      show(set.indexOf(el)); lb.showModal();
    });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Header shadow ---------- */
  var topbar = document.querySelector(".topbar");
  function onScroll() { topbar.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Gentle reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var els = document.querySelectorAll(".section-head, .tl-card, .sp2-copy, .video-frame, .ph, .stats li, .team-group, .sp3-art");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
