"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const auth_validator_1 = require("../validators/auth.validator");
const auth_service_1 = require("../services/auth.service");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_validator_1.registerSchema.parse(req.body);
    const result = await (0, auth_service_1.registerEmployee)(input, req.user);
    (0, apiResponse_1.sendSuccess)(res, result, 'Employee registered successfully', 201);
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = auth_validator_1.loginSchema.parse(req.body);
    const result = await (0, auth_service_1.loginEmployee)(input);
    (0, apiResponse_1.sendSuccess)(res, result, 'Login successful');
});
