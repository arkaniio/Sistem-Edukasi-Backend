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
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(userDto) {
        const user = await this.prisma.user.findUnique({ where: { email: userDto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isPasswordValid = await bcrypt.compare(userDto.password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        };
    }
    async getPublicClasses() {
        return this.prisma.class.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }
    async register(userDto) {
        const existing = await this.prisma.user.findUnique({ where: { email: userDto.email } });
        if (existing)
            throw new common_1.BadRequestException('Email already in use');
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        const role = userDto.role === 'STUDENT' ? 'STUDENT' : 'TEACHER';
        if (role === 'STUDENT' && !userDto.classId) {
            throw new common_1.BadRequestException('Bagi siswa, Anda wajib memilih kelas Peminatan Fisika');
        }
        const user = await this.prisma.user.create({
            data: {
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                email: userDto.email,
                password: hashedPassword,
                role: role,
                studentProfile: role === 'STUDENT' ? {
                    create: {
                        firstName: userDto.firstName,
                        lastName: userDto.lastName,
                        classId: userDto.classId
                    }
                } : undefined
            }
        });
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        };
    }
    async updateProfile(userId, data) {
        if (!userId) {
            throw new common_1.BadRequestException('Sesi kadaluarsa atau tidak valid. Harap Log Out dan Log In kembali.');
        }
        const updateData = {};
        if (data.firstName)
            updateData.firstName = data.firstName;
        if (data.lastName)
            updateData.lastName = data.lastName;
        if (data.email)
            updateData.email = data.email;
        if (data.avatar)
            updateData.avatar = data.avatar;
        try {
            const user = await this.prisma.user.update({
                where: { id: userId },
                data: updateData
            });
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Email sudah digunakan oleh akun lain!');
            }
            if (error.code === 'P2025') {
                throw new common_1.BadRequestException('Akun tidak ditemukan di Database. Silakan Log Out dan Register ulang.');
            }
            throw new common_1.BadRequestException('Gagal menyimpan ke database (Validation Error). Pastikan file tidak rusak.');
        }
    }
    async getUserCount() {
        return this.prisma.user.count();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map