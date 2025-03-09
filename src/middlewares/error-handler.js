const { ValidationError, NotFoundError } = require('../utils/custom-errors');

const errorHandler = (err, req, res, next) => {
    //Здесь идет обработка пользовательских исключений чтобы были осмысленные сообщения
    console.error('Произошла ошибка:', err);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Некорректный JSON: ' + err.message });
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({ error: 'Ошибка валидации: ' + err.message });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: 'Не найдено: ' + err.message });
    }

    res.status(500).json({ error: 'Произошла внутренняя ошибка сервера.', details: 'Ошибка: ' + err.message });
};

module.exports = errorHandler;