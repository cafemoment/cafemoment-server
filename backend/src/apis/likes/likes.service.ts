import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { FreeBoard } from '../freeboards/entities/freeBoard.entity';
import { User } from '../users/entites/user.entity';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,

    @InjectRepository(CafeBoard)
    private readonly cafeBoardsRepository: Repository<CafeBoard>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(FreeBoard)
    private readonly freeBoardsRepository: Repository<FreeBoard>,

    private readonly dataSource: DataSource,
  ) {}

  async cafeBoardlike({ userId, cafeBoardId }): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      const cafeBoard = await queryRunner.manager.findOne(CafeBoard, {
        where: { id: cafeBoardId },
      });

      if (!cafeBoard) throw new NotFoundException('존재하지 않는 카페입니다');

      const cafeLike = await this.likesRepository
        .createQueryBuilder('cafeLike')
        .leftJoin('cafeLike.user', 'user')
        .leftJoin('cafeLike.cafeBoard', 'cafeBoard')
        .where({ user })
        .andWhere({ cafeBoard })
        .getOne();

      let updateLike: Like;
      let updateCafeList: CafeBoard;
      let likeStatus: boolean = null;

      if (!cafeLike?.isLike || !cafeLike) {
        updateLike = this.likesRepository.create({
          ...cafeLike,
          user,
          cafeBoard,
          isLike: true,
        });

        updateCafeList = this.cafeBoardsRepository.create({
          ...cafeBoard,
          CafeLikeCount: cafeBoard.CafeLikeCount + 1,
        });

        likeStatus = true;
      } else if (cafeLike?.isLike) {
        updateLike = this.likesRepository.create({
          ...cafeLike,
          user,
          cafeBoard,
          isLike: false,
        });

        updateCafeList = this.cafeBoardsRepository.create({
          ...cafeBoard,
          CafeLikeCount: cafeBoard.CafeLikeCount - 1,
        });

        likeStatus = false;
        await this.likesRepository.delete({
          cafeBoard: cafeBoardId,
          user: userId,
        });
      }

      if (likeStatus === null)
        throw new NotAcceptableException('좋아요 토글에 실패했습니다');

      await queryRunner.manager.save(updateLike);
      await queryRunner.manager.save(updateCafeList);
      await queryRunner.commitTransaction();

      return likeStatus;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async freeBoardlike({ userId, freeBoardId }): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      const freeBoard = await queryRunner.manager.findOne(FreeBoard, {
        where: { id: freeBoardId },
      });

      if (!freeBoard) throw new NotFoundException('존재하지 않는 게시글입니다');

      const boardLike = await this.likesRepository
        .createQueryBuilder('boardLike')
        .leftJoin('boardLike.user', 'user')
        .leftJoin('boardLike.freeBoard', 'freeBoard')
        .where({ user })
        .andWhere({ freeBoard })
        .getOne();

      let updateLike: Like;
      let updateBoard: FreeBoard;
      let likeStatus: boolean = null;

      if (!boardLike?.isLike || !boardLike) {
        updateLike = this.likesRepository.create({
          ...boardLike,
          user,
          freeBoard,
          isLike: true,
        });

        updateBoard = this.freeBoardsRepository.create({
          ...freeBoard,
          likeCount: freeBoard.likeCount + 1,
        });

        likeStatus = true;
      } else if (boardLike?.isLike) {
        updateLike = this.likesRepository.create({
          ...boardLike,
          user,
          freeBoard,
          isLike: false,
        });

        updateBoard = this.freeBoardsRepository.create({
          ...freeBoard,
          likeCount: freeBoard.likeCount - 1,
        });

        likeStatus = false;
        await this.likesRepository.delete({
          freeBoard: freeBoardId,
          user: userId,
        });
      }

      if (likeStatus === null)
        throw new NotAcceptableException('좋아요 토글에 실패했습니다');

      await queryRunner.manager.save(updateLike);
      await queryRunner.manager.save(updateBoard);
      await queryRunner.commitTransaction();

      return likeStatus;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findLike({ boardId }) {
    const board = await this.cafeBoardsRepository.find({
      where: { id: boardId },
    });
    return board[0];
  }

  async findByUserId({ userId }): Promise<number> {
    const result = await this.likesRepository.find({
      where: { user: { id: userId } },
    });
    return result.length;
  }

  async findCafeBoardAll({ cafeBoardId }): Promise<Like[]> {
    return await this.likesRepository.find({
      where: { cafeBoard: { id: cafeBoardId } },
      relations: ['cafeBoard', 'user'],
    });
  }

  async findFreeBoardAll({ freeBoardId }) {
    const result = await this.likesRepository.find({
      where: { freeBoard: { id: freeBoardId } },
      relations: ['freeBoard', 'user'],
    });
    return result;
  }

  async findUserLike({ userId, page }): Promise<Like[]> {
    return await this.likesRepository.find({
      where: { user: { id: userId } },
      relations: ['cafeBoard', 'user', 'cafeBoard.cafeListImage'],
      take: 6,
      skip: page ? (page - 1) * 6 : 0,
    });
  }
}
