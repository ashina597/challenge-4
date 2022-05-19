"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mssql_1 = __importDefault(require("mssql"));
const user_routes_1 = __importDefault(require("./Routes/user.routes"));
const config_1 = __importDefault(require("./config/config"));
console.log("opening port...");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/user', user_routes_1.default);
app.listen(5000, () => {
    console.log('App running on part 5000 ...');
});
const checkConnection = async () => {
    await mssql_1.default.connect(config_1.default).then(x => {
        if (x.connected) {
            console.log('Database Connected');
        }
    }).catch(err => {
        console.log(err.message);
    });
};
checkConnection();
