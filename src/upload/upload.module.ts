import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';

export const FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export const FILE_TYPES_SET = new Set(FILE_TYPES);

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../public/uploads'),
        filename: (_, file, cb) => {
          const uniq = `${Date.now()}-${Math.random() * 10}`;
          cb(null, `${uniq}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!FILE_TYPES_SET.has(file.mimetype)) {
          return cb(new Error('файл не изображение'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  ],
})
export class UploadModule {}
