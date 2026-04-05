import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Farmer } from './farmer.entity';
import { FarmersService } from './farmers.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Public()
  @Get()
  findAll(): Promise<Farmer[]> {
    return this.farmersService.findAll();
  }

  @Roles('admin')
  @Post()
  create(@Body() body: CreateFarmerDto): Promise<Farmer> {
    return this.farmersService.create(body);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateFarmerDto): Promise<Farmer> {
    return this.farmersService.update(Number(id), body);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.farmersService.softDelete(Number(id));
    return { deleted: true };
  }
}

