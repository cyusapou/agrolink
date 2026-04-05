import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Cooperative } from './cooperative.entity';
import { CooperativesService } from './cooperatives.service';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('cooperatives')
export class CooperativesController {
  constructor(private readonly cooperativesService: CooperativesService) {}

  @Public()
  @Get()
  findAll(): Promise<Cooperative[]> {
    return this.cooperativesService.findAll();
  }

  @Roles('admin')
  @Post()
  create(@Body() body: CreateCooperativeDto): Promise<Cooperative> {
    return this.cooperativesService.create(body);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCooperativeDto,
  ): Promise<Cooperative> {
    return this.cooperativesService.update(Number(id), body);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cooperativesService.softDelete(Number(id));
    return { deleted: true };
  }
}

