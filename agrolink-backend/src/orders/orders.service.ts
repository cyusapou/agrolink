import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, ConfirmOrderDto, DispatchOrderDto } from './dto/update-order.dto';
import { User } from '../users/entities/user.entity';
import { Produce } from '../produce/produce.entity';
import { Payment } from '../payments/payment.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Produce)
    private produceRepository: Repository<Produce>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private paymentsService: PaymentsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, buyerId: number): Promise<Order> {
    // Get the produce item
    const produce = await this.produceRepository.findOne({
      where: { id: createOrderDto.produceId, isActive: true },
      relations: ['farmer', 'cooperative'],
    });

    if (!produce) {
      throw new NotFoundException('Produce item not found');
    }

    // Check if there's enough stock
    if (produce.quantity < createOrderDto.quantityKg) {
      throw new BadRequestException(`Insufficient stock. Available: ${produce.quantity}kg, Requested: ${createOrderDto.quantityKg}kg`);
    }

    // Get buyer
    const buyer = await this.userRepository.findOne({ where: { id: buyerId } });
    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }

    // Calculate amounts
    const unitPrice = produce.price;
    const totalAmount = createOrderDto.quantityKg * unitPrice;
    const platformFee = totalAmount * 0.03; // 3% platform fee

    // Create order
    const order = this.orderRepository.create({
      buyer,
      produce,
      cooperative: produce.farmer.cooperative,
      quantityKg: createOrderDto.quantityKg,
      unitPrice,
      totalAmount,
      platformFee,
      deliveryAddress: createOrderDto.deliveryAddress,
      expectedDeliveryDate: createOrderDto.expectedDeliveryDate,
      status: OrderStatus.PENDING_PAYMENT,
    });

    // Save order
    const savedOrder = await this.orderRepository.save(order);

    // Update produce quantity (reduce stock)
    produce.quantity -= createOrderDto.quantityKg;
    await this.produceRepository.save(produce);

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['buyer', 'produce', 'cooperative', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByBuyer(buyerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { buyer: { id: buyerId } },
      relations: ['buyer', 'produce', 'cooperative', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCooperative(cooperativeId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { cooperative: { id: cooperativeId } },
      relations: ['buyer', 'produce', 'cooperative', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['buyer', 'produce', 'cooperative', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async confirmOrder(id: number, confirmDto: ConfirmOrderDto, userId: number): Promise<Order> {
    const order = await this.findOne(id);

    // Check if user is the cooperative manager
    if (order.cooperative.id !== userId) {
      throw new ForbiddenException('Only cooperative manager can confirm orders');
    }

    // Check if order is in correct status
    if (order.status !== OrderStatus.PAYMENT_HELD) {
      throw new BadRequestException('Order must be in PAYMENT_HELD status to confirm');
    }

    order.status = OrderStatus.CONFIRMED;
    return this.orderRepository.save(order);
  }

  async dispatchOrder(id: number, dispatchDto: DispatchOrderDto, userId: number): Promise<Order> {
    const order = await this.findOne(id);

    // Check if user is the cooperative manager
    if (order.cooperative.id !== userId) {
      throw new ForbiddenException('Only cooperative manager can dispatch orders');
    }

    // Check if order is in correct status
    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order must be in CONFIRMED status to dispatch');
    }

    order.status = OrderStatus.IN_TRANSIT;
    return this.orderRepository.save(order);
  }

  async receiveOrder(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id);

    // Check if user is the buyer
    if (order.buyer.id !== userId) {
      throw new ForbiddenException('Only buyer can confirm order receipt');
    }

    // Check if order is in correct status
    if (order.status !== OrderStatus.IN_TRANSIT) {
      throw new BadRequestException('Order must be in IN_TRANSIT status to receive');
    }

    order.status = OrderStatus.DELIVERED;
    const savedOrder = await this.orderRepository.save(order);

    // TODO: Trigger escrow release to cooperative
    // This would integrate with the payment system to release funds

    return savedOrder;
  }

  async completeOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);

    // Check if order is delivered
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Order must be DELIVERED to complete');
    }

    order.status = OrderStatus.COMPLETED;
    return this.orderRepository.save(order);
  }

  async cancelOrder(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id);

    // Only buyer or cooperative manager can cancel
    if (order.buyer.id !== userId && order.cooperative.id !== userId) {
      throw new ForbiddenException('Only buyer or cooperative manager can cancel orders');
    }

    // Check if order can be cancelled
    if (![
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PAYMENT_HELD,
      OrderStatus.CONFIRMED,
    ].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled in current status');
    }

    order.status = OrderStatus.CANCELLED;
    const savedOrder = await this.orderRepository.save(order);

    // Restore stock to produce
    if (order.produce) {
      order.produce.quantity += order.quantityKg;
      await this.produceRepository.save(order.produce);
    }

    return savedOrder;
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = updateOrderStatusDto.status;
    return this.orderRepository.save(order);
  }

  // Link payment to order
  async linkPayment(orderId: number, payment: Payment): Promise<Order> {
    const order = await this.findOne(orderId);
    order.payment = payment;
    
    if (payment.status === 'confirmed') {
      order.status = OrderStatus.PAYMENT_HELD;
    }
    
    return this.orderRepository.save(order);
  }
}
