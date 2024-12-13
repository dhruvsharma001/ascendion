import { Request, Response, NextFunction } from 'express';
import { getMoviesByYear } from '../services/movieService';
import { logger } from '../utils/logger';

export const getMoviesByYearHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const year = req.query.year as string;
  const page = parseInt(req.query.page as string) || 1;

  if (!year) {
    res.status(400).json({ error: 'Year is required' });
    return;
  }

  try {
    const movies = await getMoviesByYear(year, page);
    res.json(movies); 
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('Unknown error occurred');
    }
    next(error); // Pass the error to global error handler
  }
};
