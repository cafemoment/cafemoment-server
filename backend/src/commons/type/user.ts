import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  CAFEOWNER = 'CAFEOWNER',
  USER = 'USER',
}

export interface ICurrentUser {
  id: string;
  email: string;
}

/**
 * GraphQL Context
 */
export const CurrnetUser = createParamDecorator(
  (_, context: ExecutionContext): ICurrentUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
