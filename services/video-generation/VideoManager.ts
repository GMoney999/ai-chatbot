import axios from "axios";

const VIDEO_LIST_ENDPOINT = "https://api.heygen.com/v1/video.list?limit=5";

export const getVideoList = async (): Promise<string[]> => {
  try {
    const response = await axios.get(VIDEO_LIST_ENDPOINT, {
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.HEYGEN_API_KEY || '',
      }
    });

    const res = response.data.data.videos;
    return [res];
  } catch (error) {
    console.log("Error fetching video list:", error);
    return [];
  }
}