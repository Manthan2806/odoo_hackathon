"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.login);
// Only an existing ADMIN can create new employee accounts.
// The very first ADMIN account is created by the seed script, not this route.
router.post('/register', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('ADMIN'), auth_controller_1.register);
exports.default = router;
