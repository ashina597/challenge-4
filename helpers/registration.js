"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registerschema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.Registerschema = joi_1.default.object({
    fullname: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    age: joi_1.default.number().required(),
    roles: joi_1.default.string().required(),
    user_password: joi_1.default.string().required().min(8).max(30)
});
