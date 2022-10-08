import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entites/user.entity';
import { ChatMessage } from './entities/chatMessage.entity';
import { ChatRoom } from './entities/chatRoom.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(ChatRoom)
    private readonly chatRoomsRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  async create({ opponentNickName, userId }) {
    const host = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const opponet = await this.usersRepository.findOne({
      where: { nickName: opponentNickName },
    });
    const uuid = uuidv4();
    const result = await this.chatRoomsRepository.save({
      room: uuid,
      user: host,
    });

    await this.chatRoomsRepository.save({
      room: result.room,
      user: opponet,
    });

    return result;
  }

  async join({ userId, hostNickName }) {
    const user = await this.usersRepository.findOne({
      where: { nickName: hostNickName },
    });

    const host = await this.chatRoomsRepository.find({
      where: { user },
    });

    const me = await this.chatRoomsRepository.find({
      where: { user: userId },
    });
    let result;
    for (let i = 0; i < host.length; i++) {
      for (let j = 0; j < me.length; j++) {
        if (host[i].room === me[j].room) {
          result = host[i];
        }
      }
    }

    return result;
  }

  async load({ room }) {
    const result = await this.chatMessagesRepository.find({
      where: { room: room },
      order: { createAt: 'ASC' },
      relations: ['user'],
    });

    return result;
  }
}
