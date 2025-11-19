import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join, extname } from 'path';
import { response } from 'express';

export const FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export const FILE_TYPES_SET = new Set(FILE_TYPES);

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: join(__dirname, '../public/uploads'),
      storage: {
        destination: join(__dirname, '../public/uploads'),
        filename: (_, file, cb) => {
          const uniq = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniq}.${extname(file.originalname)}`);
        },
        fileFilter: (_, file, cb) => {
          if (!FILE_TYPES_SET.has(file.mimetype)) {
            return cb(new Error('файл не изображение'), false);
          }
          cb(null, true);
        },
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const fileInfo = await this.uploadService.upload(file);
    return response.json(fileInfo);
  }
}
