"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const bcrypt = __importStar(require("bcrypt"));
const null_check_helper_1 = require("../tools/null-check-helper");
let AuthService = class AuthService {
    prisma;
    jwtService;
    cloudinary;
    constructor(prisma, jwtService, cloudinary) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.cloudinary = cloudinary;
    }
    buildTokenPair(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
        return { access_token, refresh_token };
    }
    formatUser(user) {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid email!');
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Failed to login, invalid password!');
        }
        const { access_token, refresh_token } = this.buildTokenPair(user);
        return {
            access_token,
            refresh_token,
            expires_in: 900,
            user: this.formatUser(user),
        };
    }
    async getPublicClasses() {
        return await this.prisma.class.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        });
    }
    async getUserCount() {
        return await this.prisma.user.count();
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing)
            throw new common_1.BadRequestException('Email already in use');
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const role = dto.role === 'STUDENT' ? 'STUDENT' : 'TEACHER';
        if (role === 'STUDENT' && !dto.classId) {
            throw new common_1.BadRequestException('Students must select a class');
        }
        const user = await this.prisma.user.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                password: hashedPassword,
                role: role,
                studentProfile: role === 'STUDENT'
                    ? {
                        create: {
                            firstName: dto.firstName,
                            lastName: dto.lastName,
                            classId: dto.classId,
                        },
                    }
                    : undefined,
            },
        });
        const { access_token, refresh_token } = this.buildTokenPair(user);
        return {
            access_token,
            refresh_token,
            expires_in: 900,
            user: this.formatUser(user),
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                avatar: true,
                phone: true,
                isActive: true,
                createdAt: true,
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return user;
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || !user.isActive)
                throw new common_1.UnauthorizedException('Invalid token');
            const { access_token, refresh_token } = this.buildTokenPair(user);
            return { access_token, refresh_token, expires_in: 900 };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout() {
        return { message: 'Logged out successfully' };
    }
    async updateProfile(userId, data) {
        if (!userId) {
            throw new common_1.BadRequestException('Session expired or invalid. Please log out and log back in.');
        }
        const update_data = (0, null_check_helper_1.UpdateData)(data);
        try {
            const user = await this.prisma.user.update({
                where: { id: userId },
                data: update_data,
            });
            return this.formatUser(user);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async uploadAvatar(userId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const result = await this.cloudinary.uploadFile(file, 'avatars');
        const avatarUrl = result.secure_url;
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
        });
        return this.formatUser(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        cloudinary_service_1.CloudinaryService])
], AuthService);
//# sourceMappingURL=auth.service.js.map