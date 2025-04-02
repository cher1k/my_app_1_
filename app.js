document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Ваши локальные изображения (как запасной вариант)
    const localImages = {
        'пицца': ['url1.jpg', 'url2.jpg'],
        'кошки': ['url3.jpg', 'url4.jpg']
    };

    // Функция для поиска в Pinterest
    async function searchPinterest(query) {
        try {
            // Используем прокси для обхода CORS
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const pinterestUrl = `https://www.pinterest.com/resource/BaseSearchResource/get/?data=${encodeURIComponent(JSON.stringify({
                options: {
                    query: query,
                    scope: "pins",
                    page_size: 24  // Количество результатов
                }
            }))}`;

            const response = await fetch(proxyUrl + pinterestUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            return data.resource_response.data.results.map(pin => {
                return {
                    url: pin.images.orig.url,
                    description: pin.description || ''
                };
            });

        } catch (error) {
            console.error('Ошибка Pinterest:', error);
            return [];
        }
    }

    async function executeSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            showMessage('Введите запрос', 'error');
            return;
        }

        showLoading();
        searchBtn.disabled = true;

        try {
            // 1. Пробуем Pinterest
            let pinterestResults = await searchPinterest(query);
            
            // 2. Если Pinterest не дал результатов, используем локальные
            if (pinterestResults.length === 0 && localImages[query]) {
                pinterestResults = localImages[query].map(url => ({ url }));
            }

            displayResults(pinterestResults);
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage('Ошибка поиска', 'error');
        } finally {
            searchBtn.disabled = false;
        }
    }

    function displayResults(images) {
        if (!images.length) {
            showMessage('Ничего не найдено', 'error');
            return;
        }

        resultsDiv.innerHTML = images.slice(0, 24).map((img, i) => `
            <div class="image-card">
                <img src="${img.url}" 
                     alt="${img.description || 'Изображение'}"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Ошибка+загрузки'">
                <div class="image-actions">
                    <a href="${img.url}" target="_blank">🔍 Открыть</a>
                    <a href="${img.url}" download="pinterest_${i}.jpg">⬇️ Скачать</a>
                </div>
            </div>
        `).join('');
    }

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && executeSearch());
});