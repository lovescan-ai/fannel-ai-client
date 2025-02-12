export interface InstagramParticipant {
  id: string;
  username?: string;
}

export interface InstagramMessage {
  id: string;
  from: {
    id: string;
    username?: string;
  };
  to: {
    data: [
      {
        username: string;
        id: string;
      }
    ];
  };
  message: string;
  created_time: string;
}

export interface InstagramErrorResponse {
  error?: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

export interface InstagramUserInfo {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export interface InstagramMessage {
  id: string;
  from: {
    id: string;
    username?: string;
  };
  message: string;
  created_time: string;
}

export interface InstagramConversation {
  id: string;

  participants: {
    data: InstagramParticipant[];
  };
  messages: {
    data: InstagramMessage[];
  };
}

export interface InstagramConversations {
  id: string;
  updated_time: string;
}

export interface SendDMWithTemplateResponse {
  recipient_id: string;
  message_id: string;
}

export interface Participants {
  username: string;
  avatarUrl: string;
  userId: string;
  conversationId: string;
  messages: InstagramMessage[];
  updatedAt: string;
}
export interface instagramConversationThread {
  participants: Participants[];
}

export interface UserProfile {
  username: string;
  profile_picture_url: string;
  id: string;
}

export interface InstagramUserProfile {
  username: string;
  full_name: string;
  biography: string;
  profile_pic_url: string;
  is_private: boolean;
  followers_count: number;
  followees_count: number;
  media_count: number;
  user_id: number;
  is_verified: boolean;
}

export interface ShortLink {
  id: string;
  domain: string;
  key: string;
  externalId: string | null;
  url: string;
  expiresAt: string | null;
  expiredUrl: string | null;
  password: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  video: string | null;
  ios: string | null;
  android: string | null;
  geo: string | null;
  tagId: string | null;
  tags: string[];
  comments: string | null;
  shortLink: string;
  qrCode: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  userId: string;
  workspaceId: string;
  lastClicked: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  trackConversion: boolean;
  archived: boolean;
  proxy: boolean;
  rewrite: boolean;
  doIndex: boolean;
  publicStats: boolean;
  clicks: number;
  leads: number;
  sales: number;
  saleAmount: number;
}
