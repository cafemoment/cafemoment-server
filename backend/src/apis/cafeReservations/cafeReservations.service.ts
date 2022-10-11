import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { UsersService } from '../users/users.service';
import { CafeReservation } from './entities/cafeReservations.entity';

@Injectable()
export class CafeReservationsService {
  constructor(
    @InjectRepository(CafeReservation)
    private readonly cafeReservationsRepository: Repository<CafeReservation>,

    @InjectRepository(CafeBoard)
    private readonly cafeBoardsRepository: Repository<CafeBoard>,

    private readonly usersService: UsersService, //
  ) {}

  async find({ cafeReservationId }): Promise<CafeReservation> {
    return await this.cafeReservationsRepository.findOne({
      where: { id: cafeReservationId },
      relations: ['cafeList', 'user'],
    });
  }

  async findbyUser({ userId }): Promise<number> {
    const result = await this.cafeReservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['cafeList', 'user'],
    });
    return result.length;
  }

  async findUser({
    page,
    userId,
  }: {
    page: number;
    userId: string;
  }): Promise<CafeReservation[]> {
    return await this.cafeReservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['cafeList', 'user', 'cafeList.cafeListImage'],
      take: 2,
      skip: page ? (page - 1) * 2 : 0,
    });
  }

  async create({
    createReservationInput,
    context,
  }): Promise<CafeReservation[]> {
    const { cafeBoardId } = createReservationInput;
    const userId = context.req.user.id;

    const cafeBoard = await this.cafeBoardsRepository.findOne({
      where: { id: cafeBoardId },
    });

    if (!cafeBoard) {
      throw new NotFoundException('카페 게시글을 찾을 수 없습니다.');
    }

    const result = await this.cafeReservationsRepository.save({
      ...createReservationInput,
      title: cafeBoard.title,
      deposit: cafeBoard.deposit,
      user: userId,
      cafeBoard: cafeBoardId,
    });
    return result;
  }

  async cancel({ cafeReservationId, context }): Promise<boolean> {
    const userEmail = context.req.user.email;
    const cafeReservation = await this.cafeReservationsRepository.findOne({
      where: { id: cafeReservationId },
      relations: ['user'],
    });
    if (cafeReservation.user.email !== userEmail)
      throw new NotFoundException('예약 내역이 존재하지 않습니다.');

    const result = await this.cafeReservationsRepository.softDelete({
      id: cafeReservationId,
    });
    return result.affected ? true : false;
  }
}
