import axios from "axios";
import { RequestBody, HeyGenResponse } from "./interfaces/HeyGenRequest";

const GET_ALL_AVATARS_URL = "https://api.heygen.com/v2/avatars";



//// PROCESSING STATUS
// Get exact status of (processing) video
function extractStatus(response: any): string {
  return response.data?.data?.status || "unknown";
}

// Checks video status from HeyGen
async function checkVideoStatus(video_id: string): Promise<void> {
  try {
    const response = await axios.get('https://api.heygen.com/v1/video_status.get', {
      params: { video_id },
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY || ''
      }
    });

    console.log("Video Status:", extractStatus(response));
  } catch (error) {
    console.error("Error checking video status:", error);
  }
}

export const getCustomAvatarId = async (): Promise<string> => {
  return 'placeholder'
}


//// GET AVATAR & VOICE INFO
const getGroupId = async (): Promise<string> => {
  try {
    const response = await axios.get("https://api.heygen.com/v2/avatar_group.list", {
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.HEYGEN_API_KEY || ''
      }
    });

    const avatarGroups = response.data.data.avatar_group_list;

    const targetGroup = avatarGroups
      .filter((avatar: any) => avatar.name.includes("New Kareem Avatar 11-05-2024"));

    return targetGroup[0].id;
  } catch (error) {
    console.error("Error getting group ID:", error)
    return '';
  }
}

export const getAvatarId = async (): Promise<string> => {
  try {
    const group_id = await getGroupId();
    console.log("Group ID: ", group_id);
    const response = await axios.get(`https://api.heygen.com/v2/avatar_group/${group_id}/avatars`, {
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.HEYGEN_API_KEY || '',
      }
    });

    const avatars = response.data.data.avatar_list;

    const targetAvatar = avatars 
      .filter((avatar: any) => avatar.avatar_name.includes("kareem_look_1"));

    return targetAvatar[0].avatar_id;
    
  } catch (error) {
    console.error("Error getting Avatar ID using Group ID: ", error)
    return '';
  }
}

export async function getVoiceId(): Promise<string[]> {
  try {
    const response = await axios.get("https://api.heygen.com/v2/voices", {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': process.env.HEYGEN_API_KEY || ''
      }
    });
  
    const voiceList = response.data.data.voices;
    const targetVoice = voiceList.find((avatar: any) => avatar.name === "Kareem Professional");
  
    return targetVoice ? [targetVoice.voice_id] : [];
  } catch (error) {
    console.error("Error fetching voices:", error);
    return [];
  }
}


// Polls the video status every minute
export function startStatusPolling(video_id: string): NodeJS.Timer {
  checkVideoStatus(video_id);

  return setInterval(() => {
    checkVideoStatus(video_id);
  }, 5000)
}
