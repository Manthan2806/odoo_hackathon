"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnAllocation = exports.transfer = exports.allocate = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const AppError_1 = require("../utils/AppError");
const validators_1 = require("../validators");
const AllocationService = __importStar(require("../services/allocationService"));
function actorId(req) {
    if (!req.user)
        throw AppError_1.AppError.unauthorized();
    return req.user.employeeId;
}
exports.allocate = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const allocation = await AllocationService.allocateAsset(validators_1.allocateAssetSchema.parse(req.body), actorId(req));
    (0, apiResponse_1.sendSuccess)(res, allocation, 'Asset allocated', 201);
});
exports.transfer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const allocation = await AllocationService.transferAsset(String(req.params.id), validators_1.transferAssetSchema.parse(req.body), actorId(req));
    (0, apiResponse_1.sendSuccess)(res, allocation, 'Asset transferred');
});
exports.returnAllocation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const allocation = await AllocationService.returnAsset(String(req.params.id), validators_1.returnAssetSchema.parse(req.body), actorId(req));
    (0, apiResponse_1.sendSuccess)(res, allocation, 'Asset returned');
});
