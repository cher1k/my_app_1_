document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');

    // Новый обработчик поиска
    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) {
            alert('Введите поисковый запрос');
            return;
        }

        showLoading();
        
        try {
            // Используем прокси-сервер для обхода CORS
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
            
            const response = await fetch(proxyUrl + targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            const html = await response.text();
            const images = parseGoogleImages(html);
            
            if (images.length > 0) {
                displayResults(images);
            } else {
                showError(new Error('Ничего не найдено'));
            }
        } catch (error) {
            showError(error);
        }
    });

    // Парсинг HTML Google Images
    function parseGoogleImages(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const images = [];
        
        doc.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && src.startsWith('http')) {
                images.push(src);
            }
        });
        
        return images.slice(0, 12); // Возвращаем первые 12 картинок
    }

    function displayResults(images) {
        resultsContainer.innerHTML = images.map(img => `
            <div class="card">
                <img src="${img}" alt="Результат поиска" loading="lazy">
            </div>
        `).join('');
    }

    function showLoading() {
        resultsContainer.innerHTML = '<div class="loading">Идет поиск... ⏳</div>';
    }

    function showError(error) {
        resultsContainer.innerHTML = `
            <div class="loading">
                Ошибка: ${error.message}
                <button onclick="location.reload()">Попробовать снова</button>
            </div>
        `;
    }
});