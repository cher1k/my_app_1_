// app.js
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const queryInput = document.getElementById('query');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    // Проверка соединения с сервером
    checkServerConnection();

    searchBtn.addEventListener('click', performSearch);
    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    async function checkServerConnection() {
        try {
            const response = await fetch('/api/health');
            if (!response.ok) throw new Error('Server not responding');
            console.log('Сервер доступен');
        } catch (error) {
            showError('Ошибка соединения с сервером. Пожалуйста, проверьте подключение.');
        }
    }

    async function performSearch() {
        const query = queryInput.value.trim();
        if (!query) {
            showError('Пожалуйста, введите запрос');
            return;
        }

        showLoading(true);
        clearResults();

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка сервера');
            }

            const data = await response.json();
            displayResults(data.results);

        } catch (error) {
            console.error('Search error:', error);
            showError(error.message);
        } finally {
            showLoading(false);
        }
    }

    function displayResults(results) {
        if (!results || results.length === 0) {
            resultsDiv.innerHTML = '<div class="no-results">Ничего не найдено. Попробуйте изменить запрос.</div>';
            return;
        }

        resultsDiv.innerHTML = results.map(result => `
            <div class="result-item">
                <h3 class="result-title">${result.title}</h3>
                <p class="result-snippet">${result.snippet}</p>
                <div class="result-meta">
                    <span class="confidence">Точность: ${Math.round(result.confidence * 100)}%</span>
                    <a href="${result.url}" target="_blank" rel="noopener" class="read-more">
                        Подробнее <span class="arrow">→</span>
                    </a>
                </div>
            </div>
        `).join('');
    }

    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                <p>${message}</p>
                <button onclick="window.location.reload()">Обновить страницу</button>
            </div>
        `;
    }

    function showLoading(show) {
        loadingDiv.style.display = show ? 'block' : 'none';
    }

    function clearResults() {
        resultsDiv.innerHTML = '';
    }
}); 

// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API endpoints
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ 
                error: 'Query parameter is required' 
            });
        }

        // Имитация работы нейросети (замените на реальную логику)
        const results = await simulateAISearch(query);
        
        res.json({ 
            status: 'success',
            query,
            results
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Функция-заглушка для имитации работы ИИ
async function simulateAISearch(query) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    title: `Результат по запросу "${query}"`,
                    snippet: "Это имитация работы нейросети. В реальной реализации здесь будут результаты анализа веб-страниц.",
                    url: "#",
                    confidence: 0.85
                },
                {
                    title: "Пример обучающегося алгоритма",
                    snippet: "Нейросеть постепенно улучшает ответы на основе ваших запросов и найденных данных.",
                    url: "#",
                    confidence: 0.72
                }
            ]);
        }, 1500);
    });
}

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Проверьте работоспособность: http://localhost:${PORT}/api/health`);
});  

// В server.js добавьте:
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'active', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
}); 