"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const AppError_1 = require("../utils/AppError");
/**
 * Usage: router.post('/departments', authenticate, requireRole('ADMIN'), handler)
 * Must run after `authenticate` — relies on req.user being set.
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized();
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw AppError_1.AppError.forbidden(`This action requires one of the following roles: ${allowedRoles.join(', ')}`);
        }
        next();
    };
}
