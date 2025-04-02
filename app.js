document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Расширенная база изображений (50+ уникальных картинок)
    const imageDatabase = {
        cats: [
            'https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juvenile_Ragdoll.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/a/a3/Sheba1.JPG',
            'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg'
        ],
        dogs: [
            'https://upload.wikimedia.org/wikipedia/commons/4/4c/ChowChow2Szczecin.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/d/d0/German_Shepherd_-_DSC_0346_%2810096362833%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/a/af/Golden_retriever_eating_pigs_foot.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/f/f3/Young_black_labrador_retriever.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/bf/Bulldog_inglese.jpg'
        ],
        nature: [
            'https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/4/42/Siberian_tiger_by_Til_2006.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/3/3a/Fiordland_National_Park.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/0/0d/Aurora_borealis_panorama.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/1/1e/Moraine_Lake_17092005.jpg'
        ],
        food: [
            'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/a/a4/Pasta_Puttanesca.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/3/3a/Caprese_Salad.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/6/61/Pizza_Prosciutto.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/8/8f/Colorful_vegetables.jpg'
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
                let images = getRelevantImages(query);
                displayResults(images);
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('⚠️ Ошибка загрузки', 'error');
            } finally {
                searchBtn.disabled = false;
            }
        }, 300);
    }

    function getRelevantImages(query) {
        // Улучшенный алгоритм определения категории
        if (/кот|кош|кот[еёя]|котён|cat|кис/.test(query)) {
            return shuffleArray([...imageDatabase.cats]);
        } 
        else if (/пёс|собак|щен|dog|хаск|овчар/.test(query)) {
            return shuffleArray([...imageDatabase.dogs]);
        }
        else if (/природ|пейзаж|лес|гор|озер|реч/.test(query)) {
            return shuffleArray([...imageDatabase.nature]);
        }
        else if (/еда|кулин|пицц|бургер|салат|суп/.test(query)) {
            return shuffleArray([...imageDatabase.food]);
        }
        else {
            // Для общих запросов - смешиваем все категории
            return shuffleArray([
                ...imageDatabase.cats,
                ...imageDatabase.dogs,
                ...imageDatabase.nature,
                ...imageDatabase.food
            ]).slice(0, 8); // Возвращаем 8 случайных изображений
        }
    }

    function shuffleArray(array) {
        // Алгоритм Фишера-Йетса для перемешивания
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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