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
exports.getAvatarId = exports.getCustomAvatarId = void 0;
exports.getVoiceId = getVoiceId;
exports.startStatusPolling = startStatusPolling;
const axios_1 = __importDefault(require("axios"));
const GET_ALL_AVATARS_URL = "https://api.heygen.com/v2/avatars";
//// PROCESSING STATUS
// Get exact status of (processing) video
function extractStatus(response) {
    var _a, _b;
    return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status) || "unknown";
}
// Checks video status from HeyGen
function checkVideoStatus(video_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://api.heygen.com/v1/video_status.get', {
                params: { video_id },
                headers: {
                    'X-Api-Key': process.env.HEYGEN_API_KEY || ''
                }
            });
            console.log("Video Status:", extractStatus(response));
        }
        catch (error) {
            console.error("Error checking video status:", error);
        }
    });
}
const getCustomAvatarId = () => __awaiter(void 0, void 0, void 0, function* () {
    return 'placeholder';
});
exports.getCustomAvatarId = getCustomAvatarId;
//// GET AVATAR & VOICE INFO
const getGroupId = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get("https://api.heygen.com/v2/avatar_group.list", {
            headers: {
                'accept': 'application/json',
                'X-Api-Key': process.env.HEYGEN_API_KEY || ''
            }
        });
        const avatarGroups = response.data.data.avatar_group_list;
        const targetGroup = avatarGroups
            .filter((avatar) => avatar.name.includes("New Kareem Avatar 11-05-2024"));
        return targetGroup[0].id;
    }
    catch (error) {
        console.error("Error getting group ID:", error);
        return '';
    }
});
const getAvatarId = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group_id = yield getGroupId();
        console.log("Group ID: ", group_id);
        const response = yield axios_1.default.get(`https://api.heygen.com/v2/avatar_group/${group_id}/avatars`, {
            headers: {
                'accept': 'application/json',
                'X-Api-Key': process.env.HEYGEN_API_KEY || '',
            }
        });
        const avatars = response.data.data.avatar_list;
        const targetAvatar = avatars
            .filter((avatar) => avatar.avatar_name.includes("kareem_look_1"));
        return targetAvatar[0].avatar_id;
    }
    catch (error) {
        console.error("Error getting Avatar ID using Group ID: ", error);
        return '';
    }
});
exports.getAvatarId = getAvatarId;
function getVoiceId() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get("https://api.heygen.com/v2/voices", {
                headers: {
                    'Accept': 'application/json',
                    'X-Api-Key': process.env.HEYGEN_API_KEY || ''
                }
            });
            const voiceList = response.data.data.voices;
            const targetVoice = voiceList.find((avatar) => avatar.name === "Kareem Professional");
            return targetVoice ? [targetVoice.voice_id] : [];
        }
        catch (error) {
            console.error("Error fetching voices:", error);
            return [];
        }
    });
}
// Polls the video status every minute
function startStatusPolling(video_id) {
    checkVideoStatus(video_id);
    return setInterval(() => {
        checkVideoStatus(video_id);
    }, 5000);
}
