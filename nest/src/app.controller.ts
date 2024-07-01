import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'files',
    }),
  )
  fileUpload(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const fileName = body.name;
    const chunksDir = `files/chunks_${fileName}`;
    if (!fs.existsSync(chunksDir)) {
      fs.mkdirSync(chunksDir);
    }
    fs.cpSync(file.path, `${chunksDir}/${fileName}-${body.index}`);
    fs.rmSync(file.path);
  }

  @Post('buffer_merge')
  fileBufferMerge(@Body() body: { name: string }) {
    const chunksDir = `files/chunks_${body.name}`;
    const files = fs.readdirSync(chunksDir).sort((a, b) => {
      const aIndex = a.slice(a.lastIndexOf('-'));
      const bIndex = b.slice(b.lastIndexOf('-'));
      return Number(bIndex) - Number(aIndex);
    });
    const outputFilePath = `files/${body.name}`;
    const buffers = [];
    files.forEach((file) => {
      const filePath = `${chunksDir}/${file}`;
      const buffer = fs.readFileSync(filePath);
      buffers.push(buffer);
      const concatBuffer = Buffer.concat(buffers);
      fs.writeFileSync(outputFilePath, concatBuffer);
      fs.rm(chunksDir, { recursive: true }, () => {});
    });
  }

  @Post('stream_merge')
  fileMerge(@Body() body: { name: string }) {
    const chunksDir = `files/chunks_${body.name}`;
    const files = fs.readdirSync(chunksDir).sort((a, b) => {
      const aIndex = a.slice(a.lastIndexOf('-'));
      const bIndex = b.slice(b.lastIndexOf('-'));
      return Number(bIndex) - Number(aIndex);
    });
    let startPos = 0;
    const outputFilePath = `files/${body.name}`;
    files.forEach((file, index) => {
      const filePath = `${chunksDir}/${file}`;
      const readStream = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(outputFilePath, {
        start: startPos,
      });
      readStream.pipe(writeStream).on('finish', () => {
        if (index === files.length - 1) {
          fs.rm(chunksDir, { recursive: true }, () => {});
        }
      });
      startPos += fs.statSync(filePath).size;
    });
  }
}
