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
exports.createVideo = createVideo;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const content = "Hi Deborah, this greeting was generated from Jeremy's video generation service. One small step for man, one big leap for Iconomy.";
const dimension = {
    width: 1280,
    height: 720
};
const offset = {
    x: 0.0,
    y: 0.0,
};
const AvatarConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const avatarId = yield (0, utils_1.getAvatarId)();
    console.log("Avatar ID: ", avatarId);
    const avatar_config = {
        type: "avatar", // static
        avatar_id: avatarId,
        scale: 1.0, // default
        offset: offset, // default
    };
    return avatar_config;
});
const VoiceConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const voice_id = yield (0, utils_1.getVoiceId)();
    console.log("Voice ID: ", voice_id);
    const voice_config = {
        type: "text", //static
        voice_id: voice_id[0],
        input_text: content,
        emotion: "Excited"
    };
    return voice_config;
});
const CreateScene = () => __awaiter(void 0, void 0, void 0, function* () {
    const avatar_config = yield AvatarConfig();
    console.log("Avatar Config: ", avatar_config);
    const voice_config = yield VoiceConfig();
    console.log("Voice Config: ", voice_config);
    const scene = {
        character: avatar_config,
        voice: voice_config,
    };
    return scene;
});
const buildRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    const scene = yield CreateScene();
    console.log("Scene: ", scene);
    const request_body = {
        video_inputs: [
            scene
        ],
        dimension: dimension
    };
    return request_body;
});
function generateVideo(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post('https://api.heygen.com/v2/video/generate', requestBody, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.HEYGEN_API_KEY || '',
                }
            });
            const res = response.data.data;
            return res.video_id;
        }
        catch (error) {
            console.error("Error generating video");
            return "ERROR";
        }
    });
}
function createVideo() {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield buildRequest();
        const video_url = yield generateVideo(request);
        if (video_url === "ERROR") {
            return;
        }
        (0, utils_1.startStatusPolling)(video_url);
        return;
    });
}
