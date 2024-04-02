import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationMiddleware } from './middlewares/pagination-middleware';
import { HeaderMiddleware } from './middlewares/header-middleware';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { FailedLoginAttemptModule } from './failed-login-attempt/failed-login-attempt.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // validate,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DATABASE_NAME}?${process.env.MONGO_OPTIONS}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Set connection timeout (e.g., 30 seconds)
        connectTimeoutMS: 30000, // Timeout for initial connection
        socketTimeoutMS: 30000, // Timeout for ongoing operations
      }),
    }),
    FailedLoginAttemptModule,
    CommonModule,
    UserModule,
    SessionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
    consumer.apply(HeaderMiddleware).forRoutes();
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
