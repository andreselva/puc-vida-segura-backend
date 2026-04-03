import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.get(UsersService).onModuleInit();
  await app.close();
  console.log('Seed finalizado.');
}

bootstrap();
