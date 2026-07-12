"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const prisma_client_1 = require("../lib/prisma-client");
const AppError_1 = require("../utils/AppError");
const apiResponse_1 = require("../utils/apiResponse");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
        (0, apiResponse_1.sendError)(res, err.statusCode, err.code, err.message, err.details);
        return;
    }
    if (err instanceof zod_1.ZodError) {
        (0, apiResponse_1.sendError)(res, 400, 'VALIDATION_ERROR', 'Invalid request data', err.flatten());
        return;
    }
    if (err instanceof prisma_client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            (0, apiResponse_1.sendError)(res, 409, 'CONFLICT', `A record with this ${err.meta?.target?.join(', ') ?? 'value'} already exists`);
            return;
        }
        if (err.code === 'P2025') {
            (0, apiResponse_1.sendError)(res, 404, 'NOT_FOUND', 'Record not found');
            return;
        }
    }
    // eslint-disable-next-line no-console
    console.error('Unhandled error:', err);
    (0, apiResponse_1.sendError)(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
}
