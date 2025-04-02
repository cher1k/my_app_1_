document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // База точно соответствующих запросу изображений
    const imageDatabase = {
        // Пицца
        'пицца': [
            'https://img.freepik.com/free-photo/top-view-pepperoni-pizza_141793-2158.jpg',
            'https://img.freepik.com/free-photo/tasty-pizza-with-ingredients_23-2148796398.jpg',
            'https://img.freepik.com/free-photo/flat-lay-pizza-slices-arrangement_23-2148773774.jpg'
        ],
        'pizza': [
            'https://img.freepik.com/free-photo/pepperoni-pizza-with-sausages_141793-1780.jpg',
            'https://img.freepik.com/free-photo/pizza-with-tomatoes_144627-27257.jpg'
        ],
        
        // Кошки
        'кошки': [
            'https://img.freepik.com/free-photo/red-white-cat-i-white-studio_155003-13189.jpg',
            'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-flowers-around_23-2148982299.jpg'
        ],
        'коты': [
            'https://img.freepik.com/free-photo/cute-kitten-staring-out-window_23-2148986298.jpg'
        ],
        'cats': [
            'https://img.freepik.com/free-photo/close-up-on-kitten-surrounded-by-flowers_23-2148982288.jpg'
        ],
        
        // Природа
        'природа': [
            'https://img.freepik.com/free-photo/beautiful-shot-mountain-range-with-lake-front_181624-24925.jpg'
        ],
        'nature': [
            'https://img.freepik.com/free-photo/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise_335224-794.jpg'
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
                const images = getExactMatches(query);
                displayResults(images);
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('⚠️ Ошибка при загрузке', 'error');
            } finally {
                searchBtn.disabled = false;
            }
        }, 300);
    }

    function getExactMatches(query) {
        // Точное соответствие запросу
        if (imageDatabase[query]) {
            return imageDatabase[query];
        }
        
        // Поиск частичных совпадений
        for (const [key, images] of Object.entries(imageDatabase)) {
            if (query.includes(key)) {
                return images;
            }
        }
        
        // Если ничего не найдено
        return [];
    }

    function displayResults(images) {
        if (!images || images.length === 0) {
            showMessage('😕 Ничего не найдено. Попробуйте "пицца", "кошки" или "природа"', 'error');
            return;
        }

        resultsDiv.innerHTML = images.map((img, index) => `
            <div class="image-card">
                <img src="${img}" 
                     alt="${searchInput.value}"
                     loading="lazy"
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
});