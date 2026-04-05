import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Produce } from './produce.entity';
import { ProduceService } from './produce.service';
import { CreateProduceDto } from './dto/create-produce.dto';
import { UpdateProduceDto } from './dto/update-produce.dto';
import { Roles, AppRole } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('produce')
export class ProduceController {
  constructor(private readonly produceService: ProduceService) {}

  @Public()
  @Get()
  findAll(): Promise<Produce[]> {
    return this.produceService.findAll();
  }

  @Public()
  @Get('totals/cooperatives')
  totalsByCooperative() {
    return this.produceService.getTotalsByCooperative();
  }

  @Public()
  @Post()
  create(@Body() body: CreateProduceDto, @Request() req): Promise<Produce> {
    // For now, just create without user validation
    return this.produceService.create(body);
  }

  @Roles(AppRole.ADMIN, AppRole.COOP_MANAGER)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateProduceDto,
    @Request() req,
  ): Promise<Produce> {
    return this.produceService.update(Number(id), body, req.user.sub);
  }

  @Roles(AppRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.produceService.softDelete(Number(id));
    return { deleted: true };
  }
}

