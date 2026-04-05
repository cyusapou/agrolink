import { Controller, Get, Post, Body, Param, Patch, Delete, Request, UseGuards } from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { Farmer } from './farmer.entity';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Roles, AppRole } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Public()
  @Get()
  findAll(): Promise<Farmer[]> {
    return this.farmersService.findAll();
  }

  @Public()
  @Post()
  create(@Body() body: CreateFarmerDto, @Request() req): Promise<Farmer> {
    // For now, just create without user validation
    return this.farmersService.create(body);
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateFarmerDto): Promise<Farmer> {
    return this.farmersService.update(Number(id), body);
  }

  @Roles(AppRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.farmersService.softDelete(Number(id));
    return { deleted: true };
  }
}

