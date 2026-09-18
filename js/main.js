(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var waNumber = String(C.whatsapp || "").replace(/\D/g, "");
  var telNumber = String(C.phone || "").replace(/[^\d+]/g, "");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Business details from config.js ----------
     A setting left empty in config.js hides whatever would have shown it: the
     element itself, or the [data-optional] block around it (a contact card, a
     footer line), so the site never displays a blank or placeholder detail. */
  function hideFor(el) {
    (el.closest("[data-optional]") || el).hidden = true;
  }

  $$("[data-text]").forEach(function (el) {
    var value = C[el.getAttribute("data-text")];
    if (value) el.textContent = value;
    else hideFor(el);
  });

  $$("[data-href]").forEach(function (el) {
    var kind = el.getAttribute("data-href");
    if (kind === "tel") {
      if (telNumber) el.href = "tel:" + telNumber; else hideFor(el);
    }
    if (kind === "mailto") {
      if (C.email) el.href = "mailto:" + C.email; else hideFor(el);
    }
    if (kind === "whatsapp") {
      if (!waNumber) { hideFor(el); return; }
      el.href = "https://wa.me/" + waNumber;
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  // Page titles are written with the default name; swap in the configured one.
  var DEFAULT_NAME = "Saitech Energy";
  if (C.businessName && C.businessName !== DEFAULT_NAME) {
    document.title = document.title.replace(DEFAULT_NAME, C.businessName);
  }

  var map = $(".map");
  if (map && C.mapQuery) {
    map.querySelector("iframe").src =
      "https://maps.google.com/maps?q=" + encodeURIComponent(C.mapQuery) + "&z=15&output=embed";
    map.hidden = false;
  }

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Smooth scrolling only after load, so opening a page at a #section jumps straight there.
  window.addEventListener("load", function () {
    setTimeout(function () { document.documentElement.classList.add("ready"); }, 50);
  });

  // Structured data so search engines can show the business details.
  var ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: C.businessName,
    description: "Solar panel sales, installation and service: site survey, structure fabrication, panels, inverters, electrical installation, net metering and maintenance.",
    telephone: C.phone,
    email: C.email,
    address: C.address,
    openingHours: C.hours,
    url: location.origin + location.pathname.replace(/[^/]*$/, ""),
  });
  document.head.appendChild(ld);

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  var header = $("#site-header");
  var toggle = $(".menu-toggle");

  if (header && toggle) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var setMenu = function (open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () { setMenu(!header.classList.contains("nav-open")); });
    $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { revealObserver.observe(el); });

    // Opening a page at a section link (e.g. services.html#survey) jumps past the
    // observer, so reveal anything that is already on or above the screen.
    var revealInView = function () {
      reveals.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    };
    revealInView();
    window.addEventListener("load", function () { revealInView(); setTimeout(revealInView, 700); });
    window.addEventListener("hashchange", function () { setTimeout(revealInView, 700); });
  }

  /* ---------- Project filter (Projects page) ---------- */
  var filters = $$(".filter");
  var projects = $$(".project[data-type]");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var type = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      projects.forEach(function (p) {
        p.hidden = type !== "all" && p.getAttribute("data-type") !== type;
        if (!p.hidden) p.classList.add("is-visible");
      });
    });
  });

  /* ---------- Solar size estimator (Get a quote page) ---------- */
  var UNITS_PER_KW_MONTH = 120; // ~4 units per kW per day
  var SQFT_PER_KW = 100;
  var billEl = $("#est-bill");
  var tariffEl = $("#est-tariff");
  var estimate = { kw: 0, bill: 0 };
  var inr = function (n) { return "₹" + Math.round(n).toLocaleString("en-IN"); };

  function calcEstimate() {
    if (!billEl || !tariffEl) return;
    var bill = Number(billEl.value) || 0;
    var tariff = Math.max(1, Number(tariffEl.value) || 8);
    var units = bill / tariff;
    var kw = Math.max(1, Math.ceil((units / UNITS_PER_KW_MONTH) * 2) / 2);
    var generated = kw * UNITS_PER_KW_MONTH;
    var yearlySaving = Math.min(units, generated) * tariff * 12;

    estimate = { kw: kw, bill: bill };
    $("#est-bill-out").textContent = inr(bill) + (bill >= Number(billEl.max) ? "+" : "");
    $("#est-kw").textContent = kw + " kW";
    $("#est-area").textContent = (kw * SQFT_PER_KW).toLocaleString("en-IN") + " sq ft";
    $("#est-units").textContent = Math.round(generated).toLocaleString("en-IN");
    $("#est-save").textContent = inr(yearlySaving);

    var pct = ((bill - billEl.min) / (billEl.max - billEl.min)) * 100;
    billEl.style.setProperty("--p", pct + "%");
  }

  if (billEl && tariffEl) {
    billEl.addEventListener("input", calcEstimate);
    tariffEl.addEventListener("input", calcEstimate);
    calcEstimate();

    $("#est-apply").addEventListener("click", function () {
      $("#q-bill").value = estimate.bill;
      $("#q-size").value = "About " + estimate.kw + " kW (from website estimate)";
      $("#quote-form").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      setTimeout(function () { $("#q-name").focus({ preventScroll: true }); }, reduceMotion ? 0 : 500);
    });
  }

  /* ---------- Lead forms (quote + contact) ---------- */
  function labelFor(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return name;
    if (el.getAttribute("data-label")) return el.getAttribute("data-label");
    var group = el.closest("[data-label]");
    return group ? group.getAttribute("data-label") : name;
  }

  function summarize(form) {
    var fd = new FormData(form);
    var rows = [];
    var seen = {};
    fd.forEach(function (_, key) {
      if (seen[key] || key.charAt(0) === "_") return;
      seen[key] = true;
      var values = fd.getAll(key).map(function (v) { return String(v).trim(); }).filter(Boolean);
      if (values.length) rows.push(labelFor(form, key) + ": " + values.join(", "));
    });
    return rows;
  }

  function showStatus(form, type, message, links) {
    var box = form.querySelector(".form-status");
    box.className = "form-status " + type;
    box.textContent = message;
    (links || []).forEach(function (link) {
      box.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      if (/^https?:/.test(link.href)) { a.target = "_blank"; a.rel = "noopener"; }
      box.appendChild(a);
    });
    box.hidden = false;
  }

  function fallbackLinks(title, rows) {
    var links = [];
    var body = title + "\n\n" + rows.join("\n");
    if (waNumber) links.push({ text: "Send on WhatsApp", href: "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(body) });
    if (C.email) links.push({ text: "Send by email", href: "mailto:" + C.email + "?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body) });
    if (telNumber) links.push({ text: "Call " + C.phone, href: "tel:" + telNumber });
    return links;
  }

  $$("[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="_gotcha"]').value) return; // spam bot

      var title = form.getAttribute("data-form-name") + " — " + (C.businessName || "website");
      var rows = summarize(form);
      var submitBtn = form.querySelector('[type="submit"]');

      // No form service configured: hand the details to WhatsApp / email instead.
      if (!C.formEndpoint) {
        var links = fallbackLinks(title, rows);
        if (!links.length) {
          showStatus(form, "error", "Contact details haven't been set up yet. Please try again later.");
          return;
        }
        window.open(links[0].href, links[0].href.indexOf("http") === 0 ? "_blank" : "_self");
        showStatus(form, "info", "We've opened " + (waNumber ? "WhatsApp" : "your email app") + " with your details filled in — just press send. Didn't open?", links);
        return;
      }

      var data = new FormData(form);
      data.append("_subject", title);
      submitBtn.disabled = true;
      showStatus(form, "info", "Sending…");

      fetch(C.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          calcEstimate();
          showStatus(form, "success", "Thank you! We've received your details and will get back to you shortly.");
        })
        .catch(function () {
          showStatus(form, "error", "Sorry, your message couldn't be sent. Please reach us directly:", fallbackLinks(title, rows));
        })
        .finally(function () { submitBtn.disabled = false; });
    });
  });
})();
