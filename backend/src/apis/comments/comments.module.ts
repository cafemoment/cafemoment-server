import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeBoardsService } from '../freeboards/freeBoards.service';
import { FreeBoard } from '../freeboards/entities/freeBoard.entity';
import { Image } from '../images/entities/image.entity';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { Comment } from './entites/comment.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ImagesService } from '../images/image.service';
import { Like } from '../likes/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment, //
      FreeBoard,
      User,
      Tag,
      Image,
      Like,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    CommentsResolver, //
    CommentsService,
    UsersService,
    FreeBoardsService,
    TagsService,
    ImagesService,
  ],
})
export class CommentsModule {}
