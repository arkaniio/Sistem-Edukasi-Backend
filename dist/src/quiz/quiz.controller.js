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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const quiz_service_1 = require("./quiz.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role-guard");
const role_user_decorator_1 = require("../auth/decorators/role-user.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let QuizController = class QuizController {
    quizService;
    constructor(quizService) {
        this.quizService = quizService;
    }
    findAll(status, subjectId, search) {
        return this.quizService.findAll({ status, subjectId, search });
    }
    findForStudent(user) {
        return this.quizService.findForStudent(user.userId);
    }
    findOne(id) {
        return this.quizService.findById(id);
    }
    create(dto, user) {
        return this.quizService.create(user.userId, dto);
    }
    update(id, dto) {
        return this.quizService.update(id, dto);
    }
    publish(id) {
        return this.quizService.publish(id);
    }
    close(id) {
        return this.quizService.close(id);
    }
    addQuestions(id, dto) {
        return this.quizService.addQuestions(id, dto.questionIds);
    }
    removeQuestion(id, questionId) {
        return this.quizService.removeQuestion(id, questionId);
    }
    remove(id) {
        return this.quizService.delete(id);
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('subjectId')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('student'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "findForStudent", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "close", null);
__decorate([
    (0, common_1.Post)(':id/questions'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "addQuestions", null);
__decorate([
    (0, common_1.Delete)(':id/questions/:questionId'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "removeQuestion", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, role_user_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "remove", null);
exports.QuizController = QuizController = __decorate([
    (0, common_1.Controller)('quizzes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map