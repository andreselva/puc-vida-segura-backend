import { Module } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { User } from './users/entities/user.entity';
import { ClinicalInfo } from './users/entities/clinical-info.entity';
import { UsersModule } from './users/users.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databasePath = configService.get<string>('DATABASE_PATH', 'storage/vida-segura.sqlite');
        mkdirSync(dirname(databasePath), { recursive: true });

        return {
          type: 'sqljs' as const,
          location: databasePath,
          autoSave: true,
          entities: [User, ClinicalInfo],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
