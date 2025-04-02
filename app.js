// Инициализация нейросети
let model;
let use;
const userPreferences = JSON.parse(localStorage.getItem('aiPreferences')) || {};

// Загрузка моделей TensorFlow
async function loadModels() {
    console.log("Загрузка моделей ИИ...");
    [model, use] = await Promise.all([
        tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json'),
        use.load()
    ]);
    console.log("Модели ИИ загружены");
}

// Обработка поискового запроса
async function processSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    showLoading(true);
    clearResults();

    try {
        // Анализ запроса нейросетью
        const embeddings = await use.embed(query);
        const prediction = model.predict(embeddings);
        const sentiment = prediction.dataSync()[0];

        // Поиск изображений (имитация)
        const images = await searchImages(query, sentiment);

        // Показ результатов
        displayResults(images);
        showAIResponse(`ИИ обработал запрос: "${query}". ${getSentimentText(sentiment)}`);

        // Сохранение в историю
        if (!userPreferences.queries) userPreferences.queries = {};
        userPreferences.queries[query] = { sentiment, timestamp: Date.now() };
        savePreferences();

    } catch (error) {
        console.error("Ошибка:", error);
        showAIResponse("Произошла ошибка при обработке запроса", true);
    } finally {
        showLoading(false);
    }
}

// Имитация поиска изображений
async function searchImages(query, sentiment) {
    // В реальном приложении здесь будет API Pinterest или других сервисов
    return new Promise(resolve => {
        setTimeout(() => {
            const count = sentiment > 0.6 ? 9 : 6; // Больше результатов для позитивных запросов
            const images = [];
            
            for (let i = 0; i < count; i++) {
                images.push({
                    url: `https://source.unsplash.com/random/300x200/?${encodeURIComponent(query)}${i}`,
                    id: `${query}-${i}`
                });
            }
            
            resolve(images);
        }, 800);
    });
}

// Отображение результатов
function displayResults(images) {
    const container = document.getElementById('results');
    container.innerHTML = images.map(img => `
        <div class="card">
            <img src="${img.url}" alt="${img.id}" loading="lazy">
            <div class="card-content">
                <div class="feedback-buttons">
                    <button class="feedback-btn like-btn" data-id="${img.id}">👍 Нравится</button>
                    <button class="feedback-btn dislike-btn" data-id="${img.id}">👎 Не нравится</button>
                </div>
            </div>
        </div>
    `).join('');

    // Обработчики feedback
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => handleFeedback(btn.dataset.id, true));
    });
    
    document.querySelectorAll('.dislike-btn').forEach(btn => {
        btn.addEventListener('click', () => handleFeedback(btn.dataset.id, false));
    });
}

// Обработка пользовательского feedback
function handleFeedback(imageId, isPositive) {
    if (!userPreferences.feedback) userPreferences.feedback = {};
    userPreferences.feedback[imageId] = isPositive;
    savePreferences();
    
    showAIResponse(`Спасибо! ИИ учтет ваше ${isPositive ? 'предпочтение' : 'неодобрение'} для улучшения результатов.`);
}

// Вспомогательные функции
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function clearResults() {
    document.getElementById('results').innerHTML = '';
}

function showAIResponse(message, isError = false) {
    const el = document.getElementById('aiResponse');
    el.textContent = message;
    el.style.display = 'block';
    el.style.background = isError ? '#ffebee' : '#e3f2fd';
    el.style.color = isError ? '#c62828' : '#1565c0';
}

function getSentimentText(score) {
    if (score > 0.7) return "Запрос распознан как позитивный";
    if (score < 0.3) return "Запрос распознан как негативный";
    return "Запрос распознан как нейтральный";
}

function savePreferences() {
    localStorage.setItem('aiPreferences', JSON.stringify(userPreferences));
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadModels();
    
    document.getElementById('searchBtn').addEventListener('click', processSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processSearch();
    });
    
    // Первый запрос при загрузке
    document.getElementById('searchInput').value = "красивые пейзажи";
    processSearch();
}); 

async function searchImages(query) {
    const response = await fetch(`https://api.pinterest.com/v3/search/?query=${query}`);
    const data = await response.json();
    return data.pins.map(pin => ({
        url: pin.image.original.url,
        id: pin.id
    }));
} 

// Добавьте после loadModels()
async function retrainModel() {
    // Ваша логика дообучения на основе userPreferences
} 

async function searchImages(query) {
    const [pins, unsplash] = await Promise.all([
        fetchPinterest(query),
        fetchUnsplash(query)
    ]);
    return [...pins, ...unsplash];
} 

