import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { CustomerModule } from './customers/customer.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, CustomerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
