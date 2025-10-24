# LET Lab Website

Static laboratory website inspired by the [Su Nan Ze academic template](https://su-nan-ze.github.io/). The site is built with plain HTML, CSS, and JavaScript for straightforward maintenance and hosting on any static file server (GitHub Pages, university infrastructure, etc.).

## Structure

- `index.html` – Home page with hero, news highlights, research themes, a publications call-to-action, and contact details.
- `people.html` – Team directory rendered from `data/people.json` into a sortable table with name, job position, email, and personal website columns.
- `news.html` – Archive of lab announcements populated from `data/news.json` with year filtering.
- `seminars.html` – Seminar timeline rendered from `data/seminars.json`, supporting links to PDFs and individual seminar pages (`seminar.html`).
- `publications.html` – Research library grouped by year and hydrated from `data/publications.json` with optional resource links and detail pages (`publication.html`).
- `seminar.html` / `publication.html` – Detail templates that hydrate from the shared JSON data based on query parameters.
- `assets/css/styles.css` – Shared styling.
- `assets/js/*.js` – JavaScript modules that hydrate each page.
- `data/*.json` – Content data files for easy editing.
- `assets/resources/` – Optional PDF or multimedia assets referenced from seminars.

## Editing Content

1. Update the JSON files inside `data/` using any text editor.
  - Add people records with `name`, `position`, `email`, `website`, and `role` fields.
  - Add seminar entries with `id`, `title`, `speaker`, `datetime`, `location`, `year`, `summary`, and optional `resources` (each with `label` + `url`).
  - Add news entries with `id`, `title`, `date`, `description`, and optional longer-form `content`.
  - Add publication citations with `id`, `year`, optional `month`, `title`, `authors`, `venue`, optional `note`, `abstract`, and optional `links` arrays (`label` + `url`).
2. Place PDF slide decks or papers inside `assets/resources/` (or link to external URLs).
3. Commit and redeploy the static files to your hosting platform.

The JavaScript modules automatically refresh the UI when the JSON files are updated—no build step is required.

## Local Preview

You can preview the site locally using any static server. For example:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Deploying to GitHub Pages

1. Create a new GitHub repository (or reuse an existing one) and push the entire site directory, including `index.html`, `assets/`, and `data/`.
2. In the repository settings, open the **Pages** section (Settings → Pages) and choose the branch and folder you want to publish, typically the `main` branch and the `/ (root)` folder. Save the configuration.
3. Wait for GitHub Pages to build your site. Once the status shows "Deployed," visit the provided URL (e.g., `https://<username>.github.io/<repository>/`).
4. To update the live site, edit files locally, commit the changes, and push them to GitHub. GitHub Pages will automatically redeploy the latest version.

For custom domains, configure DNS records and add a `CNAME` file per GitHub's documentation.
