import axios from 'axios';
import { logger } from '../utils/logger';
import { Movie } from '../types/movie';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

const MOVIE_DB_API_KEY = process.env.MOVIE_DB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIE_DISCOVER_URL = `${BASE_URL}/discover/movie`;
const MOVIE_CREDITS_URL = `${BASE_URL}/movie`;

// Fetch movie editors by movie ID
export const getEditors = async (movieId: number): Promise<string[]> => {
  try {
    const response = await axios.get(`${MOVIE_CREDITS_URL}/${movieId}/credits`, {
      params: {
        language: 'en-US'
      },
      headers: {
        Authorization: `Bearer ${MOVIE_DB_API_KEY}`
      }
    });

    
    // Check if the 'crew' data exists before calling 'filter'
    const editors = response.data?.crew?.filter((crewMember: any) => crewMember.known_for_department === 'Editing') || [];
    return editors.map((editor: any) => editor.name);

  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error fetching credits for movie ID ${movieId}: ${error.message}`);
    } else {
      logger.error(`Unknown error fetching credits for movie ID ${movieId}`);
    }
    throw new Error('Failed to fetch credits for movie ID');
  }
};

// Fetch movies for a given year
export const getMoviesByYear = async (year: string, page: number = 1): Promise<Movie[]> => {
  const yearRegex = /^\d{4}$/;
  if (!yearRegex.test(year)) {
    throw new Error('Invalid year format');
  }
  try {

    const response = await axios.get(MOVIE_DISCOVER_URL, {
      params: {
        language: 'en-US',
        page,
        primary_release_year: year,
        sort_by: 'popularity.desc'
      },
      headers: {
        Authorization: `Bearer ${MOVIE_DB_API_KEY}`  // Add Bearer Token in the headers
      }
    });
  
    const moviePromises = response.data.results.map(async (movie: any) => {
      const editors = await getEditors(movie.id);
      return {
        title: movie.title,
        release_date: new Date(movie.release_date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        vote_average: movie.vote_average,
        editors
      };
    });

    return Promise.all(moviePromises);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error fetching movies for year ${year}: ${error.message}`);
    } else {
      logger.error(`Unknown error fetching movies for year ${year}`);
    }
    throw new Error('Failed to fetch movies');
  }
};
