document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.github.com/users/YDDLJW')
    .then(response => response.json())
    .then(data => {
      const faviconLink = document.getElementById('favicon');
      faviconLink.href = data.avatar_url;
    })
    .catch(error => console.error('Error fetching GitHub user avatar:', error));

  const nightMode = localStorage.getItem('nightMode');
  if (nightMode === 'true') {
    document.body.classList.add('night-mode');
  }

  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get('search');
  if (searchQuery) {
    document.getElementById('searchInput').value = searchQuery;
    displaySearchResults(searchQuery);
  }

  // 初始化背景图片
  fetch('https://api.github.com/repos/YDDLJW/YDDLJW.github.io/contents/static/backgrounds')
    .then(response => response.json())
    .then(data => {
      const images = data.map(file => file.download_url);
      let currentIndex = 0;
      const backgroundImage = document.getElementById('backgroundImage');
      backgroundImage.src = images[currentIndex];

      backgroundImage.addEventListener('animationiteration', () => {
        currentIndex = Math.floor(Math.random() * images.length);
        backgroundImage.src = images[currentIndex];
      });
    })
    .catch(error => {
      console.error('Error fetching background images:', error);
    });
});

function toggleNightMode() {
  document.body.classList.toggle('night-mode');
  localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}

function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  if (query) {
    window.location.href = `index.html?search=${encodeURIComponent(query)}`;
  } else {
    resetSearch();
  }
}

function resetSearch() {
  const searchResultWrapper = document.getElementById('search-result-wrapper');
  searchResultWrapper.classList.remove('show');
  searchResultWrapper.classList.add('hide');
  setTimeout(() => {
    searchResultWrapper.style.display = 'none';
    window.location.href = 'index.html';
  }, 500);
}

function displaySearchResults(query) {
  const searchResultWrapper = document.getElementById('search-result-wrapper');
  const searchResultTitle = document.getElementById('search-result-title');
  const searchResults = document.getElementById('search-results');

  searchResultTitle.textContent = `Searching... ${query}`;
  searchResults.innerHTML = '';

  contentData.forEach(({ title, description, content, element }) => {
    if (title.toLowerCase().includes(query) || description.toLowerCase().includes(query) || content.toLowerCase().includes(query)) {
      const clone = element.cloneNode(true);
      searchResults.appendChild(clone);
    }
  });

  searchResultWrapper.style.display = 'flex';
  setTimeout(() => {
    searchResultWrapper.classList.add('show');
  }, 10);
}
