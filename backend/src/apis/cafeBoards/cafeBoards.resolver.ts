import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { Repository } from 'typeorm';
import { CafeBoardsService } from './cafeBoards.service';
import { CreateCafeBoardInput } from './dto/createCafeBoard.input';
import { UpdateCafeBoardInput } from './dto/updateCafeBoard.input';
import { CafeBoard } from './entities/cafeBoard.entity';

/**
 * CafeBoard(카페 소개글) GrqphQL API Resolver
 * @APIs
 * 'searchCafeBoards'
 * 'fetchCafeBoardsNumber',
 * 'fetchCafeBoard',
 * 'fetchCafeBoards',
 * 'fetchCafeBoardsByCreatedAt',
 * 'fetchCafeBoardLike',
 * 'createCafeBoard',
 * 'updateCafeBoard',
 * 'deleteCafeBoard',
 * 'restoreCafeBoard'
 */
@Resolver()
export class CafeBoardsResolver {
  constructor(
    private readonly cafeBoardsService: CafeBoardsService,

    @InjectRepository(CafeBoard)
    private readonly cafeBoardsRepository: Repository<CafeBoard>,
  ) {}

  /** 카페 소개글 검색 */
  @Query(() => [CafeBoard])
  async searchCafeBoards(
    @Args({ name: 'search_cafeBoards', nullable: true })
    search_cafeBoards: string,
  ) {
    return this.cafeBoardsService.search({ search_cafeBoards });
  }

  /** 카페 소개글 개수 조회 */
  @Query(() => Int)
  async fetchCafeBoardsNumber() {
    const result = await this.cafeBoardsRepository.find({});
    return result.length;
  }

  /** 카페게시글 하나 조회 */
  @Query(() => CafeBoard)
  fetchCafeBoard(
    @Args('cafeBoardId') cafeBoardId: string, //
  ) {
    return this.cafeBoardsService.findOne({ cafeBoardId });
  }

  /** 카페 게시글 전체 조회 */
  @Query(() => [CafeBoard])
  async fetchCafeBoards(
    @Args('page', { defaultValue: 1 }) page: number, //
  ) {
    return this.cafeBoardsService.findAll({ page });
  }

  /** 카페 소개글 생성일 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [CafeBoard])
  fetchCafeBoardsByCreatedAt(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.cafeBoardsService.findByCreatedAt({
      page,
      sortBy,
    });
  }

  /** 카페 게시글 찜 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [CafeBoard])
  fetchCafeBoardLike(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.cafeBoardsService.findByCafeLikeCount({
      page,
      sortBy,
    });
  }

  /** 카페 소개글 생성 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeBoard)
  async createCafeBoard(
    @Context() context: IContext,
    @Args('createCafeBoardInput') createCafeBoardInput: CreateCafeBoardInput,
  ) {
    const user = context.req.user.email;
    return await this.cafeBoardsService.create({
      user,
      createCafeBoardInput,
    });
  }

  /** 카페 소개글 업데이트 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeBoard)
  async updateCafeBoard(
    @Args('cafeBoardId') cafeBoardId: string,
    @Args('nickName') nickName: string,
    @Args('updateCafeBoardInput') updateCafeBoardInput: UpdateCafeBoardInput,
    @Context() context: IContext,
  ) {
    const userEmail = context.req.user.email;
    const result = await this.cafeBoardsService.update({
      userEmail,
      cafeBoardId,
      nickName,
      updateCafeBoardInput,
    });
    return result;
  }

  /** 카페 소개글 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCafeBoard(
    @Args('cafeBoardId') cafeBoardId: string, //
    @Context() context: IContext,
  ) {
    return this.cafeBoardsService.delete({ context, cafeBoardId });
  }

  /** Admin */

  /** 카페 소개글 복구 */
  @Mutation(() => Boolean)
  restoreCafeBoard(
    @Args('cafeBoardId') cafeBoardId: string, //
  ) {
    return this.cafeBoardsService.restore({ cafeBoardId });
  }
}
