const yearTarget = document.getElementById('year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

async function loadNews() {
  const newsList = document.getElementById('news-list');
  if (!newsList) return;

  try {
    const response = await fetch('data/news.json');
    if (!response.ok) throw new Error(`Failed to load news: ${response.status}`);
    const newsItems = await response.json();

    const fragment = document.createDocumentFragment();
    newsItems.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'card';
      article.innerHTML = `
        <time datetime="${item.date}">${new Date(item.date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}</time>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `;
      fragment.appendChild(article);
    });

    newsList.innerHTML = '';
    newsList.appendChild(fragment);
  } catch (error) {
    newsList.innerHTML = '<p>Unable to load news at this time. Please try again later.</p>';
    console.error(error);
  }
}

loadNews();

