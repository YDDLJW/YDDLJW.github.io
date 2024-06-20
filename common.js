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

  document.addEventListener('click', function(event) {
    const searchResultWrapper = document.getElementById('search-result-wrapper');
    if (searchResultWrapper && !searchResultWrapper.contains(event.target) && !event.target.classList.contains('search-input') && !event.target.classList.contains('search-button')) {
      resetSearch();
    }
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
    searchContent(query);
  } else {
    resetSearch();
  }
}

function resetSearch() {
  const searchResultWrapper = document.getElementById('search-result-wrapper');
  searchResultWrapper.classList.remove('show');
  searchResultWrapper.classList.remove('fixed');
  setTimeout(() => {
    searchResultWrapper.style.display = 'none';
    searchResultWrapper.classList.remove('hide');
  }, 500);
}

async function searchContent(query) {
  const searchResultWrapper = document.getElementById('search-result-wrapper');
  const searchResultTitle = document.getElementById('search-result-title');
  const searchResults = document.getElementById('search-results');

  searchResultTitle.textContent = `Searching... ${query}`;
  searchResults.innerHTML = '';

  let found = false;
  try {
    const response = await fetch('https://api.github.com/repos/YDDLJW/YDDLJW.github.io/contents/posts');
    const folders = await response.json();

    for (const folder of folders) {
      if (folder.type === 'dir') {
        const folderResponse = await fetch(folder.url);
        const files = await folderResponse.json();

        for (const file of files) {
          if (file.name.endsWith('.md')) {
            const fileResponse = await fetch(file.download_url);
            const text = await fileResponse.text();

            if (text.includes(query)) {
              const lines = text.split('\n');
              let imageSrc = "https://via.placeholder.com/150";
              let title = `内容模块 ${file.name}`;
              let description = "";
              let content = text;

              for (let line of lines) {
                if (line.includes('<img')) {
                  const match = line.match(/src="(.*?)"/);
                  if (match) {
                    imageSrc = match[1];
                    break;
                  }
                }
              }

              for (let line of lines) {
                if (line.startsWith('#')) {
                  title = line.replace(/^#+\s*/, '');
                } else if (line.trim() !== "" && !line.includes('<img')) {
                  description = line.trim().substring(0, 100) + '...';
                  break;
                }
              }

              const module = document.createElement('a');
              module.href = `template.html?folder=${folder.path}&content=${file.name}`;
              module.className = 'content-module search-result';
              module.id = `module-${file.name}`;
              module.innerHTML = `
                <img src="${imageSrc}" alt="缩略图">
                <div>
                  <h2>${title}</h2>
                  <p>${description}</p>
                </div>
              `;
              searchResults.appendChild(module);
              found = true;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching content list:', error);
  }

  if (!found) {
    searchResults.innerHTML = '<p>没有检索到关键词</p>';
  }

  searchResultWrapper.classList.add('fixed');
  searchResultWrapper.style.display = 'flex';
  setTimeout(() => {
    searchResultWrapper.classList.add('show');
  }, 10);
}
