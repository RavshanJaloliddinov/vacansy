import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'src/config';

@Injectable()
export class Application {
  public static async main(): Promise<void> {
    let app = await NestFactory.create(AppModule)

    await app.listen(config.PORT, () => {
      console.log(`Server running in ${config.PORT}`)
    })
  }
}
