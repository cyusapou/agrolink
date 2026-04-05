import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, ConfirmOrderDto, DispatchOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, AppRole } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(AppRole.BUYER)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.sub);
  }

  @Get()
  @Roles(AppRole.ADMIN)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my')
  @Roles(AppRole.BUYER)
  findMyOrders(@Request() req) {
    return this.ordersService.findByBuyer(req.user.sub);
  }

  @Get('cooperative')
  @Roles(AppRole.COOP_MANAGER)
  findCooperativeOrders(@Request() req) {
    return this.ordersService.findByCooperative(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id/confirm')
  @Roles(AppRole.COOP_MANAGER)
  confirmOrder(
    @Param('id') id: string,
    @Body() confirmDto: ConfirmOrderDto,
    @Request() req,
  ) {
    return this.ordersService.confirmOrder(+id, confirmDto, req.user.sub);
  }

  @Patch(':id/dispatch')
  @Roles(AppRole.COOP_MANAGER)
  dispatchOrder(
    @Param('id') id: string,
    @Body() dispatchDto: DispatchOrderDto,
    @Request() req,
  ) {
    return this.ordersService.dispatchOrder(+id, dispatchDto, req.user.sub);
  }

  @Patch(':id/received')
  @Roles(AppRole.BUYER)
  receiveOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.receiveOrder(+id, req.user.sub);
  }

  @Patch(':id/complete')
  @Roles(AppRole.ADMIN)
  completeOrder(@Param('id') id: string) {
    return this.ordersService.completeOrder(+id);
  }

  @Patch(':id/cancel')
  @Roles(AppRole.BUYER, AppRole.COOP_MANAGER)
  cancelOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.cancelOrder(+id, req.user.sub);
  }

  @Patch(':id/status')
  @Roles(AppRole.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(+id, updateOrderStatusDto);
  }
}
