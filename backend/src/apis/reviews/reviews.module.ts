import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { Review } from './entites/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      User,
      CafeBoard,
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
    UsersService,
  ],
})
export class ReviewsModule {}
