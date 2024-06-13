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
    searchContent(searchQuery);
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
  window.location.href = `../index.html?search=${encodeURIComponent(query)}`;
}

function resetSearch() {
  window.location.href = '../index.html';
}
