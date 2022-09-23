"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appObj = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./routes/userRoutes");
const propertyRoutes_1 = require("./routes/propertyRoutes");
const bookingRoutes_1 = require("./routes/bookingRoutes");
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1/users', userRoutes_1.userRoutesExports.router);
app.use('/api/v1/properties', propertyRoutes_1.propertyRoutesExports.router);
app.use('/api/v1/bookings', bookingRoutes_1.bookingRoutesExports.router);
exports.appObj = {
    app: app,
};
