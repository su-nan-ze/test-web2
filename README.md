# LET Lab Website

Static laboratory website inspired by the [Su Nan Ze academic template](https://su-nan-ze.github.io/). The site is built with plain HTML, CSS, and JavaScript for straightforward maintenance and hosting on any static file server (GitHub Pages, university infrastructure, etc.).

## Structure

- `index.html` – Home page with hero, news, research highlights, a publications call-to-action, and contact details.
- `people.html` – Team directory rendered from `data/people.json` into a sortable table with name, job position, email, and personal website columns.
- `seminars.html` – Seminar timeline rendered from `data/seminars.json`, supporting links to PDFs and other resources.
- `publications.html` – Publication archive grouped by year and hydrated from `data/publications.json` with optional resource links.
- `assets/css/styles.css` – Shared styling.
- `assets/js/*.js` – JavaScript modules that hydrate each page.
- `data/*.json` – Content data files for easy editing.
- `assets/resources/` – Optional PDF or multimedia assets referenced from seminars.

## Editing Content

1. Update the JSON files inside `data/` using any text editor.
   - Add people records with `name`, `position`, `email`, `website`, and `role` fields.
   - Add seminar entries with `title`, `speaker`, `datetime`, `location`, `year`, and optional `resources`.
   - Add news entries with `title`, `date`, and `description`.
   - Add publication citations with `year`, optional `month`, `title`, `authors`, `venue`, and optional `links` arrays.
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
