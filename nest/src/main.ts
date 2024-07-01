import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatusInterceptors } from './interceptors/httpStatus.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // 将POST请求的Http Status转换为200
  app.useGlobalInterceptors(new HttpStatusInterceptors());
  await app.listen(3000);
}
bootstrap();
