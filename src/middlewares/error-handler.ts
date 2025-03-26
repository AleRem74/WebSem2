import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { ValidationError, NotFoundError } from '../utils/custom-errors';

const errorHandler: ErrorRequestHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction // Добавляем параметр next
): void => { // возвращаемый тип void
  console.error('Произошла ошибка:', err);

  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Некорректный JSON: ' + err.message });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({ error: 'Ошибка валидации: ' + err.message });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: 'Не найдено: ' + err.message });
    return;
  }

  res.status(500).json({ 
    error: 'Произошла внутренняя ошибка сервера.', 
    details: 'Ошибка: ' + err.message 
  });
};


export default errorHandler;
