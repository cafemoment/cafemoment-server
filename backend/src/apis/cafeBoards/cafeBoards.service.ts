import { CafeBoard } from './entities/cafeBoard.entity';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entites/user.entity';
import { Like } from '../likes/entities/like.entity';
import { ImagesService } from '../images/image.service';
import { Image } from '../images/entities/image.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class CafeBoardsService {
  constructor(
    @InjectRepository(CafeBoard)
    private readonly cafeBoardsRepository: Repository<CafeBoard>,

    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,

    private readonly imagesService: ImagesService,

    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,

    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne({ cafeBoardId }: { cafeBoardId: string }): Promise<CafeBoard> {
    const result = await this.cafeBoardsRepository.findOne({
      where: { id: cafeBoardId },
      relations: ['images', 'reviews', 'tags', 'user', 'cafeReservation'],
    });
    return result;
  }

  async findByCreatedAt({ page, sortBy }): Promise<CafeBoard[]> {
    return await this.cafeBoardsRepository.find({
      relations: ['images', 'reviews', 'tags', 'user', 'cafeReservation'],
      order: { createdAt: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findByCafeLikeCount({ page, sortBy }): Promise<CafeBoard[]> {
    return await this.cafeBoardsRepository.find({
      relations: ['images', 'reviews', 'tags', 'user', 'cafeReservation'],
      order: { CafeLikeCount: sortBy },
      take: 6,
      skip: page ? (page - 1) * 6 : 0,
    });
  }

  async findAll({ page }: { page: number }): Promise<CafeBoard[]> {
    const result = await this.cafeBoardsRepository.find({
      relations: ['images', 'reviews', 'tags', 'user', 'cafeReservation'],
      take: 10,
      skip: (page - 1) * 10,
    });
    return result;
  }

  async create({ user, createCafeBoardInput }): Promise<CafeBoard[]> {
    const { tags, image, ...cafeBoard } = createCafeBoardInput;
    const _user = await this.usersRepository.findOne({
      where: { email: user },
    });

    if (tags) {
      const boardtag = [];
      for (let i = 0; i < tags.length; i++) {
        const tagName = tags[i].replace('#', '');

        const prevTag = await this.tagsRepository.findOne({
          where: { name: tagName },
        });

        if (prevTag) {
          boardtag.push(prevTag);
        } else {
          const newTag = await this.tagsRepository.save({
            name: tagName,
          });
          boardtag.push(newTag);
        }
      }
      const result = await this.cafeBoardsRepository.save({
        ...createCafeBoardInput,
        tags: boardtag,
        user: _user.id,
      });
      if (image) {
        await this.imagesService.createCafeBoardImage({ image, result });
      }
      return result;
    } else {
      const result = await this.cafeBoardsRepository.save({
        ...cafeBoard,
        user: _user,
      });
      if (image) {
        await this.imagesService.createCafeBoardImage({ image, result });
      }
      return result;
    }
  }

  async update({
    userEmail,
    cafeBoardId,
    nickName,
    updateCafeBoardInput,
  }): Promise<CafeBoard[]> {
    const { image } = updateCafeBoardInput;

    const myCafeBoard = await this.cafeBoardsRepository.findOne({
      where: { id: cafeBoardId },
      relations: ['user'],
    });

    if (!myCafeBoard)
      throw new UnprocessableEntityException('등록된 카페가 없습니다.');
    if (userEmail !== myCafeBoard.user.email)
      throw new ConflictException(`${nickName}님의 카페가 아닙니다.`);

    const _image = await this.imagesRepository.find({
      where: { cafeBoard: { id: cafeBoardId } },
    });

    await Promise.all(
      _image.map(
        (el) =>
          new Promise((resolve) => {
            this.imagesRepository.softDelete({ id: el.id });
            resolve('이미지 삭제 완료');
          }),
      ),
    );

    await Promise.all(
      image.map(
        ({ el }: { el: string }) =>
          new Promise((resolve) => {
            this.imagesRepository.save({
              url: el,
              cafeBoard: { id: myCafeBoard.id },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.cafeBoardsRepository.save({
      ...myCafeBoard,
      ...updateCafeBoardInput,
    });
    return result;
  }

  async delete({ context, cafeBoardId }): Promise<boolean> {
    const userEmail = context.req.user.email;
    const cafeBoard = await this.cafeBoardsRepository.findOne({
      where: { id: cafeBoardId },
      relations: ['user'],
    });
    if (cafeBoard.user.email !== userEmail)
      throw new ConflictException('게시물의 작성자만 삭제할 수 있습니다.');

    const result = await this.cafeBoardsRepository.softDelete({
      id: cafeBoardId,
    });
    this.imagesRepository.delete({ cafeBoard: { id: cafeBoard.id } });
    this.likesRepository.delete({ cafeBoard: { id: cafeBoard.id } });
    return result.affected ? true : false;
  }

  async restore({ cafeBoardId }): Promise<boolean> {
    const restoreResult = await this.cafeBoardsRepository.restore({
      id: cafeBoardId,
    });
    return restoreResult.affected ? true : false;
  }

  async search({ search_cafeBoards }) {
    const checkRedis = await this.cacheManager.get(search_cafeBoards);
    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'cafeboard',
        body: {
          query: {
            multi_match: {
              query: search_cafeBoards,
              fields: ['title', 'contents', 'address'],
            },
          },
        },
      });
      const arrayCafeList = result.hits.hits.map((el) => {
        const obj = {
          id: el['_id'],
          title: el._source['title'],
          contents: el._source['contents'],
          address: el._source['address'],
        };
        return obj;
      });
      await this.cacheManager.set(search_cafeBoards, arrayCafeList, { ttl: 5 });
      return arrayCafeList;
    }
  }
}
