import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CooperativesService } from './cooperatives.service';
import { Cooperative } from './cooperative.entity';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { Roles, AppRole } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('cooperatives')
export class CooperativesController {
  constructor(private readonly cooperativesService: CooperativesService) {}

  @Public()
  @Get()
  findAll(): Promise<Cooperative[]> {
    return this.cooperativesService.findAll();
  }

  @Roles(AppRole.ADMIN)
  @Post()
  create(@Body() body: CreateCooperativeDto): Promise<Cooperative> {
    return this.cooperativesService.create(body);
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCooperativeDto,
  ): Promise<Cooperative> {
    return this.cooperativesService.update(Number(id), body);
  }

  @Roles(AppRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cooperativesService.softDelete(Number(id));
    return { deleted: true };
  }
}

