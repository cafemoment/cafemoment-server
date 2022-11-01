import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminResolver } from './admins.resolver';
import { AdminService } from './admins.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [
    AdminResolver, //
    AdminService,
  ],
})
export class AdminModule {}
