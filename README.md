# Solar website

A one-page website for a solar panel sales and services business. It covers site survey, structure fabrication, panel selection, installation, inverters, electrical work, net metering and maintenance. It also has a project gallery, a quote form with a system-size estimator, and a contact section.

The site is plain HTML, CSS and JavaScript. There is no build step, and no server is needed.

## Files

```
index.html          All page content and sections
css/styles.css      Styles
js/config.js        ← Your business details (edit this first)
js/main.js          Menu, estimator, project filter, form handling
assets/favicon.svg  Browser tab icon
assets/projects/    Put your installation photos here
```

## 1. Add your business details

Open `js/config.js` and fill in:

| Setting        | What it is                                                         |
| -------------- | ------------------------------------------------------------------ |
| `businessName` | Company name, shown in the header, footer and page title           |
| `phone`        | Phone number shown on the site (tap-to-call on mobile)             |
| `whatsapp`     | WhatsApp number, digits only with country code, e.g. `919812345678` |
| `email`        | Email address                                                      |
| `address`      | Office address                                                     |
| `hours`        | Working hours                                                      |
| `mapQuery`     | Text to search on Google Maps for the contact map. Leave it empty to hide the map |
| `formEndpoint` | Where form submissions go (see step 3)                             |

Each value appears in several places, so you only need to change it here.

For better search-engine results, also replace the company name inside the `<title>` tag near the top of `index.html`.

## 2. Replace the example content

These parts of `index.html` hold **example content**. Replace it with your real details before going live. Each part is marked with an `EDIT:` comment.

- **Stats in the hero** (sites installed, capacity, years, response time). Search for `EDIT: replace these numbers`.
- **Project cards**. Search for `EDIT: these are example cards`. Each card has a type, a capacity, a title, a short description and some tags. To show a real photo, copy it into `assets/projects/`. Then replace the `<div class="pm-art ..."></div>` line in the card with:

  ```html
  <img src="assets/projects/my-site.jpg" alt="5 kW rooftop system in Jaipur" loading="lazy">
  ```

  Photos look best in landscape, cropped to about 16:10.

## 3. Set up form delivery

The **Get a quote** and **Get in touch** forms work in one of two ways:

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

- **GitHub Pages:** in the repository, go to **Settings → Pages**. Under **Source**, choose *Deploy from a branch*, then pick `master` and `/ (root)`. The site goes live at `https://<user>.github.io/<repo>/`. On a free GitHub plan, Pages only works if the repository is **public**.
- **Netlify or Cloudflare Pages:** connect the repository. No build command is needed, and the publish directory is the root.
- **Custom domain:** add it in the Pages or Netlify settings, then point your domain's DNS to the host.
