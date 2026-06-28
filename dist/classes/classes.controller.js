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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const classes_service_1 = require("./classes.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_class_dto_1 = require("./dto/create-class.dto");
const update_class_dto_1 = require("./dto/update-class.dto");
const role_guard_1 = require("../auth/guards/role-guard");
const role_user_decorator_1 = require("../auth/decorators/role-user.decorator");
let ClassesController = class ClassesController {
    classesService;
    constructor(classesService) {
        this.classesService = classesService;
    }
    async findAll() {
        return await this.classesService.findAll();
    }
    async create(data) {
        return await this.classesService.create(data);
    }
    async update(id, data) {
        return await this.classesService.update(id, data);
    }
    async remove(id) {
        return await this.classesService.remove(id);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_class_dto_1.CreateClassDto]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_class_dto_1.UpdateClassDto]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "remove", null);
exports.ClassesController = ClassesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('classes'),
    __metadata("design:paramtypes", [classes_service_1.ClassesService])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map