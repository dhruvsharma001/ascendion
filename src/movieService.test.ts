import axios from 'axios';
import { getMoviesByYear } from './services/movieService'; 

jest.mock('axios');

// mock response
const mockResponse = {
  data: {
    results: [
      { title: 'Movie 1', release_date: '2021-02-01', vote_average: 7.5 },
      {title: 'Movie 2', release_date: '2021-02-01', vote_average: 8.0 }
    ]
  },
  status: 200,
  statusText: 'OK',
  headers: {
    set: jest.fn(),
    get: jest.fn(),
    has: jest.fn(),
    delete: jest.fn()
  },
  config: {}
};

describe('Movie Service', () => {


  it('should return at least one movie for a given year', async () => {
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    // func call to fetch movies
    const movies = await getMoviesByYear('2021');
    expect(movies.length).toBeGreaterThan(0);  // at least one movie is retuned
    expect(movies[0].title).toBeTruthy();  // Check, first movie has a title
    expect(movies[0].release_date).toBeTruthy(); // Check has release_date
    expect(movies[0].vote_average).toBeTruthy(); // has vote_average
  });

  it('should handle errors when axios fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

    await expect(getMoviesByYear('2021')).rejects.toThrow('Failed to fetch movies');
  });

  it('should handle the case when the API returns no movies', async () => {
    // Mock an empty response
    const emptyResponse = {
      data: { results: [] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(emptyResponse);

    const movies = await getMoviesByYear('2021');
    
    // Check  no movies are returned
    expect(movies.length).toBe(0);
  });

  it('should handle invalid year input ', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Check error is thrown on invalid year
    await expect(getMoviesByYear('InvalidYear')).rejects.toThrow('Invalid year format');
  });

  afterAll(() => {
    jest.restoreAllMocks(); 
  });

});
