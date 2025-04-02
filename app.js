document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Надежные источники изображений (2024)
    const imageSources = {
        nature: [
            'https://picsum.photos/seed/nature1/300/200',
            'https://picsum.photos/seed/nature2/300/200',
            'https://picsum.photos/seed/nature3/300/200'
        ],
        animals: [
            'https://placekitten.com/300/200',
            'https://placedog.net/300/200',
            'https://loremflickr.com/300/200/dog'
        ],
        food: [
            'https://loremflickr.com/300/200/food',
            'https://baconmockup.com/300/200',
            'https://www.placecage.com/300/200'
        ]
    };

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && executeSearch());

    function executeSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            showMessage('✏️ Введите поисковый запрос', 'error');
            return;
        }

        showMessage('🔍 Ищем картинки...', 'loading');
        searchBtn.disabled = true;

        // Имитация поиска с задержкой
        setTimeout(() => {
            try {
                let images = [];
                
                // Определяем категорию по запросу
                if (query.includes('природа') || query.includes('пейзаж')) {
                    images = [...imageSources.nature];
                } 
                else if (query.includes('кот') || query.includes('кошка') || query.includes('животн')) {
                    images = [...imageSources.animals];
                }
                else if (query.includes('еда') || query.includes('кулин')) {
                    images = [...imageSources.food];
                }
                else {
                    // Смешиваем все категории для других запросов
                    images = [
                        ...imageSources.nature,
                        ...imageSources.animals,
                        ...imageSources.food
                    ].sort(() => 0.5 - Math.random()).slice(0, 3);
                }

                displayResults(images);
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('⚠️ Ошибка загрузки', 'error');
            } finally {
                searchBtn.disabled = false;
            }
        }, 800); // Задержка для имитации реального поиска
    }

    function displayResults(images) {
        if (!images || images.length === 0) {
            showMessage('😕 Ничего не найдено', 'error');
            return;
        }

        resultsDiv.innerHTML = images.map((img, index) => `
            <div class="image-card">
                <img src="${img}?${Date.now()}" 
                     alt="Результат поиска"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Изображение+не+загружено'">
                <div class="image-actions">
                    <button onclick="window.open('${img}', '_blank')">
                        🔍 Открыть
                    </button>
                    <a href="${img}" download="image_${index}.jpg">
                        ⬇️ Скачать
                    </a>
                </div>
            </div>
        `).join('');
    }

    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="${type}">${text}</div>`;
    }
});