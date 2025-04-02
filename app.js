document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && executeSearch());

    async function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            showMessage('✏️ Введите запрос', 'error');
            return;
        }

        showMessage('🔍 Ищем картинки...', 'loading');
        searchBtn.disabled = true;

        try {
            // Используем комбинацию источников
            const images = [
                ...await getPicsumPhotos(query),
                ...await getPlaceholderImages(query)
            ].slice(0, 12); // Ограничиваем 12 результатами

            displayResults(images);
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage('😞 Не удалось загрузить картинки', 'error');
        } finally {
            searchBtn.disabled = false;
        }
    }

    // 1. Picsum Photos - реалистичные изображения
    async function getPicsumPhotos(query) {
        try {
            const num = Math.floor(Math.random() * 1000);
            return [
                `https://picsum.photos/seed/${query}1/300/200`,
                `https://picsum.photos/seed/${query}2/300/200`,
                `https://picsum.photos/seed/${query}3/300/200`
            ];
        } catch {
            return [];
        }
    }

    // 2. Placeholder - резервный источник
    async function getPlaceholderImages(query) {
        const keywords = encodeURIComponent(query);
        return [
            `https://placekitten.com/300/200?image=${Math.floor(Math.random() * 16)}`,
            `https://placeholder.com/300x200.png?text=${keywords}`,
            `https://baconmockup.com/300/200`
        ];
    }

    function displayResults(images) {
        if (!images.length) {
            showMessage('🤷 Ничего не найдено', 'error');
            return;
        }

        resultsDiv.innerHTML = images.map(img => `
            <div class="image-card">
                <img src="${img}" 
                     alt="Результат поиска"
                     onerror="this.src='https://placeholder.com/300x200.png?text=Image+Error'">
                <div class="image-actions">
                    <a href="${img}" target="_blank" download="${img.split('/').pop()}">
                        ⬇️ Скачать
                    </a>
                    <a href="${img}" target="_blank">
                        🔍 Открыть
                    </a>
                </div>
            </div>
        `).join('');
    }

    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="${type}">${text}</div>`;
    }
});