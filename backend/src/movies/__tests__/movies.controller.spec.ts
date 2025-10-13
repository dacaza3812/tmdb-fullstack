/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';

describe('MoviesController (unit)', () => {
  let controller: MoviesController;
  let service: Partial<Record<keyof MoviesService, jest.Mock>>;

  beforeEach(async () => {
    // Mock simple del MoviesService
    service = {
      getPopular: jest.fn(),
      getById: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: service }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('popular debe delegar en MoviesService con page numerico', async () => {
    (service.getPopular as jest.Mock).mockResolvedValue({ results: [] });
    const res = await controller.popular(2);
    expect(service.getPopular).toHaveBeenCalledWith(2);
    expect(res).toEqual({ results: [] });
  });

  it('detail debe delegar en MoviesService con id', async () => {
    const movie = { id: 5, title: 'X' };
    (service.getById as jest.Mock).mockResolvedValue(movie);
    const res = await controller.detail('5');
    expect(service.getById).toHaveBeenCalledWith('5');
    expect(res).toEqual(movie);
  });
});
