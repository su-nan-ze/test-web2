import './main.js';

function formatMonthYear(year, month) {
  if (!year) return '';
  if (!month && month !== 0) return String(year);
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

function getPublicationId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadPublicationDetail() {
  const container = document.getElementById('publication-detail');
  const titleTarget = document.getElementById('publication-title');
  const subtitleTarget = document.getElementById('publication-subtitle');

  if (!container) return;

  const publicationId = getPublicationId();
  if (!publicationId) {
    container.innerHTML = '<p>Publication identifier missing. Please return to the <a href="publications.html">research library</a>.</p>';
    return;
  }

  try {
    const response = await fetch('data/publications.json');
    if (!response.ok) throw new Error(`Failed to load publications: ${response.status}`);
    const publications = await response.json();

    const publication = publications.find((item) => item.id === publicationId);
    if (!publication) {
      container.innerHTML = '<p>We could not find that publication. Please return to the <a href="publications.html">research library</a>.</p>';
      return;
    }

    if (titleTarget) {
      titleTarget.textContent = publication.title;
    }
    if (subtitleTarget) {
      subtitleTarget.textContent = publication.venue ?? 'CIS-Lab Research Output';
    }

    const detail = document.createElement('article');
    detail.className = 'detail-card';

    const metadata = document.createElement('dl');
    metadata.className = 'detail-metadata';

    const addMeta = (label, value) => {
      if (!value) return;
      const block = document.createElement('div');
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      block.appendChild(dt);
      block.appendChild(dd);
      metadata.appendChild(block);
    };

    addMeta('Authors', publication.authors ?? 'Not specified');
    addMeta('Venue', publication.venue ?? '—');

    const dateLabel = formatMonthYear(publication.year, publication.month);
    addMeta('Published', dateLabel);
    addMeta('Notes', publication.note);

    detail.appendChild(metadata);

    if (publication.abstract) {
      const abstract = document.createElement('p');
      abstract.className = 'detail-summary';
      abstract.textContent = publication.abstract;
      detail.appendChild(abstract);
    }

    const links = Array.isArray(publication.links)
      ? publication.links
      : publication.link
      ? [{ label: publication.linkLabel ?? 'View', url: publication.link }]
      : [];

    if (links.length) {
      const resourceSection = document.createElement('section');
      resourceSection.className = 'detail-resources';
      const heading = document.createElement('h2');
      heading.textContent = 'Resources';
      resourceSection.appendChild(heading);

      const list = document.createElement('ul');
      links.forEach((resource) => {
        if (!resource?.url) return;
        const item = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = resource.url;
        anchor.textContent = resource.label ?? 'Link';
        anchor.target = resource.url.startsWith('http') ? '_blank' : '_self';
        anchor.rel = resource.url.startsWith('http') ? 'noopener noreferrer' : '';
        item.appendChild(anchor);
        list.appendChild(item);
      });

      if (list.childElementCount) {
        resourceSection.appendChild(list);
        detail.appendChild(resourceSection);
      }
    }

    const backLink = document.createElement('p');
    backLink.className = 'detail-back';
    backLink.innerHTML = '← <a href="publications.html">Back to Research Library</a>';

    container.innerHTML = '';
    container.appendChild(detail);
    container.appendChild(backLink);
  } catch (error) {
    container.innerHTML = '<p>Unable to load publication information. Please try again later.</p>';
    console.error(error);
  }
}

loadPublicationDetail();
