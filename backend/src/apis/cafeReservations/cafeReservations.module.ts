import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { CafeReservationsResolver } from './cafeReservations.resolver';
import { CafeReservationsService } from './cafeReservations.service';
import { CafeReservation } from './entities/cafeReservations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeReservation, //
      User,
      CafeBoard,
    ]),
  ],
  providers: [
    CafeReservationsResolver, //
    CafeReservationsService,
    UsersService,
  ],
})
export class CafeReservationsMoudule {}
