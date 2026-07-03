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
exports.QuizAttemptController = void 0;
const common_1 = require("@nestjs/common");
const quiz_attempt_service_1 = require("./quiz-attempt.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let QuizAttemptController = class QuizAttemptController {
    quizAttemptService;
    constructor(quizAttemptService) {
        this.quizAttemptService = quizAttemptService;
    }
    start(quizId, user) {
        return this.quizAttemptService.startAttempt(user.userId, quizId);
    }
    submit(attemptId, dto, user) {
        return this.quizAttemptService.submitAttempt(user.userId, attemptId, dto.answers);
    }
    history(user, quizId) {
        return this.quizAttemptService.getHistory(user.userId, quizId);
    }
    findOne(id, user) {
        return this.quizAttemptService.findById(id, user.userId);
    }
};
exports.QuizAttemptController = QuizAttemptController;
__decorate([
    (0, common_1.Post)(':quizId/start'),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizAttemptController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(':attemptId/submit'),
    __param(0, (0, common_1.Param)('attemptId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], QuizAttemptController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('quizId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], QuizAttemptController.prototype, "history", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizAttemptController.prototype, "findOne", null);
exports.QuizAttemptController = QuizAttemptController = __decorate([
    (0, common_1.Controller)('quiz-attempts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [quiz_attempt_service_1.QuizAttemptService])
], QuizAttemptController);
//# sourceMappingURL=quiz-attempt.controller.js.map