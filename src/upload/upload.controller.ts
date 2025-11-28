import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const fileInfo = await this.uploadService.upload(file);
    return fileInfo;
  }
}
