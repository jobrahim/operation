import { Module } from '@nestjs/common';
import { OperationIndexService } from './operation-index.service';
import { OperationIndexController } from './operation-index.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [AuthModule, ConfigModule, TypeOrmModule.forFeature()],
  controllers: [OperationIndexController],
  providers: [
    OperationIndexService,
    {
      provide: 'ITL_PROFILE_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('PROFILE_SERVICE_TCP_HOST'),
            port: configService.get('PROFILE_SERVICE_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class OperationIndexModule {}
