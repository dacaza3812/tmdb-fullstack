import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // GET /movies/popular?page=1
  @Get('popular')
  async popular(@Query('page', ParseIntPipe) page = 1) {
    return this.moviesService.getPopular(page);
  }

  // GET /movies/:id
  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.moviesService.getById(id);
  }
}
