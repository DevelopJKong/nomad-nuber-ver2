import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { Column, Entity, JoinColumn, OneToOne, BeforeInsert } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entities/core.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Field((type) => String)
  @Column()
  code: string;

  @OneToOne((type) => User,{onDelete:"CASCADE"})
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
