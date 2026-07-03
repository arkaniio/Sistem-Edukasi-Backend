import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class UploadService {
    private readonly cloudinary;
    constructor(cloudinary: CloudinaryService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
        format: string;
        bytes: number;
        originalName: string;
    }>;
}
