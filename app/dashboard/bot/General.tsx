"use client";

import React, { useEffect } from "react";
import BotCardWrap from "./widgets/BotCardWrap";
import FormSwitch2 from "@/components/elements/form/FormSwitch2";
import CustomSelect2 from "./widgets/CustomSelect2";
import BasicButton from "@/components/elements/buttons/BasicButton";
import useReadUser from "@/lib/hooks/use-read-user";
import { useGetBot, useUpdateBot } from "@/lib/hooks/use-bot";
import { AutoRespondTo } from "@prisma/client";
import CircularPreloader from "@/components/ui/preloader";
import {
  useCreatorSettings,
  useUpdateCreatorSettings,
} from "@/lib/hooks/use-creator-settings";
import useBotGeneralSettingsStore from "@/lib/hooks/useGenerateBotSettings";
import SkeletonGeneral from "./widgets/skeleton-loading";

const General = ({ creatorId }: { creatorId: string }) => {
  const { user } = useReadUser();
  const { updateBot, updatingBot } = useUpdateBot();
  const { botSettings, botSettingsLoading, botSettingsError } =
    useGetBot(creatorId);

  const { updateCreatorSettings } = useUpdateCreatorSettings();
  const { creatorSettings, isLoadingSettings, getCreatorSettings } =
    useCreatorSettings();

  const {
    isActive,
    auto_respond_to,
    message_delay,
    greeting_message,
    follow_up_message,
    interaction_setting,
    isLoaded,
    response_style,
    setSettings,
    updateSetting,
    setIsLoaded,
  } = useBotGeneralSettingsStore();

  useEffect(() => {
    if (!isLoaded && botSettings && creatorSettings) {
      setSettings({
        isActive: botSettings?.isActive ?? false,
        auto_respond_to: botSettings?.autoRespondTo ?? AutoRespondTo.ALL,
        message_delay: botSettings?.messageDelay?.toString() ?? "",
        greeting_message: botSettings?.greetingMessageDelay?.toString() ?? "",
        follow_up_message: botSettings?.followUpMessageDelay?.toString() ?? "",
        customize_greeting: botSettings?.isGreetingMessageActive ?? false,
        customize_follow_up: botSettings?.isFollowUpMessageActive ?? false,
        custom_greeting_msg: botSettings?.greetingMessage ?? "",
        custom_follow_up_msg:
          creatorSettings?.followUpSettings?.followUpContent ?? "",
        userId: user?.id ?? "",
        interaction_setting: botSettings?.interactionSetting?.toString() ?? "2",
        response_style: Number(botSettings?.responseStyle) || 0,
      });
      setIsLoaded(true);
    }
  }, [botSettings, creatorSettings, user, setSettings, isLoaded, setIsLoaded]);

  const handleSaveSettings = async (): Promise<void> => {
    try {
      await updateBot({
        creatorId,
        data: {
          isActive,
          autoRespondTo: auto_respond_to,
          messageDelay: parseInt(message_delay, 10) || 0,
          greetingMessageDelay: parseInt(greeting_message, 10) || 0,
          followUpMessageDelay: parseInt(follow_up_message, 10) || 0,
          interactionSetting: parseInt(interaction_setting, 10),
        },
      });
      await updateCreatorSettings({
        creatorId,
        ctaData: {},
        followUpData: {
          followUpContent: creatorSettings?.followUpSettings?.followUpContent,
        },
      });
      await getCreatorSettings(creatorId);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleChange = (name: string, value: string | boolean): void => {
    switch (name) {
      case "isActive":
        updateSetting("isActive", value as boolean);
        break;
      case "auto_respond_to":
        updateSetting("auto_respond_to", value as AutoRespondTo);
        break;
      case "message_delay":
      case "greeting_message":
      case "follow_up_message":
        updateSetting(name, value as string);
        break;
      case "interaction_setting":
        updateSetting(name, value as string);
        break;
      default:
        console.warn(`Unhandled setting name: ${name}`);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      getCreatorSettings(creatorId);
    }
  }, [creatorId, getCreatorSettings, isLoaded]);

  if (botSettingsLoading || isLoadingSettings) {
    return <SkeletonGeneral />;
  }

  return (
    <div className={`flex flex-col gap-5`}>
      <BotCardWrap>
        <p>Activate bot</p>
        <FormSwitch2
          selfEnd
          switchChecked={isActive}
          switchId={"activate"}
          switchName={"isActive"}
          name="isActive"
          value={isActive.toString()}
          handleChange={handleChange}
          fieldsetId="activate-bot-fieldset"
        />
      </BotCardWrap>

      <BotCardWrap>
        <p>Auto respond to</p>
        <CustomSelect2
          selfEnd
          id={"autoRespond"}
          name="auto_respond_to"
          value={auto_respond_to}
          handleChange={handleChange}
        >
          <option value={AutoRespondTo.ALL}>Everyone</option>
          <option value={AutoRespondTo.FOLLOWERS}>Followers</option>
          <option value={AutoRespondTo.VERIFIED}>Verified</option>
          <option value={AutoRespondTo.NONE}>None</option>
        </CustomSelect2>
      </BotCardWrap>

      <BotCardWrap noFlex>
        <BotCardWrap
          padding={"first:pt-0 pt-3 pb-3"}
          border={"border-b-1 last:border-b-0 border-b-black/15"}
          shadow={" "}
          borderRadius={"rounded-0"}
        >
          <p>Message delay</p>
          <CustomSelect2
            selfEnd
            id={"messageDelay"}
            name="message_delay"
            value={message_delay.toString()}
            handleChange={handleChange}
          >
            <option value="0">Immediately</option>
            <option value="30000">30 seconds</option>
            <option value="120000">2 minutes</option>
            <option value="300000">5 minutes</option>
            <option value="900000">15 minutes</option>
            <option value="1800000">30 minutes</option>
            <option value="3600000">1 hour</option>
            <option value="10800000">3 hours</option>
            <option value="21600000">6 hours</option>
            <option value="43200000">12 hours</option>
          </CustomSelect2>
        </BotCardWrap>

        <BotCardWrap
          padding={"first:pt-0 pt-3 pb-3"}
          border={"border-b-1 last:border-b-0 border-b-black/15"}
          shadow={" "}
          borderRadius={"rounded-0"}
        >
          <p>Greeting message</p>
          <CustomSelect2
            selfEnd
            id={"greetingMessage"}
            name="greeting_message"
            value={greeting_message.toString()}
            handleChange={handleChange}
          >
            <option value="">Select timing</option>
            <option value="0">Immediately</option>
            <option value="3600000">1 hour after</option>
            <option value="86400000">1 day after</option>
            <option value="172800000">2 days after</option>
            <option value="259200000">3 days after</option>
            <option value="604800000">1 week after</option>
          </CustomSelect2>
        </BotCardWrap>

        <BotCardWrap
          padding={"first:pt-0 pt-3 pb-3"}
          border={"border-b-1 last:border-b-0 border-b-black/15"}
          shadow={" "}
          borderRadius={"rounded-0"}
        >
          <p>Follow up message</p>
          <CustomSelect2
            selfEnd
            id={"followUpMessage"}
            name="follow_up_message"
            value={follow_up_message.toString()}
            handleChange={handleChange}
          >
            <option value="0">Select timing</option>
            <option value="10800000">3 hours after</option>
            <option value="21600000">6 hours after</option>
            <option value="43200000">12 hours after</option>
            <option value="86400000">1 day after</option>
            <option value="172800000">2 days after</option>
            <option value="259200000">3 days after</option>
            <option value="604800000">1 week after</option>
            <option value="1209600000">2 weeks after</option>
          </CustomSelect2>
        </BotCardWrap>
        <BotCardWrap
          padding={"first:pt-0 pt-3 pb-3"}
          border={"border-b-1 last:border-b-0 border-b-black/15"}
          shadow={" "}
          borderRadius={"rounded-0"}
        >
          <p>Interaction setting</p>
          <input
            type="number"
            min="1"
            max="50"
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue4x"
            id="interactionSetting"
            name="interaction_setting"
            value={interaction_setting}
            onChange={(e) =>
              handleChange("interaction_setting", e.target.value)
            }
          />
        </BotCardWrap>
        <br />

        <div className="flex justify-end">
          <BasicButton
            handleClick={handleSaveSettings}
            width={
              "w-fit xs:w-full hover:scale-90 duration-300 transition-all ease-in-out"
            }
            fontType={"mulish--semibold"}
            textColor={"text-white"}
            fontSize={"text-sm"}
            borderRadius={"rounded-lg"}
            padding={`py-2.5 px-7`}
            text={"Save"}
            bgColor={"bg-brandBlue4x"}
            disabled={updatingBot}
          />
        </div>
      </BotCardWrap>
    </div>
  );
};

export default General;
