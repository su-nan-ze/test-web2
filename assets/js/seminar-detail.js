import './main.js';

function formatDateTime(value) {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function getSeminarId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadSeminarDetail() {
  const container = document.getElementById('seminar-detail');
  const titleTarget = document.getElementById('seminar-title');
  const subtitleTarget = document.getElementById('seminar-subtitle');

  if (!container) return;

  const seminarId = getSeminarId();
  if (!seminarId) {
    container.innerHTML = '<p>Seminar identifier missing. Please return to the <a href="seminars.html">seminar archive</a>.</p>';
    return;
  }

  try {
    const response = await fetch('data/seminars.json');
    if (!response.ok) throw new Error(`Failed to load seminars: ${response.status}`);
    const seminars = await response.json();

    const seminar = seminars.find((item) => item.id === seminarId);
    if (!seminar) {
      container.innerHTML = '<p>We could not find that seminar. Please return to the <a href="seminars.html">seminar archive</a>.</p>';
      return;
    }

    if (titleTarget) {
      titleTarget.textContent = seminar.title;
    }
    if (subtitleTarget) {
      subtitleTarget.textContent = seminar.speaker;
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

    addMeta('Speaker', seminar.speaker);
    addMeta('Date & Time', formatDateTime(seminar.datetime));
    addMeta('Location', seminar.location);

    detail.appendChild(metadata);

    if (seminar.summary) {
      const summary = document.createElement('p');
      summary.className = 'detail-summary';
      summary.textContent = seminar.summary;
      detail.appendChild(summary);
    }

    if (Array.isArray(seminar.resources) && seminar.resources.length) {
      const resourceSection = document.createElement('section');
      resourceSection.className = 'detail-resources';
      const heading = document.createElement('h2');
      heading.textContent = 'Resources';
      resourceSection.appendChild(heading);

      const list = document.createElement('ul');
      seminar.resources.forEach((resource) => {
        if (!resource?.url) return;
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = resource.url;
        link.textContent = resource.label ?? 'Download';
        link.target = resource.url.startsWith('http') ? '_blank' : '_self';
        link.rel = resource.url.startsWith('http') ? 'noopener noreferrer' : '';
        item.appendChild(link);
        list.appendChild(item);
      });

      if (list.childElementCount) {
        resourceSection.appendChild(list);
        detail.appendChild(resourceSection);
      }
    }

    const backLink = document.createElement('p');
    backLink.className = 'detail-back';
    backLink.innerHTML = '← <a href="seminars.html">Back to Seminars</a>';

    container.innerHTML = '';
    container.appendChild(detail);
    container.appendChild(backLink);
  } catch (error) {
    container.innerHTML = '<p>Unable to load seminar information. Please try again later.</p>';
    console.error(error);
  }
}

loadSeminarDetail();
