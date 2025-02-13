import { create } from "zustand";
import { AutoRespondTo } from "@prisma/client";

interface BotGeneralSettings {
  isActive: boolean;
  auto_respond_to: AutoRespondTo;
  message_delay: string;
  greeting_message: string;
  follow_up_message: string;
  customize_greeting: boolean;
  custom_greeting_msg: string;
  customize_follow_up: boolean;
  custom_follow_up_msg: string;
  interaction_setting: string;
  time_zone: string;
  schedule: boolean;
  from: string;
  to: string;
  days: string;
  userId: string;
  response_style: number;
}

interface BotGeneralSettingsStore extends BotGeneralSettings {
  isLoaded: boolean;
  setSettings: (settings: Partial<BotGeneralSettings>) => void;
  updateSetting: <K extends keyof BotGeneralSettings>(
    key: K,
    value: BotGeneralSettings[K]
  ) => void;
  resetSettings: () => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

const initialSettings: BotGeneralSettings = {
  isActive: false,
  auto_respond_to: AutoRespondTo.ALL,
  message_delay: "",
  greeting_message: "",
  follow_up_message: "",
  customize_greeting: false,
  custom_greeting_msg: "",
  customize_follow_up: false,
  custom_follow_up_msg: "",
  interaction_setting: "10",
  time_zone: "",
  schedule: false,
  from: "",
  to: "",
  days: "",
  userId: "",
  response_style: 0,
};

const useBotGeneralSettingsStore = create<BotGeneralSettingsStore>((set) => ({
  ...initialSettings,
  isLoaded: false,
  setSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
  updateSetting: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetSettings: () => set({ ...initialSettings, isLoaded: false }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));

export default useBotGeneralSettingsStore;
