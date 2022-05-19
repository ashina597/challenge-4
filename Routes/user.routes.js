"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../Controller/user.controller");
const verify_1 = require("../Middleware/verify");
const router = express_1.default.Router();
router.post('/create', user_controller_1.createUser);
router.get('/login', user_controller_1.loginUser);
router.get('/', user_controller_1.getUsers);
router.get('/home', verify_1.Verify, user_controller_1.homepage);
router.get('/:id', user_controller_1.getUser);
router.put('/:id', user_controller_1.updateUser);
router.delete('/:id', user_controller_1.deleteUser);
router.patch('/:id', user_controller_1.resetpassword);
exports.default = router;
