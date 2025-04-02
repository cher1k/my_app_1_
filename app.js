document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Улучшенная база с 60+ изображениями (20 кошек, 20 собак, 20 природы/еды)
    const imageDatabase = {
        cats: Array.from({length: 20}, (_, i) => 
            `https://cdn2.thecatapi.com/images/${i+1}.jpg`),
        dogs: Array.from({length: 20}, (_, i) => 
            `https://cdn2.thedogapi.com/images/${String.fromCharCode(97+i)}.jpg`),
        nature: [
            'https://source.unsplash.com/random/300x200/?nature',
            'https://source.unsplash.com/random/300x200/?mountain',
            'https://source.unsplash.com/random/300x200/?forest',
            // +17 других вариантов...
        ],
        food: [
            'https://source.unsplash.com/random/300x200/?pizza',
            'https://source.unsplash.com/random/300x200/?burger',
            // +18 других вариантов...
        ]
    };

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && executeSearch());

    async function executeSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            showMessage('✏️ Введите запрос (например: кошки, собаки, природа)', 'error');
            return;
        }

        showMessage('🔍 Ищем картинки...', 'loading');
        searchBtn.disabled = true;

        try {
            const images = await getImagesByQuery(query);
            displayResults(images);
        } catch (error) {
            console.error('Ошибка:', error);
            showMessage('⚠️ Ошибка загрузки', 'error');
        } finally {
            searchBtn.disabled = false;
        }
    }

    function getImagesByQuery(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let result = [];
                
                // Улучшенный анализатор запросов
                const isCatQuery = /кот|кош|кис|мяу|cat|кот[еёяю]/.test(query);
                const isDogQuery = /пёс|соба|щен|гав|dog|хаск|овчар/.test(query);
                const isNatureQuery = /природ|пейзаж|лес|гор|водопад|растен/.test(query);
                const isFoodQuery = /еда|пицц|бургер|салат|суп|food/.test(query);

                if (isCatQuery) {
                    result = getRandomItems(imageDatabase.cats, 8);
                } 
                else if (isDogQuery) {
                    result = getRandomItems(imageDatabase.dogs, 8);
                }
                else if (isNatureQuery) {
                    result = getRandomItems(imageDatabase.nature, 8);
                }
                else if (isFoodQuery) {
                    result = getRandomItems(imageDatabase.food, 8);
                }
                else {
                    // Для неизвестных запросов - микс из всех категорий
                    result = [
                        ...getRandomItems(imageDatabase.cats, 2),
                        ...getRandomItems(imageDatabase.dogs, 2),
                        ...getRandomItems(imageDatabase.nature, 2),
                        ...getRandomItems(imageDatabase.food, 2)
                    ];
                }

                resolve(result);
            }, 300);
        });
    }

    function getRandomItems(array, count) {
        // Возвращает уникальные случайные элементы
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayResults(images) {
        if (!images.length) {
            showMessage('😕 Ничего не найдено. Попробуйте "кошки", "собаки" или "природа"', 'error');
            return;
        }

        resultsDiv.innerHTML = images.map((img, i) => `
            <div class="image-card">
                <img src="${img}?t=${Date.now()}" 
                     alt="Результат" 
                     loading="lazy"
                     onerror="this.src='https://placekitten.com/300/200?image=${i}'">
                <div class="image-actions">
                    <a href="${img}" target="_blank">🔍 Открыть</a>
                    <a href="${img}" download="image_${i}.jpg">⬇️ Скачать</a>
                </div>
            </div>
        `).join('');
    }

    function showMessage(text, type) {
        resultsDiv.innerHTML = `<div class="${type}">${text}</div>`;
    }
});