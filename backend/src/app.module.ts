import { Module } from '@nestjs/common';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // CacheModule register -> por defecto memoria
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService): CacheModuleOptions => {
        const useRedis = config.get('USE_REDIS') === 'true';
        if (!useRedis) {
          return {
            ttl: 60, 
            max: 100,
          };
        }
        return {
          store: redisStore as unknown as CacheModuleOptions['store'],
          host: config.get('REDIS_HOST') || 'localhost',
          port: parseInt(config.get('REDIS_PORT') || '6379', 10),
          ttl: 60,
        } as CacheModuleOptions;
      },
      inject: [ConfigService],
    }),
    MoviesModule,
  ],
})
export class AppModule {}
