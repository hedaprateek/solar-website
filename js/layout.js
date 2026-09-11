/* =====================================================================
   Shared page chrome: icon sprite, top bar, header tabs, footer and the
   WhatsApp button. Every page loads this file, so the header and footer
   (including the Stunity Tech credit) are written once and stay identical
   on every tab.

   Usage in a page:
     <body data-page="services">
     <script src="js/layout.js"></script>          <- header renders here
     <main id="main"> ... </main>
     <script>SiteLayout.renderFooter();</script>   <- footer renders here

   Business details (name, phone, email...) are filled in afterwards by
   main.js from js/config.js.
   ===================================================================== */
(function () {
  "use strict";

  // The tabs in the header, in order. The "Get a quote" button is added after them.
  var TABS = [
    { id: "home", href: "index.html", label: "Home" },
    { id: "services", href: "services.html", label: "Services" },
    { id: "projects", href: "projects.html", label: "Projects" },
    { id: "contact", href: "contact.html", label: "Contact" },
  ];

  // Credit shown at the foot of every page.
  var CREDIT_COMPANY = "Stunity Tech";
  var CREDIT_AUTHOR = "Prateek";

  var page = document.body.getAttribute("data-page") || "home";
  var current = function (id) { return id === page ? ' aria-current="page"' : ""; };
  var icon = function (name) { return '<svg class="icon"><use href="#i-' + name + '"/></svg>'; };

  var SPRITE = [
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">',
    '<symbol id="i-logo" viewBox="0 0 32 32"><circle cx="16" cy="11" r="4.5" fill="currentColor"/><path d="M16 3.5v2M16 16.5v2M8.5 11h2M21.5 11h2M10.7 5.7l1.4 1.4M21.3 5.7l-1.4 1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M7 28l2.4-7h13.2l2.4 7z" fill="#FFFFFF"/><path d="M16 21v7M8.2 24.5h15.6" stroke="#0E1B2C" stroke-width="1.3"/></symbol>',
    '<symbol id="i-map" viewBox="0 0 24 24"><path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/></symbol>',
    '<symbol id="i-truss" viewBox="0 0 24 24"><path d="M2 20h20M3 20 12 5l9 15M7.5 20 12 12.5 16.5 20M12 5v7.5"/></symbol>',
    '<symbol id="i-panel" viewBox="0 0 24 24"><path d="M5 3h14l2 11H3z"/><path d="M4 8.5h16M9.3 3l-.6 11M14.7 3l.6 11M12 14v7M8 21h8"/></symbol>',
    '<symbol id="i-wrench" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></symbol>',
    '<symbol id="i-inverter" viewBox="0 0 24 24"><rect x="4" y="2.5" width="16" height="19" rx="2.5"/><path d="M13 6.5 9.5 12h5L11 17.5"/></symbol>',
    '<symbol id="i-plug" viewBox="0 0 24 24"><path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/></symbol>',
    '<symbol id="i-doc" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></symbol>',
    '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>',
    '<symbol id="i-pulse" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></symbol>',
    '<symbol id="i-home" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/></symbol>',
    '<symbol id="i-building" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></symbol>',
    '<symbol id="i-factory" viewBox="0 0 24 24"><path d="M2 20V9l6 4V9l6 4V4h8v16z"/><path d="M2 20h20M17 8h2"/></symbol>',
    '<symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 2.7s-7 7.3-7 12.3a7 7 0 0 0 14 0c0-5-7-12.3-7-12.3z"/><path d="M9 15a3 3 0 0 0 3 3"/></symbol>',
    '<symbol id="i-school" viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6"/></symbol>',
    '<symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>',
    '<symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol>',
    '<symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol>',
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>',
    '<symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>',
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></symbol>',
    '<symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></symbol>',
    '<symbol id="i-award" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/></symbol>',
    '<symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></symbol>',
    '<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></symbol>',
    '<symbol id="i-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></symbol>',
    '</svg>',
  ].join("");

  var BRAND =
    '<span class="brand-mark"><svg><use href="#i-logo"/></svg></span>' +
    '<span class="brand-name" data-text="businessName">Surya Solar Solutions</span>';

  var HEADER =
    SPRITE +
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<div class="topbar"><div class="container topbar-inner">' +
      '<a data-href="tel" href="contact.html">' + icon("phone") + '<span data-text="phone">+91 00000 00000</span></a>' +
      '<a data-href="mailto" href="contact.html">' + icon("mail") + '<span data-text="email">hello@yourdomain.com</span></a>' +
      '<span>' + icon("clock") + '<span data-text="hours">Mon – Sat, 9:00 AM – 7:00 PM</span></span>' +
      '<a class="topbar-cta" href="quote.html">Book a free site survey ' + icon("arrow") + '</a>' +
    '</div></div>' +
    '<header class="site-header" id="site-header"><div class="container header-inner">' +
      '<a href="index.html" class="brand">' + BRAND + '</a>' +
      '<nav class="nav" id="nav" aria-label="Main">' +
        TABS.map(function (t) { return '<a href="' + t.href + '"' + current(t.id) + '>' + t.label + '</a>'; }).join("") +
        '<a href="quote.html" class="btn btn-sun nav-cta"' + current("quote") + '>Get a quote</a>' +
      '</nav>' +
      '<a class="header-call" data-href="tel" href="contact.html" aria-label="Call us">' + icon("phone") + '</a>' +
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span><span></span><span></span></button>' +
    '</div></header>';

  var FOOTER_SERVICES = [
    ["services.html#survey", "Site survey"],
    ["services.html#fabrication", "Structure fabrication"],
    ["services.html#panels", "Panels &amp; inverters"],
    ["services.html#electrical", "Electrical installation"],
    ["services.html#net-metering", "Net metering &amp; AMC"],
  ];

  var FOOTER =
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<a href="index.html" class="brand brand-light">' + BRAND + '</a>' +
          '<p class="footer-blurb">Solar panel sales, installation and service — from site survey and fabrication to inverters, wiring and after-sales care.</p>' +
        '</div>' +
        '<div><h4>Services</h4><ul>' +
          FOOTER_SERVICES.map(function (s) { return '<li><a href="' + s[0] + '">' + s[1] + '</a></li>'; }).join("") +
        '</ul></div>' +
        '<div><h4>Explore</h4><ul>' +
          TABS.map(function (t) { return '<li><a href="' + t.href + '">' + t.label + '</a></li>'; }).join("") +
          '<li><a href="quote.html">Get a quote</a></li>' +
        '</ul></div>' +
        '<div><h4>Contact</h4><ul class="footer-contact">' +
          '<li><a data-href="tel" href="contact.html"><span data-text="phone">+91 00000 00000</span></a></li>' +
          '<li><a data-href="mailto" href="contact.html"><span data-text="email">hello@yourdomain.com</span></a></li>' +
          '<li><span data-text="address">Office address, City, State – PIN</span></li>' +
          '<li><span data-text="hours">Mon – Sat, 9:00 AM – 7:00 PM</span></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© <span data-year>2026</span> <span data-text="businessName">Surya Solar Solutions</span>. All rights reserved.</span>' +
        '<span class="footer-credit"><b>' + CREDIT_COMPANY + '</b><span class="vf-dot">·</span>by ' + CREDIT_AUTHOR + '</span>' +
      '</div>' +
    '</div></footer>' +
    '<a class="wa-float" data-href="whatsapp" href="contact.html" aria-label="Chat on WhatsApp">' + icon("whatsapp") + '</a>';

  document.currentScript.insertAdjacentHTML("beforebegin", HEADER);

  window.SiteLayout = {
    renderFooter: function () {
      document.currentScript.insertAdjacentHTML("beforebegin", FOOTER);
    },
  };
})();
