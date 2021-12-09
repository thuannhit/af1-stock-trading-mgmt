import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'user ' })
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field()
  bankAccountNo: string;

  @Field()
  status: string;
}
