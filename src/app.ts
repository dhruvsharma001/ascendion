import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { movieRouter } from './routes/movieRoutes';
import { logger } from './utils/logger';

import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './config/.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/movies', movieRouter);

// Error middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    logger.error(err.message);  // Log the error message
  } else {
    logger.error('An unknown error occurred');  // generic error
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
