document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const pinterestContainer = document.getElementById('pinterestContainer');
    const loadingIndicator = document.getElementById('loading');
    const sourceBtns = document.querySelectorAll('.source-btn');

    // Локальная база изображений
    const localImages = {
        'кошки': [
            'https://img.freepik.com/free-photo/red-white-cat-i-white-studio_155003-13189.jpg',
            'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-flowers-around_23-2148982299.jpg'
        ],
        'пицца': [
            'https://img.freepik.com/free-photo/top-view-pepperoni-pizza_141793-2158.jpg',
            'https://img.freepik.com/free-photo/tasty-pizza-with-ingredients_23-2148796398.jpg'
        ]
    };

    // Текущий источник
    let currentSource = 'pinterest';

    // Обработчики событий
    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && executeSearch());
    
    sourceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sourceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSource = btn.dataset.source;
            if (searchInput.value.trim()) executeSearch();
        });
    });

    // Основная функция поиска
    async function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            showMessage('Введите поисковый запрос', 'error');
            return;
        }

        showLoading();
        clearResults();

        try {
            switch(currentSource) {
                case 'pinterest':
                    showPinterestWidget(query);
                    break;
                case 'local':
                    showLocalImages(query);
                    break;
                case 'all':
                    showAllSources(query);
                    break;
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage('Произошла ошибка при поиске', 'error');
        } finally {
            hideLoading();
        }
    }

    // Показать виджет Pinterest
    function showPinterestWidget(query) {
        resultsDiv.classList.add('hidden');
        pinterestContainer.classList.remove('hidden');
        
        const widget = pinterestContainer.querySelector('a');
        widget.href = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
        
        // Переинициализация виджета
        if (window.PinUtils) {
            window.PinUtils.build();
        }
    }

    // Показать локальные изображения
    function showLocalImages(query) {
        pinterestContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        
        const images = localImages[query.toLowerCase()] || [];
        displayResults(images);
    }

    // Показать все источники
    async function showAllSources(query) {
        pinterestContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        
        // 1. Локальные изображения
        const localResults = localImages[query.toLowerCase()] || [];
        
        // 2. Изображения с внешних API
        const apiResults = await fetchExternalImages(query);
        
        // Объединяем результаты
        const allResults = [...localResults, ...apiResults];
        displayResults(allResults);
    }

    // Загрузка изображений с внешних API
    async function fetchExternalImages(query) {
        try {
            const responses = await Promise.all([
                fetch(`https://source.unsplash.com/300x200/?${encodeURIComponent(query)}`),
                fetch(`https://loremflickr.com/json/300/200/${encodeURIComponent(query)}`)
            ]);
            
            return responses.filter(r => r.ok).map(r => r.url);
        } catch {
            return [];
        }
    }

    // Отображение результатов
    function displayResults(images) {
        if (!images.length) {
            showMessage('Ничего не найдено', 'info');
            return;
        }

        resultsDiv.innerHTML = images.map((img, i) => `
            <div class="image-card">
                <img src="${img}" 
                     alt="Результат поиска"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Изображение+не+загружено'">
                <div class="image-actions">
                    <a href="${img}" target="_blank" rel="noopener">🔍 Открыть</a>
                    <a href="${img}" download="image_${i}.jpg">⬇️ Скачать</a>
                </div>
            </div>
        `).join('');
    }

    // Вспомогательные функции
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }

    function clearResults() {
        resultsDiv.innerHTML = '';
    }

    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
    }

    // Инициализация
    function init() {
        searchInput.value = 'кошки';
        executeSearch();
    }

    init();
}); 