import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/apis/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, //
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const userId = await context.switchToHttp()['args'][1].userId;
    const user = await this.userService.findOne({ userId });
    if (!roles.includes(user.role)) {
      return false;
    }
    return true;
  }
}
