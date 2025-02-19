"use client";
import React, { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useUploadThing } from "@/utils/uploadthing";
import { useGetBot, useUpdateBot } from "@/lib/hooks/use-bot";
import BotCardWrap from "./widgets/BotCardWrap";
import FormSwitch2 from "@/components/elements/form/FormSwitch2";
import TextareaAutosize from "react-textarea-autosize";
import BasicButton from "@/components/elements/buttons/BasicButton";
import SelectPicIcon from "@/components/ui/icons/select-pic";
import {
  useCreatorSettings,
  useUpdateCreatorSettings,
} from "@/lib/hooks/use-creator-settings";
import Skeleton from "@/components/ui/skeleton";

import InstagramPreview from "./message-preview";
import useCustomizationStore from "@/lib/hooks/useCustomizationStore";
import MessageHeader from "./message-header";

const Customization = ({ creatorId }: { creatorId: string }) => {
  const [componentLoaded, setComponentLoaded] = useState(false);
  const { updateBot, updatingBot } = useUpdateBot();
  const { botSettings, botSettingsLoading } = useGetBot(creatorId);

  const { creatorSettings, getCreatorSettings, isLoadingSettings } =
    useCreatorSettings();
  const { updateCreatorSettings, isUpdatingSettings } =
    useUpdateCreatorSettings();

  const { settings, isLoaded, setSettings, updateSetting, setIsLoaded } =
    useCustomizationStore();

  const [previewImages, setPreviewImages] = React.useState({
    cta: "",
    follow_up: "",
  });

  const ctaFileInputRef = useRef<HTMLInputElement>(null);
  const followUpFileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload: startCTAUpload, isUploading: isCTAUploading } =
    useUploadThing("imageUploader");
  const { startUpload: startFollowUpUpload, isUploading: isFollowUpUploading } =
    useUploadThing("imageUploader");

  const loadSettings = useCallback(() => {
    if (creatorSettings && botSettings) {
      setSettings({
        customize_greeting: botSettings.isGreetingMessageActive ?? false,
        custom_greeting_msg: botSettings.greetingMessage ?? "",
        customize_follow_up: botSettings.isFollowUpMessageActive ?? false,
        custom_follow_up_msg:
          creatorSettings.followUpSettings?.followUpContent ?? "",
        follow_up_image_url:
          creatorSettings.followUpSettings?.followUpImageUrl ?? "",
        customize_cta: !!(
          creatorSettings.ctaSettings || creatorSettings.followUpSettings
        ),
        cta_button_label: creatorSettings.ctaSettings?.ctaButtonLabel || "",
        cta_button_link: creatorSettings.ctaSettings?.ctaButtonLink || "",
        cta_message: creatorSettings.ctaSettings?.ctaContent || "",
        followup_button_link:
          creatorSettings.followUpSettings?.followUpButtonLink || "",
        followup_button_label:
          creatorSettings.followUpSettings?.followUpButtonLabel || "",
        cta_image_url: creatorSettings.ctaSettings?.ctaImageUrl || "",
      });
    }
  }, [creatorSettings, botSettings, setSettings]);

  useEffect(() => {
    if (!isLoaded && !isLoadingSettings && !botSettingsLoading) {
      loadSettings();
    }
  }, [isLoaded, isLoadingSettings, botSettingsLoading, loadSettings]);

  const handleChange = (
    key: keyof typeof settings,
    value: string | boolean | number
  ): void => {
    updateSetting(key, value);
  };

  const handleSwitchChange = (name: string, value: boolean): void => {
    updateSetting(name as keyof typeof settings, value);
  };

  const handleImageSelect = (type: "cta" | "follow_up") => {
    const fileInput = type === "cta" ? ctaFileInputRef : followUpFileInputRef;
    fileInput.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "cta" | "follow_up" | "greeting"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => ({
        ...prev,
        [type]: objectUrl,
      }));

      try {
        const uploadRes =
          type === "cta"
            ? await startCTAUpload([file])
            : await startFollowUpUpload([file]);

        if (uploadRes && uploadRes[0]) {
          updateSetting(
            `${type}_image_url` as keyof typeof settings,
            uploadRes[0].url
          );
        }
      } catch (error) {
        console.error(`Error uploading ${type} image:`, error);
      }
    }
  };

  const handleRemoveImage = (type: "cta" | "follow_up") => {
    const fileInput = type === "cta" ? ctaFileInputRef : followUpFileInputRef;
    if (fileInput.current) {
      fileInput.current.value = "";
    }
    setPreviewImages((prev) => ({
      ...prev,
      [type]: "",
    }));
    updateSetting(`${type}_image_url` as keyof typeof settings, "");
  };

  const handleSaveSettings = async (
    section?: "greeting" | "follow_up" | "cta"
  ): Promise<void> => {
    try {
      if (section === "greeting") {
        await updateBot({
          creatorId,
          data: {
            isGreetingMessageActive: settings.customize_greeting,
            greetingMessage: settings.custom_greeting_msg,
          },
        });
      } else if (section === "follow_up") {
        updateCreatorSettings({
          creatorId,
          ctaData: {},
          followUpData: {
            followUpButtonLabel: settings.followup_button_label,
            followUpButtonLink: settings.followup_button_link,
            followUpContent: settings.custom_follow_up_msg,
            followUpImageUrl: settings.follow_up_image_url,
          },
        });
        updateBot({
          creatorId,
          data: {
            isFollowUpMessageActive: settings.customize_follow_up,
          },
        });
      } else if (section === "cta") {
        updateCreatorSettings({
          creatorId,
          ctaData: {
            ctaButtonLabel: settings.cta_button_label,
            ctaButtonLink: settings.cta_button_link,
            ctaContent: settings.cta_message,
            ctaImageUrl: settings.cta_image_url,
          },
          followUpData: {},
        });
      } else {
        updateCreatorSettings({
          creatorId,
          ctaData: {
            ctaButtonLabel: settings.cta_button_label,
            ctaButtonLink: settings.cta_button_link,
            ctaContent: settings.cta_message,
          },
          followUpData: {
            followUpButtonLabel: settings.followup_button_label,
            followUpButtonLink: settings.followup_button_link,
            followUpContent: settings.custom_follow_up_msg,
            followUpImageUrl: settings.follow_up_image_url,
          },
        });
        updateBot({
          creatorId,
          data: {
            isGreetingMessageActive: settings.customize_greeting,
            greetingMessage: settings.custom_greeting_msg,
            isFollowUpMessageActive: settings.customize_follow_up,
          },
        });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      getCreatorSettings(creatorId);
    }
  }, [creatorId, isLoaded, getCreatorSettings]);

  const renderImagePreview = (type: "cta" | "follow_up" | "greeting") =>
    type !== "greeting" && (
      <div className="w-20 mb-2 h-20 rounded-md relative flex-shrink-0">
        {previewImages[type] ||
        settings[`${type}_image_url` as keyof typeof settings] ? (
          <>
            <Image
              src={
                (previewImages[type] ||
                  settings[`${type}_image_url` as keyof typeof settings] ||
                  "") as string
              }
              alt={`${type} preview`}
              fill
              className="rounded-md object-cover"
            />
            <button
              onClick={() => handleRemoveImage(type)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
      </div>
    );

  const renderMessageInput = (type: "cta" | "follow_up" | "greeting") => (
    <div className="bg-white rounded-10 border-1 border-brandGray28x px-7 py-4">
      <div className="flex items-center gap-4">
        <div className="flex-grow relative">
          <TextareaAutosize
            value={
              settings[
                `${
                  type === "follow_up"
                    ? "custom_follow_up_msg"
                    : type === "greeting"
                    ? "custom_greeting_msg"
                    : "cta_message"
                }` as keyof typeof settings
              ] as string
            }
            onChange={(e) =>
              handleChange(
                `${
                  type === "cta"
                    ? "cta_message"
                    : type === "greeting"
                    ? "custom_greeting_msg"
                    : "custom_follow_up_msg"
                }` as keyof typeof settings,
                e.target.value
              )
            }
            minRows={1}
            maxRows={4}
            id={`${type}Msg`}
            name={`${
              type === "cta"
                ? "cta_message"
                : type === "greeting"
                ? "custom_greeting_msg"
                : "custom_follow_up_msg"
            }`}
            placeholder={`Type a ${
              type === "cta"
                ? "cta"
                : type === "greeting"
                ? "greeting"
                : "follow up"
            } message....`}
            className="resize-none w-full placeholder:text-brandGray29x mulish--medium bg-transparent focus:outline-none focus:border-0 border-0 outline-0 pr-10"
          />
          <div className="absolute right-0 bottom-0">
            <input
              type="file"
              ref={type === "cta" ? ctaFileInputRef : followUpFileInputRef}
              onChange={(e) => handleFileChange(e, type)}
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
            />
            {(type === "follow_up" || type === "cta") && (
              <button
                type="button"
                onClick={() => handleImageSelect(type)}
                className="hover:scale-90 duration-300 transition-all ease-in-out"
              >
                <SelectPicIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCtaInput = (
    label: string,
    key: keyof typeof settings,
    placeholder: string
  ) => (
    <div className="bg-white rounded-10 border-1 border-brandGray28x px-7 py-4 mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={settings[key] as string}
        onChange={(e) => handleChange(key, e.target.value)}
        placeholder={placeholder}
        className="w-full placeholder:text-brandGray29x mulish--medium bg-transparent focus:outline-none focus:border-0 border-0 outline-0"
      />
    </div>
  );

  const renderSkeletonLoader = () => (
    <div className="space-y-4">
      <Skeleton height="24px" width="150px" />
      <Skeleton height="100px" />
      <Skeleton height="24px" width="150px" />
      <Skeleton height="100px" />
      <Skeleton height="24px" width="200px" />
      <Skeleton height="150px" />
    </div>
  );

  const renderSection = (type: "greeting" | "follow_up" | "cta") => (
    <div className="relative z-50">
      <MessageHeader type={type} />
      <BotCardWrap noFlex>
        {botSettingsLoading || isLoadingSettings ? (
          renderSkeletonLoader()
        ) : (
          <>
            <BotCardWrap
              padding="first:pt-0 last:pb-0 pt-2 pb-2"
              shadow=" "
              borderRadius="rounded-0"
            >
              <p>
                Customize{" "}
                {type === "greeting"
                  ? "greeting"
                  : type === "follow_up"
                  ? "follow-up"
                  : "CTA"}{" "}
                message
              </p>
              <FormSwitch2
                selfEnd
                switchChecked={settings[`customize_${type}`] as boolean}
                switchId={type}
                switchName={`customize_${type}`}
                value={String(settings[`customize_${type}`] ?? false)}
                handleChange={handleSwitchChange}
                fieldsetId={`${type}Fieldset`}
              />
            </BotCardWrap>

            {settings[`customize_${type}`] && (
              <>
                {renderImagePreview(type as "cta" | "follow_up" | "greeting")}

                <div className="mb-4">
                  {renderMessageInput(type as "cta" | "follow_up" | "greeting")}
                </div>

                {type === "follow_up" && (
                  <>
                    {renderCtaInput(
                      "Follow-up Button Link",
                      "followup_button_link",
                      "Enter follow up button url"
                    )}
                    {renderCtaInput(
                      "Follow-up Button Label",
                      "followup_button_label",
                      "Enter follow up button text"
                    )}
                  </>
                )}
                {type === "cta" && (
                  <>
                    {renderCtaInput(
                      "CTA Button Link",
                      "cta_button_link",
                      "Enter cta button url"
                    )}
                    {renderCtaInput(
                      "CTA Button Label",
                      "cta_button_label",
                      "Enter cta button text"
                    )}
                  </>
                )}
                <div className="flex justify-end mt-4">
                  <BasicButton
                    width="w-fit mr-2"
                    fontType="mulish--semibold"
                    textColor="text-brandBlue4x"
                    fontSize="text-sm"
                    borderRadius="rounded-xl border-1 border-brandBlue4x"
                    padding="py-2 px-7"
                    text="Cancel"
                    bgColor="bg-transparent"
                  />
                  <BasicButton
                    width="w-fit"
                    fontType="mulish--semibold"
                    textColor="text-white"
                    fontSize="text-sm"
                    borderRadius="rounded-xl"
                    padding="py-2 px-7"
                    text={
                      updatingBot || isUpdatingSettings
                        ? "Saving..."
                        : type === "cta" && isCTAUploading
                        ? "Uploading..."
                        : type === "follow_up" && isFollowUpUploading
                        ? "Uploading..."
                        : "Save"
                    }
                    bgColor="bg-brandBlue4x"
                    handleClick={() => handleSaveSettings(type)}
                    disabled={
                      (type === "cta" && isCTAUploading) ||
                      (type === "follow_up" && isFollowUpUploading) ||
                      updatingBot ||
                      isUpdatingSettings
                    }
                  />
                </div>
              </>
            )}
          </>
        )}
      </BotCardWrap>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setComponentLoaded(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 bg-red-500 static z-10">
      {/* <CircularPreloader isLoading={updatingBot || isUpdatingSettings} /> */}

      {renderSection("greeting")}
      {renderSection("cta")}
      {renderSection("follow_up")}

      {componentLoaded && (
        <div className="md:absolute md:block hidden md:right-4 max-w-lg w-full bg-white opacity-100 transition-all ease-in-out duration-300 -z-1">
          <InstagramPreview
            greetingMessage={settings.custom_greeting_msg}
            ctaMessage={settings.cta_message}
            ctaButtonLabel={settings.cta_button_label}
            followupButtonLabel={settings.followup_button_label}
            followUpMessage={settings.custom_follow_up_msg}
            ctaPreviewImg={settings.cta_image_url}
            followUpPreviewImg={settings.follow_up_image_url}
          />
        </div>
      )}
    </div>
  );
};

export default Customization;
