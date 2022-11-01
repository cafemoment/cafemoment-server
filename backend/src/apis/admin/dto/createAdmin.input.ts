import { InputType, OmitType } from '@nestjs/graphql';
import { Admin } from '../entities/admin.entity';

@InputType({ description: '관리자 생성 INPUT' })
export class CreateAdminiInput extends OmitType(Admin, ['id'], InputType) {}
