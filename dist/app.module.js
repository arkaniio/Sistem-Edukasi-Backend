"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const results_module_1 = require("./results/results.module");
const resources_module_1 = require("./resources/resources.module");
const students_module_1 = require("./students/students.module");
const classes_module_1 = require("./classes/classes.module");
const attendance_module_1 = require("./attendance/attendance.module");
const assignments_module_1 = require("./assignments/assignments.module");
const announcements_module_1 = require("./announcements/announcements.module");
const quiz_controller_1 = require("./quiz/quiz.controller");
const quiz_service_1 = require("./quiz/quiz.service");
const question_controller_1 = require("./question/question.controller");
const question_service_1 = require("./question/question.service");
const option_controller_1 = require("./option/option.controller");
const option_service_1 = require("./option/option.service");
const student_answer_controller_1 = require("./student-answer/student-answer.controller");
const student_answer_service_1 = require("./student-answer/student-answer.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            dashboard_module_1.DashboardModule,
            results_module_1.ResultsModule,
            announcements_module_1.AnnouncementsModule,
            resources_module_1.ResourcesModule,
            students_module_1.StudentsModule,
            classes_module_1.ClassesModule,
            attendance_module_1.AttendanceModule,
            assignments_module_1.AssignmentsModule,
        ],
        controllers: [
            app_controller_1.AppController,
            quiz_controller_1.QuizController,
            question_controller_1.QuestionController,
            option_controller_1.OptionController,
            student_answer_controller_1.StudentAnswerController,
        ],
        providers: [
            app_service_1.AppService,
            quiz_service_1.QuizService,
            question_service_1.QuestionService,
            option_service_1.OptionService,
            student_answer_service_1.StudentAnswerService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map