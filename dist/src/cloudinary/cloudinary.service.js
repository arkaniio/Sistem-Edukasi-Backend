"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    logger = new common_1.Logger(CloudinaryService_1.name);
    constructor() {
        (0, dotenv_1.configDotenv)();
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        cloudinary_1.v2.api
            .ping()
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }
    async uploadFile(file, folder = 'cbt-uploads') {
        return new Promise((resolve, reject) => {
            console.log(cloudinary_1.v2.config());
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'raw' }, (error, result) => {
                console.dir(error, { depth: null });
                if (error) {
                    this.logger.error(`Cloudinary upload error: ${error.message}. Falling back to local storage.`);
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
                        });
                    }
                    catch (localErr) {
                        this.logger.error(`Local fallback failed: ${localErr.message}`);
                        reject(error);
                    }
                }
                else if (result) {
                    resolve(result);
                }
                else {
                    reject(new Error('Upload failed: no result returned'));
                }
            });
            uploadStream.end(file.buffer);
        });
    }
    async deleteFile(publicId) {
        try {
            if (publicId.startsWith('local-')) {
                const fs = require('fs');
                const path = require('path');
                const filename = publicId.substring(6);
                const filePath = path.join(process.cwd(), 'uploads', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    this.logger.log(`Local fallback file deleted: ${filePath}`);
                }
                return;
            }
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            this.logger.error(`Cloudinary delete error: ${error.message}`);
        }
    }
    getPublicIdFromUrl(url) {
        if (url.includes('/uploads/')) {
            const parts = url.split('/uploads/');
            return `local-${parts[parts.length - 1]}`;
        }
        const parts = url.split('/');
        const last = parts[parts.length - 1];
        const publicId = last.split('.')[0];
        return publicId || null;
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map