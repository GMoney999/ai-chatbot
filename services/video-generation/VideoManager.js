"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoList = void 0;
const axios_1 = __importDefault(require("axios"));
const VIDEO_LIST_ENDPOINT = "https://api.heygen.com/v1/video.list?limit=5";
const getVideoList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(VIDEO_LIST_ENDPOINT, {
            headers: {
                'accept': 'application/json',
                'X-Api-Key': process.env.HEYGEN_API_KEY || '',
            }
        });
        const res = response.data.data.videos;
        return [res];
    }
    catch (error) {
        console.log("Error fetching video list:", error);
        return [];
    }
});
exports.getVideoList = getVideoList;
