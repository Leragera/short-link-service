"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = __importDefault(require("../app.js"));
const validators_js_1 = require("../utils/validators.js");
process.env.APP_URL = 'http://localhost:3001';
(0, node_test_1.test)('GET /api/health is handled by the health route', async () => {
    const response = await (0, supertest_1.default)(app_js_1.default).get('/api/health');
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(response.body.status, 'OK');
});
(0, node_test_1.test)('shortenUrlSchema rejects links pointing to this service', () => {
    const result = validators_js_1.shortenUrlSchema.safeParse({
        originalUrl: 'http://localhost:3001/another-short-link',
    });
    strict_1.default.equal(result.success, false);
});
