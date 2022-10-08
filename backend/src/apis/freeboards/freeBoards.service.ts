import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../users/entites/user.entity';
import { FreeBoard } from './entities/freeBoard.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ImagesService } from '../images/image.service';

@Injectable()
export class FreeBoardsService {
  constructor(
    @InjectRepository(FreeBoard)
    private readonly freeBoardsRepository: Repository<FreeBoard>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly elasticsearchService: ElasticsearchService,
    private readonly imagesService: ImagesService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll({ page }: { page: number }): Promise<FreeBoard[]> {
    return await this.freeBoardsRepository.find({
      relations: ['tags', 'comment', 'images', 'user'],
      order: { createdAt: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardByUser({ userId }: { userId: string }): Promise<number> {
    const result = await this.freeBoardsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return result.length;
  }

  async findBoardByUserWithPage({
    userId,
    page,
  }: {
    userId: string;
    page: number;
  }): Promise<FreeBoard[]> {
    const result = await this.freeBoardsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
      take: 3,
      skip: page ? (page - 1) * 3 : 0,
    });
    return result;
  }

  async findBoardsCreatedAt({ page, sortBy }): Promise<FreeBoard[]> {
    return await this.freeBoardsRepository.find({
      relations: ['tags', 'comment', 'images', 'user', 'favoriteBoard'],
      order: { createdAt: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardsLikeCount({ page, sortBy }): Promise<FreeBoard[]> {
    return await this.freeBoardsRepository.find({
      relations: ['tags', 'comment', 'images', 'user', 'favoriteBoard'],
      order: { likeCount: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardOne({
    freeBoardId,
  }: {
    freeBoardId: string;
  }): Promise<FreeBoard> {
    const result = await this.freeBoardsRepository.findOne({
      where: { id: freeBoardId },
      relations: ['tags', 'comment', 'images', 'user', 'favoriteBoard'],
    });

    return result;
  }

  async create({ user, createBoardInput }) {
    const { tags, image, ...freeBoard } = createBoardInput;

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
      const result = await this.freeBoardsRepository.save({
        ...freeBoard,
        tags: boardtag,
        user: _user.id,
      });

      if (image) {
        await this.imagesService.createFreeBoardImage({ image, result });
      }
      return result;
    } else {
      const result = await this.freeBoardsRepository.save({
        ...freeBoard,
        user: _user,
      });
      if (image) {
        await this.imagesService.createFreeBoardImage({ image, result });
      }
      return result;
    }
  }

  /** 게시글 수정 */
  async update({ userEmail, freeBoardId, nickName, updateFreeBoardInput }) {
    const { image } = updateFreeBoardInput;

    const myfreeBoard = await this.freeBoardsRepository.findOne({
      where: { id: freeBoardId },
      relations: ['user'],
    });

    if (!myfreeBoard)
      throw new UnprocessableEntityException('등록된 게시글이 없습니다.');
    if (userEmail !== myfreeBoard.user.email)
      throw new ConflictException(`${nickName}님의 게시글이 아닙니다.`);

    const _image = await this.imagesRepository.find({
      where: { freeBoard: { id: freeBoardId } },
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
        (el) =>
          new Promise((resolve) => {
            this.imagesRepository.save({
              url: el,
              board: { id: myfreeBoard.id },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.freeBoardsRepository.save({
      ...myfreeBoard,
      ...updateFreeBoardInput,
    });
    return result;
  }

  async delete({ boardId }): Promise<boolean> {
    const deleteresult = await this.freeBoardsRepository.softDelete({
      id: boardId,
    });
    return deleteresult.affected ? true : false;
  }

  async WithBoardDelete(): Promise<FreeBoard[]> {
    return await this.freeBoardsRepository.find({
      relations: ['boardTag', 'favoritBoard', 'Comment'],
      withDeleted: true,
    });
  }

  async restore({ boardId }): Promise<boolean> {
    const restoreResult = await this.freeBoardsRepository.restore({
      id: boardId,
    });
    return restoreResult.affected ? true : false;
  }

  async search({ search_board }) {
    const checkRedis = await this.cacheManager.get(search_board);
    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'freeboard',
        size: 10000,
        body: {
          query: {
            multi_match: {
              query: search_board,
              fields: ['title', 'contents'],
            },
          },
        },
      });
      const arrayBoard = result.hits.hits.map((el) => {
        const obj = {
          id: el['_id'],
          title: el._source['title'],
          contents: el._source['contents'],
        };
        return obj;
      });

      await this.cacheManager.set(search_board, arrayBoard, { ttl: 1 });
      return arrayBoard;
    }
  }

  /** 게시글 내용 검색 */
  async searchUsersBoard({ search }) {
    const checkRedis = await this.cacheManager.get(search);

    if (checkRedis) {
      return checkRedis;
    } else {
      const result = await this.elasticsearchService.search({
        index: 'freeboard',
        body: {
          query: {
            multi_match: {
              query: search,
              fields: ['title', 'contents'],
            },
          },
        },
      });
      const arrayBoard = result.hits.hits.map((el) => {
        const obj = {
          id: el._source['id'],
          title: el._source['title'],
          contents: el._source['contents'],
        };
        return obj;
      });
      await this.cacheManager.set(search, arrayBoard, { ttl: 20 });

      return arrayBoard;
    }
  }
}
