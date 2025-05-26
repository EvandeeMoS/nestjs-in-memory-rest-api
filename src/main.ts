import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Banco Simplificado em memória")
    .setDescription("Inspirado pelo desafio técnico do picpay")
    .setVersion("1.0")
    .addTag("bank")
    .addGlobalResponse(
      {status: 500, description: "Internal Server Error"}
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((e) => {
  throw e;
});
