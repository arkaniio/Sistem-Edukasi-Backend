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
var AdminBootstrapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBootstrapService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AdminBootstrapService = AdminBootstrapService_1 = class AdminBootstrapService {
    prisma;
    logger = new common_1.Logger(AdminBootstrapService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const email = process.env.ADMIN_GMAIL?.trim().toLowerCase();
        const password = process.env.ADMIN_PASSWORD?.trim();
        const firstName = process.env.ADMIN_FIRST_NAME?.trim() || 'Admin';
        const lastName = process.env.ADMIN_LAST_NAME?.trim() || 'User';
        if (!email || !password) {
            this.logger.warn('ADMIN_GMAIL atau ADMIN_PASSWORD belum di-set — seed admin dilewati');
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.user.upsert({
            where: { email },
            update: {
                firstName,
                lastName,
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true,
            },
            create: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'ADMIN',
                isActive: true,
            },
        });
        this.logger.log(`Akun admin siap: ${email}`);
    }
};
exports.AdminBootstrapService = AdminBootstrapService;
exports.AdminBootstrapService = AdminBootstrapService = AdminBootstrapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminBootstrapService);
//# sourceMappingURL=admin-bootstrap.service.js.map