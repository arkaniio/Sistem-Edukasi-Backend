"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningMaterialModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const learning_material_controller_1 = require("./learning-material.controller");
const learning_material_service_1 = require("./learning-material.service");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const parser_job_module_1 = require("../parser-job/parser-job.module");
let LearningMaterialModule = class LearningMaterialModule {
};
exports.LearningMaterialModule = LearningMaterialModule;
exports.LearningMaterialModule = LearningMaterialModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({ storage: (0, multer_1.memoryStorage)() }),
            cloudinary_module_1.CloudinaryModule,
            parser_job_module_1.ParserJobModule,
        ],
        controllers: [learning_material_controller_1.LearningMaterialController],
        providers: [learning_material_service_1.LearningMaterialService],
        exports: [learning_material_service_1.LearningMaterialService],
    })
], LearningMaterialModule);
//# sourceMappingURL=learning-material.module.js.map