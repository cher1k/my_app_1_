document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    
    // Обработчики событий
    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeSearch();
    });
    
    // Основная функция поиска
    async function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            showMessage('Введите поисковый запрос', 'error');
            return;
        }
        
        showMessage('Идет поиск...', 'loading');
        
        try {
            // 1. Пробуем Google Images
            let images = await searchGoogleImages(query);
            
            // 2. Если нет результатов - пробуем Unsplash
            if (images.length === 0) {
                images = await searchUnsplash(query);
            }
            
            // 3. Если всё равно нет - показываем заглушки
            if (images.length === 0) {
                showMessage('Ничего не найдено. Попробуйте другой запрос', 'error');
                return;
            }
            
            displayResults(images);
        } catch (error) {
            console.error('Ошибка поиска:', error);
            showMessage('Произошла ошибка при поиске', 'error');
        }
    }
    
    // Поиск через Google Images
    async function searchGoogleImages(query) {
        try {
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
            
            const response = await fetch(proxyUrl + targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const images = Array.from(doc.querySelectorAll('img'))
                .map(img => img.getAttribute('src'))
                .filter(src => src && src.startsWith('http'));
            
            return images.slice(0, 12);
        } catch (error) {
            console.warn('Google Images не доступен:', error);
            return [];
        }
    }
    
    // Резервный поиск через Unsplash
    async function searchUnsplash(query) {
        try {
            const response = await fetch(`https://source.unsplash.com/random/300x200/?${encodeURIComponent(query)}`);
            return [response.url];
        } catch (error) {
            console.warn('Unsplash не доступен:', error);
            return [];
        }
    }
    
    // Отображение результатов
    function displayResults(images) {
        resultsDiv.innerHTML = images.map(img => `
            <img src="${img}" 
                 alt="Результат поиска" 
                 loading="lazy"
                 onerror="this.style.display='none'">
        `).join('');
    }
    
    // Показать сообщение
    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="${type}">${text}</div>`;
    }
});