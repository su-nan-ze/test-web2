import './main.js';

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function formatPublicationDate(item) {
  if (!item.year) return null;
  if (!item.month) return String(item.year);
  const date = new Date(Number(item.year), Number(item.month) - 1);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
}

async function loadPublicationDetail() {
  const slug = getQueryParam('slug');
  const container = document.getElementById('publication-detail');
  const titleEl = document.getElementById('publication-title');
  const subtitleEl = document.getElementById('publication-subtitle');

  if (!container) return;

  if (!slug) {
    container.innerHTML = '<p>Publication not found. Please return to the publications archive.</p>';
    return;
  }

  try {
    const response = await fetch('data/publications.json');
    if (!response.ok) throw new Error(`Failed to load publications: ${response.status}`);
    const publications = await response.json();

    const publication = publications.find((item) => item.slug === slug);
    if (!publication) {
      container.innerHTML = '<p>Publication not found. Please return to the publications archive.</p>';
      return;
    }

    if (titleEl) titleEl.textContent = publication.title;
    if (subtitleEl && publication.authors) subtitleEl.textContent = publication.authors;

    const fragment = document.createDocumentFragment();

    const metaList = document.createElement('dl');
    metaList.className = 'detail-meta';

    if (publication.authors) {
      const authorsTerm = document.createElement('dt');
      authorsTerm.textContent = 'Authors';
      const authorsValue = document.createElement('dd');
      authorsValue.textContent = publication.authors;
      metaList.append(authorsTerm, authorsValue);
    }

    if (publication.venue) {
      const venueTerm = document.createElement('dt');
      venueTerm.textContent = 'Venue';
      const venueValue = document.createElement('dd');
      venueValue.textContent = publication.venue;
      metaList.append(venueTerm, venueValue);
    }

    const formattedDate = formatPublicationDate(publication);
    if (formattedDate) {
      const dateTerm = document.createElement('dt');
      dateTerm.textContent = 'Published';
      const dateValue = document.createElement('dd');
      dateValue.textContent = formattedDate;
      metaList.append(dateTerm, dateValue);
    }

    if (publication.note) {
      const noteTerm = document.createElement('dt');
      noteTerm.textContent = 'Notes';
      const noteValue = document.createElement('dd');
      noteValue.textContent = publication.note;
      metaList.append(noteTerm, noteValue);
    }

    fragment.appendChild(metaList);

    if (publication.summary) {
      const summary = document.createElement('p');
      summary.textContent = publication.summary;
      fragment.appendChild(summary);
    }

    if (Array.isArray(publication.links) && publication.links.length) {
      const linksHeading = document.createElement('h2');
      linksHeading.textContent = 'Resources';
      fragment.appendChild(linksHeading);

      const linksList = document.createElement('ul');
      linksList.className = 'link-list';

      publication.links.forEach((link) => {
        if (!link?.url) return;
        const item = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.label ?? 'Link';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        item.appendChild(anchor);
        linksList.appendChild(item);
      });

      fragment.appendChild(linksList);
    }

    const backLink = document.createElement('a');
    backLink.href = 'publications.html';
    backLink.className = 'inline-link';
    backLink.textContent = 'Back to publications';
    fragment.appendChild(backLink);

    container.innerHTML = '';
    container.appendChild(fragment);
  } catch (error) {
    container.innerHTML = '<p>Unable to load publication details at this time.</p>';
    console.error(error);
  }
}

loadPublicationDetail();
