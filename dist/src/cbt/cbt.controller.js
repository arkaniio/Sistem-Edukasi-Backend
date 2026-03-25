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
exports.CbtController = void 0;
const common_1 = require("@nestjs/common");
const cbt_service_1 = require("./cbt.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CbtController = class CbtController {
    cbtService;
    constructor(cbtService) {
        this.cbtService = cbtService;
    }
    findAll(req) {
        if (req.user.role === 'STUDENT') {
            return this.cbtService.findForStudent(req.user.userId);
        }
        return this.cbtService.findAll(req.user.userId);
    }
    findOne(id) {
        return this.cbtService.findOne(id);
    }
    create(req, data) {
        return this.cbtService.create(req.user.userId, data);
    }
    update(id, data) {
        return this.cbtService.update(id, data);
    }
    remove(id) {
        return this.cbtService.remove(id);
    }
    addQuestion(id, data) {
        return this.cbtService.addQuestion(id, data);
    }
    updateQuestion(qid, data) {
        return this.cbtService.updateQuestion(qid, data);
    }
    removeQuestion(qid) {
        return this.cbtService.deleteQuestion(qid);
    }
    startAttempt(req, id) {
        return this.cbtService.startAttempt(req.user.userId, id);
    }
    submitAttempt(req, aid, body) {
        return this.cbtService.submitAttempt(req.user.userId, aid, body.answers);
    }
    getAttempts(id) {
        return this.cbtService.getAttemptsByTest(id);
    }
    gradeAttempt(aid, body) {
        return this.cbtService.updateAttemptGrade(aid, body);
    }
};
exports.CbtController = CbtController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/questions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Patch)('questions/:qid'),
    __param(0, (0, common_1.Param)('qid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)('questions/:qid'),
    __param(0, (0, common_1.Param)('qid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "removeQuestion", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "startAttempt", null);
__decorate([
    (0, common_1.Post)('attempts/:aid/submit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('aid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "submitAttempt", null);
__decorate([
    (0, common_1.Get)('attempts/test/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "getAttempts", null);
__decorate([
    (0, common_1.Patch)('attempts/:aid/grade'),
    __param(0, (0, common_1.Param)('aid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CbtController.prototype, "gradeAttempt", null);
exports.CbtController = CbtController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cbt'),
    __metadata("design:paramtypes", [cbt_service_1.CbtService])
], CbtController);
//# sourceMappingURL=cbt.controller.js.map