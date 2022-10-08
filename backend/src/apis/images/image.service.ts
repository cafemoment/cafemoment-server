import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>, //
  ) {}
  async createFreeBoardImage({ image, result }) {
    return await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve, reject) => {
            this.imagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              freeBoard: { id: result.id },
            });
            resolve('이미지 저장 완료');
            reject('이미지 저장 실패');
          }),
      ),
    );
  }

  async createCafeBoardImage({ image, result }) {
    return await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve, reject) => {
            this.imagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              cafeBoard: { id: result.id },
            });
            resolve('이미지 저장 완료');
            reject('이미지 저장 실패');
          }),
      ),
    );
  }

  async updateFreeBoardImage({ image, freeBoard }) {
    await this.imagesRepository.delete({
      freeBoard: { id: freeBoard.id },
    });

    const result = await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve) => {
            const result = this.imagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              freeBoard: freeBoard,
            });
            resolve(result);
          }),
      ),
    );
    return result;
  }

  async updateCafeBoardImage({ image, cafeBoard }): Promise<string[]> {
    await this.imagesRepository.find({
      where: { cafeBoard: { id: cafeBoard.id } },
    });

    await this.imagesRepository.delete({
      cafeBoard: { id: cafeBoard.id },
    });

    const result = await Promise.all(
      image.map(
        (el, idx) =>
          new Promise((resolve) => {
            const result = this.imagesRepository.save({
              isMain: idx === 0 ? true : false,
              url: el,
              cafeBoard: cafeBoard,
            });
            resolve(result);
          }),
      ),
    );
    return result;
  }
}
