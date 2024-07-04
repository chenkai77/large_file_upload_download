import { Controller, Get, Query, Res } from '@nestjs/common';
import { DownloadService } from './download.service';
import * as fs from 'fs';

@Controller()
export class DownloadController {
  constructor(private readonly appService: DownloadService) {}

  @Get('file_size')
  fileDownload() {
    const filePath = `files/banner.jpg`;
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      return {
        size: stat.size,
        fileName: 'banner.jpg',
      };
    }
  }

  @Get('file_chunk')
  fileGet(@Query() params, @Res() res) {
    const filePath = `files/banner.jpg`;
    const fileStream = fs.createReadStream(filePath, {
      start: Number(params.start),
      end: Number(params.end),
    });
    fileStream.pipe(res);
  }
}
