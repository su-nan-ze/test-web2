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

async function loadSeminars() {
  const timeline = document.getElementById('seminar-timeline');
  const yearFilter = document.getElementById('seminar-year');
  if (!timeline || !yearFilter) return;

  try {
    const response = await fetch('data/seminars.json');
    if (!response.ok) throw new Error(`Failed to load seminars: ${response.status}`);
    const seminars = await response.json();

    const years = Array.from(new Set(seminars.map((item) => item.year))).sort((a, b) => b - a);
    years.forEach((year) => {
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = year;
      yearFilter.appendChild(option);
    });

    const renderSeminars = () => {
      const selected = yearFilter.value;
      const fragment = document.createDocumentFragment();

      seminars
        .filter((item) => selected === 'all' || String(item.year) === selected)
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
        .forEach((item) => {
          const slug = item.slug ?? '';
          const article = document.createElement('article');
          article.className = 'timeline-item';

          const header = document.createElement('header');
          const headerText = document.createElement('div');
          const titleLink = document.createElement('a');
          titleLink.href = slug ? `seminar-detail.html?slug=${encodeURIComponent(slug)}` : '#';
          titleLink.className = 'timeline-title';
          titleLink.innerHTML = `<h3>${item.title}</h3>`;

          const speaker = document.createElement('p');
          speaker.textContent = item.speaker;

          headerText.appendChild(titleLink);
          headerText.appendChild(speaker);

          const time = document.createElement('time');
          time.dateTime = item.datetime;
          time.textContent = formatDateTime(item.datetime);

          header.appendChild(headerText);
          header.appendChild(time);
          article.appendChild(header);

          const location = document.createElement('p');
          location.innerHTML = `<strong>Location:</strong> ${item.location}`;
          article.appendChild(location);

          if (Array.isArray(item.resources) && item.resources.length) {
            const resources = document.createElement('div');
            resources.className = 'resource-links';
            item.resources.forEach((resource) => {
              const link = document.createElement('a');
              link.href = resource.url;
              link.target = resource.url.startsWith('http') ? '_blank' : '_self';
              link.rel = resource.url.startsWith('http') ? 'noopener' : '';
              link.textContent = resource.label;
              resources.appendChild(link);
            });
            article.appendChild(resources);
          }

          const moreLink = document.createElement('a');
          moreLink.href = slug ? `seminar-detail.html?slug=${encodeURIComponent(slug)}` : '#';
          moreLink.className = 'inline-link';
          moreLink.textContent = 'View seminar details';
          article.appendChild(moreLink);

          fragment.appendChild(article);
        });

      timeline.innerHTML = '';
      if (!fragment.childNodes.length) {
        const emptyState = document.createElement('p');
        emptyState.textContent = 'No seminars found for the selected year.';
        timeline.appendChild(emptyState);
      } else {
        timeline.appendChild(fragment);
      }
    };

    yearFilter.addEventListener('change', renderSeminars);
    renderSeminars();
  } catch (error) {
    timeline.innerHTML = '<p>Unable to load seminar information at this time.</p>';
    console.error(error);
  }
}

loadSeminars();
