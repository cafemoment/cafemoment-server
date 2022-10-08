import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsResolver } from './tags.resolver';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tag, //
    ]),
  ],
  providers: [
    TagsResolver, //
    TagsService,
  ],
})
export class TagsModule {}
