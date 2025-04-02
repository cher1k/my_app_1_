document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const tags = document.querySelectorAll('.tag');

    // Добавляем обработчики для популярных тегов
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent;
            executeSearch();
        });
    });

    // Основная функция поиска
    async function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            showMessage('✏️ Введите запрос (например: пицца, кошки, природа)', 'error');
            return;
        }

        showLoading();
        searchBtn.disabled = true;

        try {
            // Используем 3 разных API для надежности
            const images = [
                ...await fetchPicsumPhotos(query, 4),
                ...await fetchPlaceholderImages(query, 4),
                ...await fetchLoremFlickr(query, 4)
            ].filter(img => img); // Фильтруем пустые значения

            displayResults(images);
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage('⚠️ Не удалось загрузить картинки. Попробуйте другой запрос.', 'error');
        } finally {
            searchBtn.disabled = false;
        }
    }

    // Источник 1: Picsum Photos
    async function fetchPicsumPhotos(query, count) {
        return Array.from({length: count}, (_, i) => 
            `https://picsum.photos/seed/${query}${i}/300/200`
        );
    }

    // Источник 2: Placeholder.com
    async function fetchPlaceholderImages(query, count) {
        return Array.from({length: count}, (_, i) =>
            `https://via.placeholder.com/300x200/4682B4/FFFFFF?text=${encodeURIComponent(query)}+${i+1}`
        );
    }

    // Источник 3: Lorem Flickr
    async function fetchLoremFlickr(query, count) {
        return Array.from({length: count}, (_, i) =>
            `https://loremflickr.com/300/200/${encodeURIComponent(query)}?lock=${i}`
        );
    }

    function displayResults(images) {
        if (!images.length) {
            showMessage('😕 Ничего не найдено. Попробуйте "кошки", "собаки" или "пицца"', 'error');
            return;
        }

        resultsDiv.innerHTML = images.map((img, i) => `
            <div class="image-card">
                <img src="${img}" 
                     alt="${searchInput.value}"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Картинка+не+загрузилась'">
                <div class="image-actions">
                    <a href="${img}" target="_blank" rel="noopener noreferrer">
                        🔍 Открыть
                    </a>
                    <a href="${img}" download="image_${i}.jpg">
                        ⬇️ Скачать
                    </a>
                </div>
            </div>
        `).join('');
    }

    function showLoading() {
        resultsDiv.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Идет поиск картинок...
            </div>
        `;
    }

    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="${type}">${text}</div>`;
    }

    // Инициируем поиск при загрузке
    searchInput.value = 'пицца';
    executeSearch();
});