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
const cbt_module_1 = require("./cbt/cbt.module");
const resources_module_1 = require("./resources/resources.module");
const students_module_1 = require("./students/students.module");
const classes_module_1 = require("./classes/classes.module");
const attendance_module_1 = require("./attendance/attendance.module");
const assignments_module_1 = require("./assignments/assignments.module");
const messages_module_1 = require("./messages/messages.module");
const announcements_module_1 = require("./announcements/announcements.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
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
            cbt_module_1.CbtModule,
            announcements_module_1.AnnouncementsModule,
            resources_module_1.ResourcesModule,
            students_module_1.StudentsModule,
            classes_module_1.ClassesModule,
            attendance_module_1.AttendanceModule,
            assignments_module_1.AssignmentsModule,
            messages_module_1.MessagesModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'public', 'uploads'),
                serveRoot: '/uploads',
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map