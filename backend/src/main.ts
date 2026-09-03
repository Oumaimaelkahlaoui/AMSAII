import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Dans src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001); // <-- Changez 3000 par 3001 ici
}
bootstrap();