import { AvatarSettings, Offset, RequestBody, TextVoiceSettings, Scene, HeyGenResponse, Dimension } from "./interfaces/HeyGenRequest";
import axios from "axios";
import { getAvatarId, getVoiceId, startStatusPolling } from "./utils";

const content = "Hi Deborah, this greeting was generated from Jeremy's video generation service. One small step for man, one big leap for Iconomy.";

const dimension: Dimension = {
  width: 1280,
  height: 720
};

const offset: Offset = {
  x: 0.0,
  y: 0.0,
}

const AvatarConfig = async (): Promise<AvatarSettings> => {
  const avatarId = await getAvatarId();
  console.log("Avatar ID: ", avatarId);

  const avatar_config: AvatarSettings = {
    type: "avatar", // static
    avatar_id: avatarId,
    scale: 1.0, // default
    offset: offset, // default
  }

  return avatar_config;
}

const VoiceConfig = async (): Promise<TextVoiceSettings> => {
  const voice_id = await getVoiceId();
  console.log("Voice ID: ", voice_id);

  const voice_config: TextVoiceSettings = {
    type: "text", //static
    voice_id: voice_id[0],
    input_text: content,
    emotion: "excited",
  }

  return voice_config;
}

const CreateScene = async (): Promise<Scene> => {
  const avatar_config = await AvatarConfig();
  console.log("Avatar Config: ", avatar_config);

  const voice_config = await VoiceConfig();
  console.log("Voice Config: ", voice_config)

  const scene: Scene = {
    character: avatar_config,
    voice: voice_config,
  };

  return scene;
}
const buildRequest = async (): Promise<RequestBody> => {
  const scene = await CreateScene();
  const request_body: RequestBody = {
    video_inputs: [
      scene
    ],
    dimension: dimension
  };

  return request_body;
}


async function generateVideo(requestBody: RequestBody): Promise<string> {
  try {
    const response = await axios.post('https://api.heygen.com/v2/video/generate', requestBody, {
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY || '',
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const res: HeyGenResponse = response.data.data;

    return res.video_id;
  } catch (error) {
    console.error("Error generating video")

    return "";
  }
}


export async function createVideo() {
  const request = await buildRequest();
  const video_url = await generateVideo(request);
  console.log("Generated Video ID: ", video_url);
  startStatusPolling(video_url);

  return;
}

