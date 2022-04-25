import { LoginInput } from './dtos/login.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    //check new user
    //create user & hash password
    try {
      const exists = await this.users.findOne({ email });

      if (exists) {
        //make error
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (error) {
      return {
        ok: false,
        error: "Couldn't create account",
      };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // make a JWT and give it to the user
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      return {
        ok: true,
        token: 'lalalalaalala',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}