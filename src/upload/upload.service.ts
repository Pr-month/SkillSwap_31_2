import { HttpException, Injectable } from '@nestjs/common';
import { FILE_TYPES } from './upload.module';
import { readFile } from 'fs/promises';

@Injectable()
export class UploadService {
  private types = FILE_TYPES;

  private SIGNATURES = {
    JPEG: [0xff, 0xd8, 0xff],
    PNG: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    GIF: [0x47, 0x49, 0x46, 0x38], // 'GIF8'
    WEBP: [0x52, 0x49, 0x46, 0x46], // 'RIFF'
  };

  constructor() {}

  async upload(file: Express.Multer.File) {
    try {
      if (!FILE_TYPES.includes(file.mimetype)) {
        throw new HttpException('неправильный формат файла', 422);
      }

      const isValidSignature = await this.checkImageSignature(file);
      if (!isValidSignature) {
        throw new HttpException('неправильный формат файла', 422);
      }

      return {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('неправильный формат файла', 422);
    }
  }

  private async checkImageSignature(
    file: Express.Multer.File,
  ): Promise<boolean> {
    try {
      const buffer = await readFile(file.path);
      const uintArray = new Uint8Array(buffer);

      if (file.mimetype === 'image/jpeg') {
        return this.checkSignature(uintArray, this.SIGNATURES.JPEG);
      } else if (file.mimetype === 'image/png') {
        return this.checkSignature(uintArray, this.SIGNATURES.PNG);
      } else if (file.mimetype === 'image/gif') {
        return this.checkSignature(uintArray, this.SIGNATURES.GIF);
      } else if (file.mimetype === 'image/webp') {
        return this.checkSignature(uintArray, this.SIGNATURES.WEBP);
      } else if (file.mimetype === 'image/svg+xml') {
        const text = buffer.toString('utf-8');
        return text.includes('<svg') || text.includes('<?xml');
      }

      return false;
    } catch {
      return false;
    }
  }

  private checkSignature(uintArray: Uint8Array, signature: number[]): boolean {
    if (uintArray.length < signature.length) {
      return false;
    }

    for (let i = 0; i < signature.length; i++) {
      if (uintArray[i] !== signature[i]) {
        return false;
      }
    }
    return true;
  }
}
