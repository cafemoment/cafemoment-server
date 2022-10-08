import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImagesResolver } from './image.resolver';
import { ImagesService } from './image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Image, //
    ]),
  ],
  providers: [
    ImagesResolver, //
    ImagesService,
  ],
})
export class ImageModule {}
