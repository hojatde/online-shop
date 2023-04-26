"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUploadImages = void 0;
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    }, filename: (req, file, cb) => {
        const current_date = (new Date()).valueOf().toString();
        const x = crypto_1.default.createHash('sha1').update(current_date).digest('hex');
        cb(null, x + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const uploadImages = (0, multer_1.default)({ storage: fileStorage, fileFilter: fileFilter }).fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]);
const postUploadImages = (req, res, next) => {
    uploadImages(req, res, (err) => {
        if (err) {
            console.log(err);
        }
        next();
    });
};
exports.postUploadImages = postUploadImages;
