import './main.js';

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function loadNews() {
  const timeline = document.getElementById('news-timeline');
  const yearFilter = document.getElementById('news-year');
  if (!timeline || !yearFilter) return;

  try {
    const response = await fetch('data/news.json');
    if (!response.ok) throw new Error(`Failed to load news: ${response.status}`);
    const newsItems = await response.json();

    const years = Array.from(new Set(newsItems.map((item) => new Date(item.date).getFullYear()))).sort((a, b) => b - a);
    years.forEach((year) => {
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = year;
      yearFilter.appendChild(option);
    });

    const renderNews = () => {
      const selected = yearFilter.value;
      const fragment = document.createDocumentFragment();

      newsItems
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .filter((item) => selected === 'all' || String(new Date(item.date).getFullYear()) === selected)
        .forEach((item) => {
          const article = document.createElement('article');
          article.className = 'timeline-item';

          const header = document.createElement('header');
          const info = document.createElement('div');
          const titleEl = document.createElement('h3');
          titleEl.textContent = item.title;
          const descEl = document.createElement('p');
          descEl.textContent = item.description;

          info.appendChild(titleEl);
          info.appendChild(descEl);

          const timeEl = document.createElement('time');
          timeEl.dateTime = item.date;
          timeEl.textContent = formatDate(item.date);

          header.appendChild(info);
          header.appendChild(timeEl);
          article.appendChild(header);

          if (item.content) {
            const contentEl = document.createElement('p');
            contentEl.className = 'timeline-summary';
            contentEl.textContent = item.content;
            article.appendChild(contentEl);
          }

          fragment.appendChild(article);
        });

      timeline.innerHTML = '';
      if (!fragment.childNodes.length) {
        const emptyState = document.createElement('p');
        emptyState.textContent = 'No news items found for the selected year.';
        timeline.appendChild(emptyState);
      } else {
        timeline.appendChild(fragment);
      }
    };

    yearFilter.addEventListener('change', renderNews);
    renderNews();
  } catch (error) {
    timeline.innerHTML = '<p>Unable to load news at this time.</p>';
    console.error(error);
  }
}

loadNews();
