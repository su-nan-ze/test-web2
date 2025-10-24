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
          const detailUrl = item.id ? `seminar.html?id=${encodeURIComponent(item.id)}` : '';
          const article = document.createElement('article');
          article.className = 'timeline-item';

          const header = document.createElement('header');
          const info = document.createElement('div');
          const titleEl = document.createElement('h3');

          if (detailUrl) {
            const link = document.createElement('a');
            link.href = detailUrl;
            link.textContent = item.title;
            titleEl.appendChild(link);
          } else {
            titleEl.textContent = item.title;
          }

          const speakerEl = document.createElement('p');
          speakerEl.textContent = item.speaker;

          info.appendChild(titleEl);
          info.appendChild(speakerEl);

          const timeEl = document.createElement('time');
          timeEl.dateTime = item.datetime;
          timeEl.textContent = formatDateTime(item.datetime);

          header.appendChild(info);
          header.appendChild(timeEl);
          article.appendChild(header);

          const locationEl = document.createElement('p');
          const locationLabel = document.createElement('strong');
          locationLabel.textContent = 'Location:';
          locationEl.appendChild(locationLabel);
          locationEl.append(` ${item.location}`);
          article.appendChild(locationEl);

          if (item.summary) {
            const summaryEl = document.createElement('p');
            summaryEl.className = 'timeline-summary';
            summaryEl.textContent = item.summary;
            article.appendChild(summaryEl);
          }

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
