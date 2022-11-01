import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { FreeBoard } from '../freeboards/entities/freeBoard.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { Like } from './entities/like.entity';
import { LikesResolver } from './likes.resolver';
import { LikesService } from './likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Like, //
      User,
      CafeBoard,
      FreeBoard,
    ]),
  ],
  providers: [
    LikesResolver, //
    LikesService,
    UsersService,
  ],
})
export class LikesModule {}
