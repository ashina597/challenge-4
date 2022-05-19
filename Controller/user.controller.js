"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetpassword = exports.homepage = exports.loginUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const config_1 = __importDefault(require("../config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const login_1 = require("../helpers/login");
const registration_1 = require("../helpers/registration");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
//creating user
const createUser = async (req, res) => {
    try {
        const id = (0, uuid_1.v1)();
        const { fullname, username, age, roles, email, user_password } = req.body;
        const { error } = registration_1.Registerschema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        let pool = await mssql_1.default.connect(config_1.default);
        //encrpting password
        const hashed_pass = await bcrypt_1.default.hash(user_password, 10);
        await pool.request()
            .input('id', mssql_1.default.VarChar(100), id)
            .input('fullname', mssql_1.default.VarChar(50), fullname)
            .input('username', mssql_1.default.VarChar(50), username)
            .input('email', mssql_1.default.VarChar(50), email)
            .input('age', mssql_1.default.Int, age)
            .input('roles', mssql_1.default.VarChar(50), roles)
            .input('user_password', mssql_1.default.VarChar(250), hashed_pass)
            .execute('insertUser');
        res.status(200).json({ message: 'USer Created Successfully' });
    }
    catch (error) {
        res.json({ error: error.message });
    }
};
exports.createUser = createUser;
//read all users
const getUsers = async (req, res, next) => {
    try {
        let pool = await mssql_1.default.connect(config_1.default);
        const users = await pool.request().execute('getUsers');
        res.json(users.recordset);
    }
    catch (error) {
        res.json({ error: error.message });
    }
};
exports.getUsers = getUsers;
//get one user
const getUser = async (req, res) => {
    try {
        const { username } = req.body;
        let pool = await mssql_1.default.connect(config_1.default);
        const user = await pool.request()
            .input('username', mssql_1.default.VarChar, username)
            .execute('getUser');
        if (!user.recordset[0]) {
            return res.json({ message: `User with username : ${username} Does Not exist` });
        }
        res.json(user.recordset);
    }
    catch (error) {
        res.json({ error: error.message });
    }
};
exports.getUser = getUser;
//updating a user
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        let pool = await mssql_1.default.connect(config_1.default);
        const { fullname, username, age, roles, email, user_password } = req.body;
        const user = await pool.request()
            .input('username', mssql_1.default.VarChar, username)
            .execute('getUser');
        if (!user.recordset[0]) {
            return res.json({ message: `User with id : ${id} Does Not exist` });
        }
        const hashed_pass = await bcrypt_1.default.hash(user_password, 10);
        await pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('fullname', mssql_1.default.VarChar, fullname)
            .input('username', mssql_1.default.VarChar, username)
            .input('email', mssql_1.default.VarChar, email)
            .input('age', mssql_1.default.Int, age)
            .input('roles', mssql_1.default.VarChar, roles)
            .input('user_password', mssql_1.default.VarChar, hashed_pass)
            .execute('updateUser');
        res.json({ message: "User Successfully Updated" });
    }
    catch (error) {
        res.json({ error: error.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        let pool = await mssql_1.default.connect(config_1.default);
        const user = await pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('deleteUser');
        res.json({ message: 'User Deleted Successfully' });
    }
    catch (error) {
        res.json({ error: error.message
        });
    }
};
exports.deleteUser = deleteUser;
//login Endpoint
const loginUser = async (req, res) => {
    try {
        let pool = await mssql_1.default.connect(config_1.default);
        const { email, user_password } = req.body;
        const { error } = login_1.LoginSchema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        const user = await pool.request()
            .input('email', mssql_1.default.VarChar(100), email)
            .execute('login_user');
        if (!user.recordset[0]) {
            res.json({ message: `Invalid Credentials` });
        }
        const hashed_pass = user.recordset[0].user_password;
        const valid_pass = await bcrypt_1.default.compare(user_password, hashed_pass);
        if (!valid_pass) {
            res.json({ message: 'Invalid credentials' });
        }
        const data = user.recordset.map(record => {
            const { user_password, ...rest } = record;
            return rest;
        });
        let payload = await pool.request().query(` SELECT fullname,email FROM Users
        WHERE email='${email}'
        `);
        payload = payload.recordset[0];
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY);
        res.json({ message: "logged in successfully", data, token });
    }
    catch (error) {
        res.json(error.message);
    }
};
exports.loginUser = loginUser;
//homepage
const homepage = (req, res) => {
    const { username } = req.body;
    res.json({ message: 'Hello ${username} Welcome..' });
};
exports.homepage = homepage;
const resetpassword = async (req, res) => {
    try {
        const id = req.params.id;
        let pool = await mssql_1.default.connect(config_1.default);
        const { username, user_password } = req.body;
        const user = await pool.request()
            .input('username', mssql_1.default.VarChar, username)
            .execute('getUser');
        if (!user.recordset[0]) {
            res.json({ message: `User with id : ${id} Does Not exist` });
        }
        else {
            const hashed_pass = await bcrypt_1.default.hash(user_password, 10);
            await pool.request()
                .input('id', mssql_1.default.VarChar(100), id)
                .input('user_password', mssql_1.default.VarChar, hashed_pass)
                .execute('resetpassword');
            res.json({ message: "paswword Successfully Updated" });
        }
    }
    catch (error) {
        res.json({ error: error.message });
    }
};
exports.resetpassword = resetpassword;
