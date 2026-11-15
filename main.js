(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};

  /* ---------- Final report button ---------- */
  var rb = document.getElementById("reportBtn");
  if (rb && C.REPORT_URL) {
    rb.href = C.REPORT_URL; rb.target = "_blank"; rb.rel = "noopener";
    rb.removeAttribute("aria-disabled"); rb.textContent = "Open the final report";
  } else if (rb) {
    rb.addEventListener("click", function (e) { e.preventDefault(); });
  }

  /* ---------- Donor wall ---------- */
  var wall = document.getElementById("donorWall");
  var donors = (C.DONORS || []).filter(Boolean);
  if (wall) {
    donors.forEach(function (n) {
      var li = document.createElement("li");
      li.textContent = n;
      if (/batch|shop|stationar|stationer|leasing|pvt|ltd/i.test(n)) li.className = "is-group";
      wall.appendChild(li);
    });
    var f = document.getElementById("factDonors");
    if (f && donors.length) f.textContent = donors.length;
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

  /* ---------- Header shadow ---------- */
  var topbar = document.querySelector(".topbar");
  function onScroll() { topbar.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
