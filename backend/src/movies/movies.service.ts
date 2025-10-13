import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { createTmdbClient } from '../tmdb.client';
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';


type TMDBMovie = { id: number; title?: string; [k: string]: unknown };
type TMDBListResponse = {
  results: TMDBMovie[];
  page?: number;
  total_pages?: number;
  total_results?: number;
};

@Injectable()
export class MoviesService {
  private tmdb: AxiosInstance;
  private popularTTLSeconds = 300;
  private detailTTLSeconds = 3600; 

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    if (!apiKey) throw new Error('TMDB_API_KEY no definido');
    this.tmdb = createTmdbClient(apiKey);
  }

  private logCache(action: 'HIT' | 'MISS', key: string) {
    console.debug(`[Cache] ${action} - ${key}`);
  }

  async getPopular(page = 1): Promise<TMDBListResponse> {
    const key = `popular:page:${page}`;
    try {
      const cached = await this.cacheManager.get<TMDBListResponse>(key);
      if (cached) {
        this.logCache('HIT', key);
        return cached;
      }
      this.logCache('MISS', key);

      const response: AxiosResponse<TMDBListResponse> = await this.tmdb.get(
        '/movie/popular',
        {
          params: { page },
        },
      );
      const data = response.data;
      if (!data || !data.results) {
        throw new HttpException(
          'Respuesta inválida desde TMDB',
          HttpStatus.BAD_GATEWAY,
        );
      }

      await this.cacheManager.set(key, data, this.popularTTLSeconds);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status || HttpStatus.BAD_GATEWAY;
        throw new HttpException('Error al contactar TMDB', status);
      }
      throw err;
    }
  }

  async getById(id: string): Promise<TMDBMovie> {
    const key = `movie:${id}`;
    try {
      const cached = await this.cacheManager.get<TMDBMovie>(key);
      if (cached) {
        this.logCache('HIT', key);
        return cached;
      }
      this.logCache('MISS', key);

      const response: AxiosResponse<TMDBMovie> = await this.tmdb.get(
        `/movie/${id}`,
      );
      const data = response.data;
      if (!data || !data.id) {
        throw new HttpException(
          'Respuesta inválida desde TMDB',
          HttpStatus.BAD_GATEWAY,
        );
      }

      await this.cacheManager.set(key, data, this.detailTTLSeconds);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw new HttpException('Película no encontrada', HttpStatus.NOT_FOUND);
      }
      if (axios.isAxiosError(err)) {
        throw new HttpException(
          'Error al contactar TMDB',
          HttpStatus.BAD_GATEWAY,
        );
      }
      throw err;
    }
  }
}
