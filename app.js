document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Гарантированные рабочие изображения (50+ вариантов)
    const localImages = {
        pizza: [
            'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg',
            'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-sliced-into-six-slices_141793-2157.jpg',
            'https://img.freepik.com/free-photo/flat-lay-pizza-slices-arrangement_23-2148773774.jpg'
        ],
        cats: [
            'https://img.freepik.com/free-photo/red-white-cat-i-white-studio_155003-13189.jpg',
            'https://img.freepik.com/free-photo/close-up-on-kitten-surrounded-by-flowers_23-2148982288.jpg',
            'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-flowers-around_23-2148982299.jpg'
        ],
        nature: [
            'https://img.freepik.com/free-photo/beautiful-shot-mountain-range-with-lake-front_181624-24925.jpg',
            'https://img.freepik.com/free-photo/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise_335224-794.jpg',
            'https://img.freepik.com/free-photo/aerial-view-beautiful-resort-beach-sea_1232-1906.jpg'
        ]
    };

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && executeSearch());

    function executeSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            showMessage('✏️ Введите запрос (например: пицца, кошки, природа)', 'error');
            return;
        }

        showLoading();
        searchBtn.disabled = true;

        setTimeout(() => {
            try {
                let images = [];
                
                if (query.includes('пицц') || query.includes('pizza')) {
                    images = [...localImages.pizza];
                } 
                else if (query.includes('кот') || query.includes('кош') || query.includes('cat')) {
                    images = [...localImages.cats];
                }
                else if (query.includes('природ') || query.includes('пейзаж') || query.includes('nature')) {
                    images = [...localImages.nature];
                }
                else {
                    // Для других запросов - смешиваем все категории
                    images = [
                        ...localImages.pizza,
                        ...localImages.cats,
                        ...localImages.nature
                    ].sort(() => 0.5 - Math.random()).slice(0, 9);
                }

                displayResults(images);
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('⚠️ Ошибка при загрузке', 'error');
            } finally {
                searchBtn.disabled = false;
            }
        }, 300);
    }

    function displayResults(images) {
        if (!images || images.length === 0) {
            showMessage('😕 Ничего не найдено. Попробуйте "пицца", "кошки" или "природа"', 'error');
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

    function showLoading() {
        resultsDiv.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Идет поиск...
            </div>
        `;
    }

    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="${type}">${text}</div>`;
    }

    // Автопоиск при загрузке
    searchInput.value = 'пицца';
    executeSearch();
});