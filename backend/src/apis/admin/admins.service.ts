import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly AdminRepository: Repository<Admin>, //
  ) {}

  async findOne({ adminId }): Promise<Admin> {
    return await this.AdminRepository.findOne({ where: { adminId } });
  }

  async create({ ...CreateAdminiInput }): Promise<Admin> {
    const { password, adminId } = CreateAdminiInput;
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.HASH_SECRET),
    );

    return await this.AdminRepository.save({
      ...CreateAdminiInput,
      password: hashedPassword,
      adminId,
    });
  }
}
