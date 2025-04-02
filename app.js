document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Кэш для хранения найденных изображений
    let imageCache = [];

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && executeSearch());

    async function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            showMessage('✏️ Введите поисковый запрос', 'error');
            return;
        }

        showMessage('🔍 Ищем картинки...', 'loading');
        searchBtn.disabled = true;

        try {
            // Используем стабильные источники
            imageCache = [
                ...await getNaturePhotos(query),
                ...await getAnimalPhotos(query),
                ...await getFoodPhotos(query)
            ].filter(img => img); // Фильтруем пустые значения

            if (imageCache.length === 0) {
                showMessage('😕 Ничего не найдено', 'error');
                return;
            }

            displayResults(imageCache);
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage('⚠️ Ошибка загрузки', 'error');
        } finally {
            searchBtn.disabled = false;
        }
    }

    // 1. Природа (гарантированно работающий источник)
    async function getNaturePhotos(query) {
        const baseUrl = 'https://source.unsplash.com/300x200/?';
        return [
            `${baseUrl}${encodeURIComponent(query)},nature`,
            `${baseUrl}${encodeURIComponent(query)},landscape`,
            `${baseUrl}${encodeURIComponent(query)},water`
        ];
    }

    // 2. Животные (резервный источник)
    async function getAnimalPhotos(query) {
        const baseUrl = 'https://source.unsplash.com/300x200/?';
        return [
            `${baseUrl}${encodeURIComponent(query)},animal`,
            `${baseUrl}${encodeURIComponent(query)},cat`,
            `${baseUrl}${encodeURIComponent(query)},dog`
        ];
    }

    // 3. Еда (дополнительный источник)
    async function getFoodPhotos(query) {
        const baseUrl = 'https://source.unsplash.com/300x200/?';
        return [
            `${baseUrl}${encodeURIComponent(query)},food`,
            `${baseUrl}${encodeURIComponent(query)},fruit`,
            `${baseUrl}${encodeURIComponent(query)},dessert`
        ];
    }

    function displayResults(images) {
        resultsDiv.innerHTML = images.map((img, index) => `
            <div class="image-card" data-id="${index}">
                <img src="${img}" 
                     alt="Результат поиска"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Image+Error'">
                <div class="image-actions">
                    <button onclick="window.open('${img}', '_blank')">
                        🔍 Открыть
                    </button>
                    <button onclick="downloadImage('${img}', 'image_${index}.jpg')">
                        ⬇️ Скачать
                    </button>
                </div>
            </div>
        `).join('');
    }

    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="${type}">${text}</div>`;
    }
});

// Функция для скачивания (добавляем в глобальную область видимости)
function downloadImage(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        })
        .catch(() => alert('Не удалось скачать изображение'));
}