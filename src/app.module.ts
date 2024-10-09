import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { roles } from './app.roles';
import { AccessControlModule, ACGuard } from 'nest-access-control';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { PasswordInterceptor } from './interceptors/password-interceptor.interceptor';
import { CartModule } from './modules/cart/cart.module';
import { LikesModule } from './modules/likes/likes.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    AccessControlModule.forRoles(roles),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    LikesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ACGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PasswordInterceptor,
    },
  ],
})
export class AppModule {}
