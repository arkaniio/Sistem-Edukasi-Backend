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
exports.MyClassesController = void 0;
const common_1 = require("@nestjs/common");
const my_classes_service_1 = require("./my-classes.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role-guard");
const role_user_decorator_1 = require("../auth/decorators/role-user.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let MyClassesController = class MyClassesController {
    myClassesService;
    constructor(myClassesService) {
        this.myClassesService = myClassesService;
    }
    getMyClasses(user) {
        return this.myClassesService.getMyClasses(user.userId);
    }
    enroll(user, dto) {
        return this.myClassesService.enroll(user.userId, dto.classId, dto.subjectId);
    }
    unenroll(user, id) {
        return this.myClassesService.unenroll(id, user.userId);
    }
};
exports.MyClassesController = MyClassesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyClassesController.prototype, "getMyClasses", null);
__decorate([
    (0, common_1.Post)('enroll'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MyClassesController.prototype, "enroll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MyClassesController.prototype, "unenroll", null);
exports.MyClassesController = MyClassesController = __decorate([
    (0, common_1.Controller)('my-classes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER'),
    __metadata("design:paramtypes", [my_classes_service_1.MyClassesService])
], MyClassesController);
//# sourceMappingURL=my-classes.controller.js.map