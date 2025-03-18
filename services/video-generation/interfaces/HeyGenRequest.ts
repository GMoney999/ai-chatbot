
export interface RequestBody {
  caption?: boolean;
  title?: string;
  callback_id?: string;
  video_inputs: [Scene];
  dimension: Dimension,
  folder_id?: string;
  callback_url?: string;
}

export interface Scene {
  character?: AvatarSettings | TalkingPhotoSettings;
  voice: TextVoiceSettings | AudioVoiceSettings | SilenceVoiceSettings;
  background?: ColorBackground | ImageBackground | VideoBackground;
}

export interface AvatarSettings {
  type: string;
  avatar_id: string;
  scale: number;
  avatar_style?: CharacterRenderType;
  offset: Offset;
  matting?: boolean;
  circle_background_color?: string;
}

export interface TalkingPhotoSettings {
  type: "talking_photo";
  talking_photo_id: string;
  scale: number;
  talking_photo_style?: TACropStyle;
  offset: Offset;
  talking_style: TPExpression;
  expression: TPExpressionStyle;
  matting?: boolean;
  circle_background_color?: string;
}

export interface TextVoiceSettings {
  type: string;
  voice_id: string;
  input_text: string;
  speed?: number;
  pitch?: number;
  emotion?: string;
  local?: string;
}

export interface AudioVoiceSettings {
  type: "audio";
  audio_url?: string;
  audio_asset_id?: string;
}

export interface SilenceVoiceSettings {
  type: "silence";
  duration: number;
}

export interface ColorBackground {
  type: "color";
  value: string;
} 

export interface ImageBackground {
  type: "image";
  url?: string;
  image_asset_id?: string;
  fit?: string;
}

export interface VideoBackground {
  type: "video";
  url?: string;
  video_asset_id?: string;
  play_style: VideoBackground;
  fit?: string;
}

export interface CharacterRenderType {
  
}

export interface Offset {
  x: number;
  y: number;
}

export interface Dimension {
  width: number;
  height: number;
}

export interface TACropStyle {

}

export interface TPExpression {
  
}

export interface TPExpressionStyle {

}

export interface VideoPlayback {

}

export interface HeyGenResponse {
  video_id: string;
}

