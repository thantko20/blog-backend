"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONOGO_URI = process.env.MONGO_URI;
mongoose_1.default.connect(MONOGO_URI);
const db = mongoose_1.default.connection;
db.on('error', () => console.error('Mongo DB connection error'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Hello world!');
});
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
