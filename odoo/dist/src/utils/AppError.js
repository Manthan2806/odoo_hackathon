"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
    static badRequest(message, details) {
        return new AppError(400, 'BAD_REQUEST', message, details);
    }
    static unauthorized(message = 'Unauthorized') {
        return new AppError(401, 'UNAUTHORIZED', message);
    }
    static forbidden(message = 'Forbidden') {
        return new AppError(403, 'FORBIDDEN', message);
    }
    static notFound(message = 'Resource not found') {
        return new AppError(404, 'NOT_FOUND', message);
    }
    static conflict(message, details) {
        return new AppError(409, 'CONFLICT', message, details);
    }
    static internal(message = 'Internal server error') {
        return new AppError(500, 'INTERNAL_ERROR', message);
    }
}
exports.AppError = AppError;
