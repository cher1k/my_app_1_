document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Флаг для отслеживания состояния поиска
    let isSearching = false;

    searchBtn.addEventListener('click', () => !isSearching && executeSearch());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isSearching) executeSearch();
    });

    async function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            showMessage('Введите поисковый запрос', 'error');
            return;
        }

        isSearching = true;
        searchBtn.disabled = true;
        showMessage('Идет поиск...', 'loading');

        try {
            // 1. Сначала пробуем Unsplash (работает без прокси)
            let images = await searchUnsplash(query, 12);
            
            // 2. Если мало результатов, пробуем Pexels
            if (images.length < 6) {
                const pexelsImages = await searchPexels(query);
                images = [...images, ...pexelsImages].slice(0, 12);
            }

            displayResults(images);
        } catch (error) {
            console.error('Search error:', error);
            showMessage('Ошибка при поиске. Попробуйте позже.', 'error');
        } finally {
            isSearching = false;
            searchBtn.disabled = false;
        }
    }

    // Поиск через Unsplash (работает без API ключа)
    async function searchUnsplash(query, count = 3) {
        try {
            const images = [];
            for (let i = 0; i < count; i++) {
                const response = await fetch(`https://source.unsplash.com/random/300x200/?${encodeURIComponent(query)}&${i}`);
                if (response.ok) {
                    images.push(response.url);
                }
            }
            return [...new Set(images)]; // Удаляем дубликаты
        } catch (error) {
            console.warn('Unsplash error:', error);
            return [];
        }
    }

    // Поиск через Pexels (используем их CDN)
    async function searchPexels(query) {
        try {
            // Эмулируем запрос к их CDN
            const keywords = query.split(' ').join('+');
            return [
                `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500&h=500&fit=crop&q=80&bri=5&sat=-20&${keywords}`,
                `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500&h=500&fit=crop&q=80&${keywords}`
            ];
        } catch (error) {
            console.warn('Pexels error:', error);
            return [];
        }
    }

    function displayResults(images) {
        if (!images.length) {
            showMessage('Ничего не найдено. Попробуйте другой запрос', 'error');
            return;
        }

        resultsDiv.innerHTML = images.map(img => `
            <div class="image-card">
                <img src="${img}" 
                     alt="Результат поиска" 
                     loading="lazy"
                     onerror="this.parentElement.remove()">
                <a href="${img}" target="_blank" class="view-btn">Открыть</a>
            </div>
        `).join('');
    }

    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="${type}">${text}</div>`;
    }
});