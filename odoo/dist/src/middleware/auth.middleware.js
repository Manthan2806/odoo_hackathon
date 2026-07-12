"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        throw AppError_1.AppError.unauthorized('Missing or malformed Authorization header');
    }
    const token = header.slice('Bearer '.length);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.user = {
            id: decoded.id,
            role: decoded.role,
            employeeId: decoded.employeeId,
        };
        next();
    }
    catch {
        throw AppError_1.AppError.unauthorized('Invalid or expired token');
    }
}
