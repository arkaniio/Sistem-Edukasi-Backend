import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private readonly logger;
    constructor();
    uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse>;
    deleteFile(publicId: string): Promise<void>;
    getPublicIdFromUrl(url: string): string | null;
}
