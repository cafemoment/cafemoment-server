import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFreeBoardInput } from './createFreeBoard.input';

@InputType()
export class UpdateFreeBoardInput extends PartialType(CreateFreeBoardInput) {}
