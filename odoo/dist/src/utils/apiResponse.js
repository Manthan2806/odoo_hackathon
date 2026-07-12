"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message, statusCode = 200) {
    const payload = { success: true, data, message };
    res.status(statusCode).json(payload);
}
function sendError(res, statusCode, code, message, details) {
    const payload = { success: false, error: { code, message, details } };
    res.status(statusCode).json(payload);
}
