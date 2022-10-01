"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true, minlength: 4 },
    password: { type: String, required: true },
    firstName: { type: String, required: true, minlength: 2 },
    lastName: { type: String, required: true, minlength: 2 }
});
var UserModel = (0, mongoose_1.model)('User', UserSchema);
exports["default"] = UserModel;
