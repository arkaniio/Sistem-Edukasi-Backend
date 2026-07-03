"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateData = void 0;
const UpdateData = (data) => {
    const update_data = {};
    if (data && typeof data === 'object') {
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined && data[key] !== null) {
                update_data[key] = data[key];
            }
        });
    }
    return update_data;
};
exports.UpdateData = UpdateData;
//# sourceMappingURL=null-check-helper.js.map