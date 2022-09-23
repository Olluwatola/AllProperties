"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config/config");
const app_1 = require("./app");
dotenv_1.default.config();
console.log(process.env.SERVER_PORT);
const varPort = config_1.config.server.port;
mongoose_1.default
    .connect('mongodb://127.0.0.1:27017/MagneeDB')
    .then(() => {
    console.log(`mongoose connected on port ${varPort}`);
})
    .catch((error) => {
    console.log(`An error has occured in the Database connection , details below ${error}`);
});
const server = app_1.appObj.app.listen(varPort, () => {
    console.log(`App running on port ${varPort}`);
});
