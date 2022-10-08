import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeBoard } from '../cafeBoards/entities/cafeBoard.entity';
import { User } from '../users/entites/user.entity';
import { UsersService } from '../users/users.service';
import { Review } from './entites/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(CafeBoard)
    private readonly cafeBoardsRepository: Repository<CafeBoard>,

    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Review[]> {
    return await this.reviewsRepository.find({
      relations: ['user', 'cafeList'],
    });
  }

  async findOne({ reviewId }: { reviewId: string }): Promise<Review> {
    return await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'cafeList'],
    });
  }

  async create({ createReviewInput }): Promise<Review> {
    const { userId, cafeBoardId, comment } = createReviewInput;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const cafeList = await this.cafeBoardsRepository.findOne({
      where: { id: cafeBoardId },
    });
    return await this.reviewsRepository.save({
      comment: comment,
      user: user,
      cafeList: cafeList,
    });
  }

  async delete({ context, reviewId }): Promise<boolean> {
    const email = context.req.user.email;
    const checkUser = await this.usersService.findOneUser({ email });
    if (checkUser.email !== email)
      throw new ConflictException('리뷰작성자만 접근이 가능합니다.');

    const result = await this.reviewsRepository.softDelete({
      id: reviewId,
    });
    return result.affected ? true : false;
  }

  async update({ context, updateReviewInput }): Promise<Review> {
    const email = context.req.user.email;
    const { comment, reviewId } = updateReviewInput;
    const checkUser = await this.usersService.findOneUser({ email });
    if (checkUser.email !== email)
      throw new ConflictException('리뷰작성자만 접근이 가능합니다.');

    const review = await this.findOne({ reviewId });
    if (!review) throw new NotFoundException('해당하는 리뷰가 없습니다');

    return await this.reviewsRepository.save({
      ...review,
      comment,
    });
  }
}
