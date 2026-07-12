"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const reportService_1 = require("../services/reportService");
exports.getSummary = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    (0, apiResponse_1.sendSuccess)(res, await (0, reportService_1.getSummaryReport)());
});
