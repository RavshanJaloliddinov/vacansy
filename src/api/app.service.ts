import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'src/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class Application {
  public static async main(): Promise<void> {
    let app = await NestFactory.create(AppModule)

    const swagger = new DocumentBuilder()
      .setTitle('Vacany backend')
      .setDescription('11')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        'access-token'
      )
      .build()

    const document = SwaggerModule.createDocument(app, swagger)
    SwaggerModule.setup('api', app, document)
    await app.listen(config.PORT, () => {
      console.log(`Server running in ${config.PORT}`)
    })
  }
}
