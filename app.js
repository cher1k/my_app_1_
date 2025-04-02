document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const queryInput = document.getElementById('query');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    searchBtn.addEventListener('click', performSearch);
    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    async function performSearch() {
        const query = queryInput.value.trim();
        if (!query) return;

        // Показать индикатор загрузки
        loadingDiv.style.display = 'block';
        resultsDiv.innerHTML = '';

        try {
            // Отправить запрос на сервер
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            // Отобразить результаты
            if (data.results && data.results.length > 0) {
                resultsDiv.innerHTML = data.results.map(result => `
                    <div class="result-item">
                        <h3 class="result-title">${result.title}</h3>
                        <p class="result-snippet">${result.snippet}</p>
                        <a href="${result.url}" target="_blank" rel="noopener">Читать далее</a>
                    </div>
                `).join('');
            } else {
                resultsDiv.innerHTML = '<p>Ничего не найдено. Попробуйте изменить запрос.</p>';
            }
        } catch (error) {
            console.error('Ошибка поиска:', error);
            resultsDiv.innerHTML = '<p>Произошла ошибка при выполнении поиска. Пожалуйста, попробуйте позже.</p>';
        } finally {
            loadingDiv.style.display = 'none';
        }
    }
}); 

// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// API endpoint для поиска
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        // Здесь будет логика поиска и обработки результатов
        // Например, использование поискового API
        
        // Заглушка для примера
        const mockResults = [
            {
                title: "Результат по запросу: " + query,
                snippet: "Это пример результата поиска. В реальной реализации здесь будет информация, найденная в интернете.",
                url: "#"
            }
        ];
        
        res.json({ results: mockResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 

