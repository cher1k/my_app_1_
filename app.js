document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Локальные изображения-заглушки (работают всегда)
    const localImages = {
        nature: [
            'https://www.gstatic.com/webp/gallery/1.jpg',
            'https://www.gstatic.com/webp/gallery/2.jpg',
            'https://www.gstatic.com/webp/gallery/4.jpg'
        ],
        animals: [
            'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/6/66/An_up-close_picture_of_a_curious_male_domestic_shorthair_tabby_cat.jpg'
        ],
        food: [
            'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Weekend_brunch.jpg/1200px-Weekend_brunch.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Pizza_%281%29.jpg/1200px-Pizza_%281%29.jpg'
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

        setTimeout(() => {
            try {
                let images = [];
                
                // Определяем категорию
                if (/природ|пейзаж|лес|гора/.test(query)) {
                    images = [...localImages.nature];
                } 
                else if (/кот|кош|живот|пёс|собак/.test(query)) {
                    images = [...localImages.animals];
                }
                else if (/еда|кулин|пицц|бургер/.test(query)) {
                    images = [...localImages.food];
                }
                else {
                    // Смешиваем все категории
                    images = [
                        ...localImages.nature,
                        ...localImages.animals,
                        ...localImages.food
                    ].sort(() => 0.5 - Math.random()).slice(0, 3);
                }

                displayResults(images);
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('⚠️ Ошибка загрузки', 'error');
            } finally {
                searchBtn.disabled = false;
            }
        }, 500);
    }

    function displayResults(images) {
        if (!images || images.length === 0) {
            showMessage('😕 Ничего не найдено', 'error');
            return;
        }

        resultsDiv.innerHTML = images.map((img, index) => `
            <div class="image-card">
                <img src="${img}" 
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
const localImages = {
    nature: [
        // Добавьте свои URL здесь
        'https://example.com/nature1.jpg',
        'https://example.com/nature2.jpg'
    ],
    // ...
};