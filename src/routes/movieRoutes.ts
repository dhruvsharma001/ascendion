import { Router } from 'express';
import { getMoviesByYearHandler } from '../controllers/movieController';

export const movieRouter = Router();

movieRouter.get('/', getMoviesByYearHandler);
