import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OperationIndexModule } from './operation-index/operation-index.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
    }),
    //config typeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get('SQL_HOST'),
        port: +config.get('SQL_PORT'),
        username: config.get('SQL_USER'),
        password: config.get('SQL_PASSWORD'),
        database: config.get('SQL_DATABASE'),
        entities: [],
        synchronize: true,
        options: {
          encrypt: false,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    OperationIndexModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
