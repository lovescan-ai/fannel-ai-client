import { create } from "zustand";

interface CustomizationSettings {
  customize_greeting: boolean;
  custom_greeting_msg: string;
  customize_follow_up: boolean;
  custom_follow_up_msg: string;
  greeting_image_url?: string;
  follow_up_image_url?: string;
  customize_cta: boolean;
  cta_button_label: string;
  cta_button_link: string;
  followup_button_label: string;
  cta_message: string;
  followup_button_link: string;
  response_style: number;
}

interface CustomizationStore {
  settings: CustomizationSettings;
  isLoaded: boolean;
  setSettings: (settings: Partial<CustomizationSettings>) => void;
  updateSetting: <K extends keyof CustomizationSettings>(
    key: K,
    value: CustomizationSettings[K]
  ) => void;
  resetSettings: () => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

const initialSettings: CustomizationSettings = {
  customize_greeting: false,
  custom_greeting_msg: "",
  customize_follow_up: false,
  custom_follow_up_msg: "",
  greeting_image_url: "",
  follow_up_image_url: "",
  customize_cta: false,
  cta_button_label: "",
  cta_button_link: "",
  followup_button_label: "",
  cta_message: "",
  followup_button_link: "",
  response_style: 0.5,
};

const useCustomizationStore = create<CustomizationStore>((set) => ({
  settings: initialSettings,
  isLoaded: false,
  setSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
      isLoaded: true,
    })),
  updateSetting: (key, value) =>
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    })),
  resetSettings: () => set({ settings: initialSettings, isLoaded: false }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));

export default useCustomizationStore;
