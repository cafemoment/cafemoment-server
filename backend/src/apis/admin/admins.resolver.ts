import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Admin } from './entities/admin.entity';
import { CreateAdminiInput } from './dto/createAdmin.input';
import { AdminService } from './admins.service';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService, //
  ) {}

  /** 관리자 생성 */
  @Mutation(() => Admin, { description: '관리자 생성' })
  async createAdmin(
    @Args('createAdminInput')
    createAdminInput: CreateAdminiInput, //
  ) {
    return this.adminService.create({ ...createAdminInput });
  }
}
