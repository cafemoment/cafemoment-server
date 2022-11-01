import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { FreeBoardsService } from './freeBoards.service';
import { CreateFreeBoardInput } from './dto/createFreeBoard.input';
import { UpdateFreeBoardInput } from './dto/updateFreeBoard.input';
import { FreeBoard } from './entities/freeBoard.entity';
import { IContext } from 'src/commons/type/context';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * FreeBoard GraphQL API Resolver
 * @APIs
 * 'searchFreeBoards',
 * 'fetchFreeBoardsNumber',
 * 'fetchFreeBoard'
 * 'fetchFreeBoards',
 * 'fetchFreeBoardsCreatedAt',
 * `fetchFreeBoardsLikeCount`,
 * `searchMyFreeBoards`,
 * 'createFreeBoard',
 * 'updateFreeBoard',
 * 'deleteFreeBoard',
 * 'restoreFreeBoard'
 * 'fetchUserFreeBoardNumber'
 * 'fetchMyFreeBoard'
 * 'fetchFreeBoardWithDeleted',
 */
@Resolver()
export class FreeBoardsresolver {
  constructor(
    private readonly freeBoardsService: FreeBoardsService, //

    @InjectRepository(FreeBoard)
    private readonly freeboardsRepository: Repository<FreeBoard>,
  ) {}

  /** 게시글을 검색어로 조회 */
  @Query(() => [FreeBoard])
  async searchFreeBoards(
    @Args({ name: 'search_board', nullable: true }) search_board: string, //
  ) {
    return this.freeBoardsService.search({ search_board });
  }

  /** 게시글 개수 조회 */
  @Query(() => Int)
  async fetchFreeBoardsNumber() {
    const result = await this.freeboardsRepository.find({});
    return result.length;
  }

  /** 게시글 하나 조회 */
  @Query(() => FreeBoard)
  fetchFreeBoard(
    @Args('freeBoardId') freeBoardId: string, //
  ) {
    return this.freeBoardsService.findBoardOne({ freeBoardId });
  }

  /** 게시글 전체 내림차순 조회 */
  @Query(() => [FreeBoard])
  fetchFreeBoards(
    @Args('page', { defaultValue: 1 }) page: number, //
  ) {
    return this.freeBoardsService.findAll({ page });
  }

  /** 게시글 생성일 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [FreeBoard])
  fetchFreeBoardsCreatedAt(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.freeBoardsService.findBoardsCreatedAt({
      page,
      sortBy,
    });
  }

  /** 게시글 좋아요 기준 조회
   * @Params page : 조회할 페이지 (ex 1, 2, 3)
   * @Params sortBy : 정렬기준 (ex ASC, DESC)
   */
  @Query(() => [FreeBoard])
  fetchFreeBoardsLikeCount(
    @Args('page', { defaultValue: 1 }) page: number, //
    @Args('sortBy', { defaultValue: 'DESC', nullable: true }) sortBy: string,
  ) {
    return this.freeBoardsService.findBoardsLikeCount({
      page,
      sortBy,
    });
  }

  /** 로그인한 본인 게시글만 조회 */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [FreeBoard])
  async searchMyFreeBoards(
    @Args({ name: 'search', nullable: true }) search: string, //
  ) {
    return this.freeBoardsService.searchUsersBoard({ search });
  }

  /** 게시글 생성 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => FreeBoard)
  async createFreeBoard(
    @Context() context: IContext,
    @Args('createBoardInput') createBoardInput: CreateFreeBoardInput,
  ) {
    const user = context.req.user.email;
    return await this.freeBoardsService.create({ user, createBoardInput });
  }

  /** 게시글 수정 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => FreeBoard)
  async updateFreeBoard(
    @Context() context: IContext,
    @Args('freeBoardId') freeBoardId: string,
    @Args('nickName') nickName: string,
    @Args('updateFreeBoardInput') updateFreeBoardInput: UpdateFreeBoardInput,
  ) {
    const userEmail = context.req.user.email;
    const result = this.freeBoardsService.update({
      userEmail,
      freeBoardId,
      nickName,
      updateFreeBoardInput,
    });
    return result;
  }

  /** 게시글 삭제 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteFreeBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.freeBoardsService.delete({ boardId });
  }

  /** 게시글 복구 */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  restoreFreeBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.freeBoardsService.restore({ boardId });
  }

  /** 유저가 작성한 게시글 조회 */
  @Query(() => Number)
  fetchUserFreeBoardNumber(
    @Args('userId') userId: string, //
  ) {
    return this.freeBoardsService.findBoardByUser({ userId });
  }

  /** 로그인한 본인 게시글만 조회 */
  @Query(() => [FreeBoard])
  fetchMyFreeBoard(
    @Args('userId') userId: string, //
    @Args('page', { defaultValue: 1 }) page: number,
  ) {
    return this.freeBoardsService.findBoardByUserWithPage({ userId, page });
  }

  /** 삭제된 게시글 조회 */
  @Query(() => [FreeBoard])
  fetchFreeBoardWithDeleted() {
    return this.freeBoardsService.WithBoardDelete();
  }
}
