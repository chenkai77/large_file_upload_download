import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('upload')
  @UseInterceptors()
  fileUpload(@UploadedFile() file: Express.Multer.File): string {
    return this.appService.getHello();
  }
}
