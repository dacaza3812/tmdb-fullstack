import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus } from '@nestjs/common';

jest.mock('../../tmdb.client', () => ({
  createTmdbClient: jest.fn(),
}));

// Mock parcial de axios: definir isAxiosError como jest.fn para controlarlo
jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
}));

import { createTmdbClient } from '../../tmdb.client';
import axios from 'axios';

describe('MoviesService (unit)', () => {
  let service: MoviesService;
  let mockCache: { get: jest.Mock; set: jest.Mock; del: jest.Mock };
  let mockConfigService: Partial<ConfigService>;
  const fakeTmdbGet = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'TMDB_API_KEY') return 'fake-key';
        return undefined;
      }),
    };

    // createTmdbClient devuelve un objeto con .get => fakeTmdbGet
    (createTmdbClient as jest.Mock).mockReturnValue({ get: fakeTmdbGet });

    // Asegurarnos de que axios.isAxiosError sea un mock y tenga implementación por defecto
    const mockedAxios = axios as unknown as { isAxiosError: jest.Mock };
    mockedAxios.isAxiosError.mockImplementation((x: unknown) =>
      Boolean(x && (x as Record<string, unknown>).isAxiosError),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('getPopular - cache hit devuelve cached y no llama a TMDB', async () => {
    const cached = {
      results: [{ id: 1, title: 'Cached' }],
      page: 1,
      total_pages: 1,
      total_results: 1,
    };
    mockCache.get.mockResolvedValue(cached);

    const res = await service.getPopular(1);
    expect(res).toBe(cached);
    expect(mockCache.get).toHaveBeenCalledWith('popular:page:1');
    expect(fakeTmdbGet).not.toHaveBeenCalled();
  });

  it('getPopular - cache miss llama a TMDB y hace set con TTL (3000)', async () => {
    mockCache.get.mockResolvedValue(null);
    const fakeData = {
      results: [{ id: 2, title: 'From TMDB' }],
      page: 1,
      total_pages: 1,
      total_results: 1,
    };
    fakeTmdbGet.mockResolvedValue({ data: fakeData });

    const res = await service.getPopular(1);
    expect(res).toEqual(fakeData);
    expect(mockCache.get).toHaveBeenCalledWith('popular:page:1');
    expect(mockCache.set).toHaveBeenCalledWith(
      'popular:page:1',
      fakeData,
      3000,
    );
    expect(fakeTmdbGet).toHaveBeenCalledWith('/movie/popular', {
      params: { page: 1 },
    });
  });

  it('getById - cache hit devuelve cached y no llama a TMDB', async () => {
    const cached = { id: 7, title: 'Cached Movie' };
    mockCache.get.mockResolvedValue(cached);

    const res = await service.getById('7');
    expect(res).toBe(cached);
    expect(mockCache.get).toHaveBeenCalledWith('movie:7');
    expect(fakeTmdbGet).not.toHaveBeenCalled();
  });

  it('getById - cache miss llama a TMDB y hace set con TTL (3600)', async () => {
    mockCache.get.mockResolvedValue(null);
    const fake = { id: 42, title: 'Answer' };
    fakeTmdbGet.mockResolvedValue({ data: fake });

    const res = await service.getById('42');
    expect(res).toEqual(fake);
    expect(mockCache.set).toHaveBeenCalledWith('movie:42', fake, 3600);
    expect(fakeTmdbGet).toHaveBeenCalledWith('/movie/42');
  });

  it('getById - si TMDB responde 404 debe lanzar HttpException 404', async () => {
    mockCache.get.mockResolvedValue(null);
    // Creamos un "error axios-like"
    // Creamos un error typed como axios-like
    const err = new Error('Not found') as unknown as {
      isAxiosError: true;
      response: { status: number };
    };
    err.isAxiosError = true as const;
    err.response = { status: 404 };

    // Asegurarnos de que axios.isAxiosError devuelva true
    (
      axios as unknown as { isAxiosError: jest.Mock }
    ).isAxiosError.mockReturnValue(true);

    fakeTmdbGet.mockRejectedValue(err as unknown);

    await expect(service.getById('99999')).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
    });
  });

  it('getPopular - si TMDB falla y no hay cache lanza 502', async () => {
    mockCache.get.mockResolvedValue(null);
    const err = new Error('Network') as unknown as { isAxiosError: true };
    err.isAxiosError = true as const;
    // No response: simula fallo de red
    (
      axios as unknown as { isAxiosError: jest.Mock }
    ).isAxiosError.mockReturnValue(true);
    fakeTmdbGet.mockRejectedValue(err as unknown);

    await expect(service.getPopular(1)).rejects.toMatchObject({
      status: HttpStatus.BAD_GATEWAY,
    });
  });

  it('getById - si TMDB falla (no 404) lanza 502', async () => {
    mockCache.get.mockResolvedValue(null);
    const err = new Error('Network') as unknown as { isAxiosError: true };
    err.isAxiosError = true as const;
    (
      axios as unknown as { isAxiosError: jest.Mock }
    ).isAxiosError.mockReturnValue(true);
    fakeTmdbGet.mockRejectedValue(err as unknown);

    await expect(service.getById('1')).rejects.toMatchObject({
      status: HttpStatus.BAD_GATEWAY,
    });
  });
});
