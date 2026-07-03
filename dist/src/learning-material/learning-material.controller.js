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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningMaterialController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const learning_material_service_1 = require("./learning-material.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role-guard");
const role_user_decorator_1 = require("../auth/decorators/role-user.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let LearningMaterialController = class LearningMaterialController {
    learningMaterialService;
    constructor(learningMaterialService) {
        this.learningMaterialService = learningMaterialService;
    }
    findAll() {
        return this.learningMaterialService.findAll();
    }
    findOne(id) {
        return this.learningMaterialService.findById(id);
    }
    upload(file, body, user) {
        return this.learningMaterialService.upload(file, body, user.userId);
    }
    remove(id) {
        return this.learningMaterialService.delete(id);
    }
};
exports.LearningMaterialController = LearningMaterialController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LearningMaterialController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LearningMaterialController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], LearningMaterialController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LearningMaterialController.prototype, "remove", null);
exports.LearningMaterialController = LearningMaterialController = __decorate([
    (0, common_1.Controller)('learning-materials'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [learning_material_service_1.LearningMaterialService])
], LearningMaterialController);
//# sourceMappingURL=learning-material.controller.js.map