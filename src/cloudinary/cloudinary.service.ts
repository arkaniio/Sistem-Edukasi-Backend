import { Injectable, Logger } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { configDotenv } from 'dotenv';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    configDotenv();

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    //check apakah sudah tersambung dengan benar
    cloudinary.api
      .ping()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'cbt-uploads',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      console.log(cloudinary.config());
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'raw' },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          console.dir(error, { depth: null });
          if (error) {
            this.logger.error(
              `Cloudinary upload error: ${error.message}. Falling back to local storage.`,
            );
            try {
              const fs = require('fs');
              const path = require('path');
              const uploadsDir = path.join(process.cwd(), 'uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }
              const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || '.pdf')}`;
              const filePath = path.join(uploadsDir, uniqueFilename);
              fs.writeFileSync(filePath, file.buffer);

              const port = process.env.PORT || 9000;
              const fileUrl = `http://localhost:${port}/uploads/${uniqueFilename}`;
              this.logger.log(`File saved locally as fallback: ${fileUrl}`);

              resolve({
                secure_url: fileUrl,
                public_id: `local-${uniqueFilename}`,
              } as any);
            } catch (localErr: any) {
              this.logger.error(`Local fallback failed: ${localErr.message}`);
              reject(error);
            }
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Upload failed: no result returned'));
          }
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      if (publicId.startsWith('local-')) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const path = require('path');
        const filename = publicId.substring(6);
        const filePath = path.join(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          this.logger.log(`Local fallback file deleted: ${filePath}`);
        }
        return;
      }
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.logger.error(`Cloudinary delete error: ${(error as Error).message}`);
    }
  }

  getPublicIdFromUrl(url: string): string | null {
    if (url.includes('/uploads/')) {
      const parts = url.split('/uploads/');
      return `local-${parts[parts.length - 1]}`;
    }
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    const publicId = last.split('.')[0];
    return publicId || null;
  }
}
