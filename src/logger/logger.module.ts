import { CONFIG_OPTIONS } from './../common/common.constants';
import { LoggerModuleOptions } from './logger.interface';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({})
@Global()
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
