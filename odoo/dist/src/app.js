"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const assetRoutes_1 = __importDefault(require("./routes/assetRoutes"));
const allocationRoutes_1 = __importDefault(require("./routes/allocationRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const maintenanceRoutes_1 = __importDefault(require("./routes/maintenanceRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.get('/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
});
exports.app.use('/auth', auth_routes_1.default);
exports.app.use('/api/categories', categoryRoutes_1.default);
exports.app.use('/api/assets', assetRoutes_1.default);
exports.app.use('/api/allocations', allocationRoutes_1.default);
exports.app.use('/api/bookings', bookingRoutes_1.default);
exports.app.use('/api/maintenance', maintenanceRoutes_1.default);
exports.app.use('/api/reports', reportRoutes_1.default);
// Teammate's routes get mounted here as their modules land, e.g.:
// app.use('/departments', departmentRoutes);
// app.use('/employees', employeeRoutes);
// app.use('/asset-categories', assetCategoryRoutes);
// app.use('/assets', assetRoutes);
// app.use('/allocations', allocationRoutes);
// app.use('/maintenance', maintenanceRoutes);
// app.use('/bookings', bookingRoutes);
// app.use('/reports', reportRoutes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/notifications', notificationRoutes);
// app.use('/ai', aiRoutes);
// Error handler must be registered last.
exports.app.use(errorHandler_1.errorHandler);
