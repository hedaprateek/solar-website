# Solar website

A website for a solar panel sales and services business. It is split into separate pages (tabs), and every page shares the same header and footer.

| Tab         | Page            | What's on it                                                          |
| ----------- | --------------- | --------------------------------------------------------------------- |
| Home        | `index.html`    | Hero and stats, services overview, why choose us, featured projects   |
| Services    | `services.html` | All nine services, who we work with, the six-step process             |
| Projects    | `projects.html` | Installation gallery with filters                                     |
| Get a quote | `quote.html`    | System-size estimator, quote form, FAQ                                |
| Contact     | `contact.html`  | Phone, WhatsApp, email, hours, address, map and message form          |

The site is plain HTML, CSS and JavaScript. There is no build step, and no server is needed.

**Live site:** https://hedaprateek.github.io/solar-website/

## Files

```
index.html, services.html, projects.html, quote.html, contact.html
css/styles.css      Styles
js/config.js        ← Your business details (edit this first)
js/layout.js        Header tabs and footer shared by every page (includes the Stunity Tech credit)
js/main.js          Menu, estimator, project filter, form handling
assets/favicon.svg  Browser tab icon
assets/projects/    Put your installation photos here
```

## 1. Add your business details

Open `js/config.js` and fill in:

| Setting        | What it is                                                         |
| -------------- | ------------------------------------------------------------------ |
| `businessName` | Company name, shown in the header, footer and page titles          |
| `owner`        | Owner / proprietor name, shown on the Contact page and in the footer |
| `phone`        | Phone number shown on the site (tap-to-call on mobile)             |
| `whatsapp`     | WhatsApp number, digits only with country code, e.g. `919812345678` |
| `email`        | Email address                                                      |
| `address`      | Office address                                                     |
| `hours`        | Working hours                                                      |
| `mapQuery`     | Text to search on Google Maps for the map on the Contact page. Leave it empty to hide the map |
| `formEndpoint` | Where form submissions go (see step 3)                             |

Each value appears on every page, so you only need to change it here.

**Anything left empty (`""`) is hidden**, rather than showing a placeholder: the email, address and working-hours lines simply disappear from the top bar, Contact page and footer until you fill them in.

For better search-engine results, also replace the company name in the `<title>` tag at the top of each page.

## 2. Replace the example content

These parts hold **example content**. Replace it with your real details before going live. Each part is marked with an `EDIT:` comment.

- **Stats** in `index.html` (sites installed, capacity, years, response time).
- **Project cards** in `projects.html`, plus the three featured projects in `index.html`. Each card has a type, a capacity, a title, a short description and some tags. To show a real photo, copy it into `assets/projects/`. Then replace the `<div class="pm-art ..."></div>` line in the card with:

  ```html
  <img src="assets/projects/my-site.jpg" alt="5 kW rooftop system in Jaipur" loading="lazy">
  ```

  Photos look best in landscape, cropped to about 16:10.

## Header, tabs and footer

The header tabs and the footer are defined once, in `js/layout.js`, and appear on every page:

- **To add or rename a tab,** edit the `TABS` list. For a new page, copy an existing page and set `data-page` on its `<body>` to the new tab's `id`.
- **To change the footer credit,** edit `CREDIT_COMPANY` and `CREDIT_AUTHOR`.

## 3. Set up form delivery

The quote form and the contact form work in one of two ways:

- **With `formEndpoint` empty (the default):** when a visitor submits a form, WhatsApp opens with all their details already typed in, and they just press send. If WhatsApp isn't set up, their email app opens instead.
- **With a form service:** submissions are emailed to you directly. [Formspree](https://formspree.io) has a free plan:
  1. Sign up and create a new form.
  2. Copy its endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
  3. Paste it as `formEndpoint` in `js/config.js`.

  The forms already include Formspree's spam trap field (`_gotcha`).

## Preview locally

Open `index.html` in a browser. You can also run a small local server:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Publish

The site is published with GitHub Pages from the `master` branch. Any push to `master` goes live within a minute or two.
