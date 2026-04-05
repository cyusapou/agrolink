import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Produce } from './produce.entity';
import { ProduceService } from './produce.service';
import { CreateProduceDto } from './dto/create-produce.dto';
import { UpdateProduceDto } from './dto/update-produce.dto';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

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

  @Roles('admin')
  @Post()
  create(@Body() body: CreateProduceDto): Promise<Produce> {
    return this.produceService.create(body);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateProduceDto,
  ): Promise<Produce> {
    return this.produceService.update(Number(id), body);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.produceService.softDelete(Number(id));
    return { deleted: true };
  }
}

