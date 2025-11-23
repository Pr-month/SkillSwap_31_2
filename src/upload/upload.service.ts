import { HttpException, Injectable, UploadedFile } from '@nestjs/common';
import { FILE_TYPES } from './upload.module';
import { extname } from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class UploadService {
  private types = FILE_TYPES;

  private SIGNATURES = {
    PNG: [0x89, 0x50, 0x4e, 0x47],
    JPEG: [0xff, 0xd8, 0xff],
    GIF: [0x47, 0x49, 0x46],
    SVG: [0x3c, 0x3f, 0x78, 0x6d, 0x6c], // <?xml
    SVG_ALT: [0x3c, 0x73, 0x76, 0x67], // <svg
  };

  constructor() {}

  async upload(@UploadedFile() file) {
    try {
      if (!this.__isValidFormat(file)) {
        return Promise.reject(
          new HttpException('неправильный формат файла', 422),
        );
      }
      const isValidSignature = await this.__checkImageSignature(file);
      if (!isValidSignature) {
        return Promise.reject(
          new HttpException('неправильный формат файла', 422),
        );
      }
      return Promise.resolve({
        originalName: file.originalname,
        filename: file.filename,
      });
    } catch {
      return Promise.reject(
        new HttpException('неправильный формат файла', 422),
      );
    }
  }

  private __isValidFormat(@UploadedFile() file) {
    return this.types
      .map((type) => `.${type.split('/')[1]}`)
      .includes(extname(file.path));
  }

  private async __checkImageSignature(@UploadedFile() file): Promise<boolean> {
    try {
      const buffer = await readFile(file.path);
      const uintArray = new Uint8Array(buffer);
      for (const sig of Object.keys(this.SIGNATURES)) {
        if (this.__checkSignature(uintArray, this.SIGNATURES[sig])) {
          return Promise.resolve(true);
        }
      }
      return Promise.reject(false);
    } catch {
      return Promise.reject(false);
    }
  }

  private __checkSignature(
    uintArray: Uint8Array,
    signature: number[],
  ): boolean {
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
