import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthResolver } from './auths.resolver';
import { AuthsService } from './auths.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entites/user.entity';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { HttpExceptionFilter } from 'src/commons/filter/http-exception.filter';
import { AuthsController } from './auths.controllers';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { jwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
import { JwtAdminStrategy } from 'src/commons/auth/jwt-admin.strategy';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User, //
    ]),
  ],
  providers: [
    AuthResolver,
    AuthsService,
    HttpExceptionFilter,
    JwtGoogleStrategy,
    JwtNaverStrategy,
    jwtKakaoStrategy,
    JwtAccessStrategy,
    JwtAdminStrategy,
    JwtService,
    JwtModule,
    JwtRefreshStrategy,
    UsersService,
  ],
  controllers: [
    AuthsController, //
  ],
})
export class AuthsModule {}
