import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinary: CloudinaryService) {}

  async uploadFile(file: Express.Multer.File) {
    const result = await this.cloudinary.uploadFile(file);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      originalName: file.originalname,
    };
  }
}
