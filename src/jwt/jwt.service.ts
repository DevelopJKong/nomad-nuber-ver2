import { CONFIG_OPTIONS } from 'src/common/common.constants';
import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(payload: object): string {
    return jwt.sign(payload, this.options.privateKey);
    //return jwt.sign({id:userId} , this.options.privateKey);
    //return jwt.sign({id:userId} , this.configService.get('PRIVATE_KEY');
    //다른 곳에서도 사용한다면 조금 더 범용성 있게 작성해줄수도 있다 위는 특정만
  }
  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
