import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Repository } from 'typeorm';
import { User } from '../users/entites/user.entity';
import { ChatService } from './chat.service';
import { ChatMessage } from './entities/chatMessage.entity';
import { ChatRoom } from './entities/chatRoom.entity';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ChatRoom)
  createRoom(
    @Args('userId') userId: string,
    @Args('opponentNickName') opponentNickName: string, //
  ) {
    return this.chatService.create({ userId, opponentNickName });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => ChatRoom)
  connectionRoom(
    @Args('userId') userId: string,
    @Args('hostNickName') hostNickName: string, //
  ) {
    return this.chatService.join({ userId, hostNickName });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ChatMessage])
  fetchLogs(
    @Args('room') room: string, //
  ) {
    return this.chatService.load({ room });
  }
}
