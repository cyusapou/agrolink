import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CooperativesModule } from './cooperatives/cooperatives.module';
import { FarmersModule } from './farmers/farmers.module';
import { ProduceModule } from './produce/produce.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ← loads .env automatically
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.getOrThrow<string>('DB_PORT'), 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: 'agrolinkdb', // Using your existing database
        autoLoadEntities: true,
        synchronize: true, // dev only
      }),
    }),
    CooperativesModule,
    FarmersModule,
    ProduceModule,
    PaymentsModule, // PaymentsModule handles MTN MoMo transactions
    AuthModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Removed global guards to fix dependency issues
  ],
})
export class AppModule {}