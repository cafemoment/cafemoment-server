import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCafeBoardInput } from './createCafeBoard.input';

@InputType()
export class UpdateCafeBoardInput extends PartialType(CreateCafeBoardInput) {}
