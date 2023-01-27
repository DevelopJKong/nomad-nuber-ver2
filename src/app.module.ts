import { AuthModule } from './auth/auth.module';
import { Category } from './restaurants/entities/category.entity';
import { Restaurant } from './restaurants/entities/restaurants.entity';
import { Verification } from './users/entities/verification.entity';
import { User } from './users/entities/user.entity';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { MailModule } from './mail/mail.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_HOST_MARIADB: Joi.string().required(),
        DB_PORT_MARIADB: Joi.string().required(),
        DB_USERNAME_MARIADB: Joi.string().required(),
        DB_PASSWORD_MARIADB: Joi.string().required(),
        DB_NAME_MARIADB: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST_MARIADB,
      port: +process.env.DB_PORT_MARIADB,
      username: process.env.DB_USERNAME_MARIADB,
      password: process.env.DB_PASSWORD_MARIADB,
      database: process.env.DB_NAME_MARIADB,
      synchronize: true,
      logging: true,
      entities: [User, Verification, Restaurant, Category],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({
        user: req['user'],
      }),
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    LoggerModule.forRoot({
      nodeEnv: process.env.NODE_ENV,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
  }
}
