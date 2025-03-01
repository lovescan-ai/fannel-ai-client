"use client";

import AuthText from "@/components/elements/sections/AuthText";
import React, { useState, useEffect } from "react";
import ConnectSocialBtn from "@/components/elements/buttons/ConnectSocialsBtn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomSelect from "../../dashboard/bot/widgets/CustomSelect";
import useConnectSocial from "@/lib/hooks/use-connect-social";
import { useViewCreators } from "@/lib/hooks/use-creator";
import { ClipLoader } from "react-spinners";
import { Creator } from "@prisma/client";
import { pageTracker } from "@/lib/kv/actions";
import { toast } from "sonner";

const socials = [
  {
    id: "instagram",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_3204_2290)">
          <path
            d="M2.50001 2.72166C-0.643327 5.98666 6.57141e-06 9.455 6.57141e-06 19.9917C6.57141e-06 28.7417 -1.52666 37.5133 6.46334 39.5783C8.95834 40.22 31.065 40.22 33.5567 39.575C36.8833 38.7167 39.59 36.0183 39.96 31.3133C40.0117 30.6567 40.0117 9.33833 39.9583 8.66833C39.565 3.65666 36.48 0.768329 32.415 0.183329C31.4833 0.0483293 31.2967 0.00832928 26.5167 -4.05312e-06C9.56167 0.00832928 5.84501 -0.746671 2.50001 2.72166Z"
            fill="url(#paint0_linear_3204_2290)"
          />
          <path
            d="M19.9967 5.23166C13.945 5.23166 8.19835 4.69333 6.00335 10.3267C5.09668 12.6533 5.22835 15.675 5.22835 20.0017C5.22835 23.7983 5.10668 27.3667 6.00335 29.675C8.19335 35.3117 13.9867 34.7717 19.9933 34.7717C25.7883 34.7717 31.7634 35.375 33.985 29.675C34.8934 27.325 34.76 24.3483 34.76 20.0017C34.76 14.2317 35.0784 10.5067 32.28 7.70999C29.4467 4.87666 25.615 5.23166 19.99 5.23166H19.9967ZM18.6733 7.89333C31.2967 7.87333 32.9033 6.47 32.0167 25.965C31.7017 32.86 26.4517 32.1033 19.9983 32.1033C8.23168 32.1033 7.89335 31.7667 7.89335 19.995C7.89335 8.08666 8.82668 7.89999 18.6733 7.88999V7.89333ZM27.88 10.345C26.9017 10.345 26.1083 11.1383 26.1083 12.1167C26.1083 13.095 26.9017 13.8883 27.88 13.8883C28.8583 13.8883 29.6517 13.095 29.6517 12.1167C29.6517 11.1383 28.8583 10.345 27.88 10.345ZM19.9967 12.4167C15.8083 12.4167 12.4133 15.8133 12.4133 20.0017C12.4133 24.19 15.8083 27.585 19.9967 27.585C24.185 27.585 27.5784 24.19 27.5784 20.0017C27.5784 15.8133 24.185 12.4167 19.9967 12.4167ZM19.9967 15.0783C26.505 15.0783 26.5133 24.925 19.9967 24.925C13.49 24.925 13.48 15.0783 19.9967 15.0783Z"
            fill="white"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_3204_2290"
            x1="2.57671"
            y1="37.4452"
            x2="39.7525"
            y2="5.26996"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFDD55" />
            <stop offset="0.5" stopColor="#FF543E" />
            <stop offset="1" stopColor="#C837AB" />
          </linearGradient>
          <clipPath id="clip0_3204_2290">
            <rect width="40" height="40" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    name: "Instagram",
    connected: false,
  },
];

const ConnectSocials = () => {
  const { creators, isLoading } = useViewCreators();
  const [currentCreator, setCurrentCreator] = useState<Creator | null>(null);
  const [isConnectedSocials, setIsConnectedSocials] = useState(false);
  const { connectSocial, authorizationUrl, error } = useConnectSocial();

  useEffect(() => {
    if (authorizationUrl) {
      window.open(authorizationUrl, "_blank");
      window.close();
    }
  }, [authorizationUrl]);

  useEffect(() => {
    if (!isLoading && creators && creators.length > 0) {
      setCurrentCreator(creators[0]);
    }
  }, [isLoading, creators]);

  const handleCreatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCreator = creators?.find(
      (creator) => creator.id === e.target.value
    );
    if (selectedCreator) {
      setCurrentCreator(selectedCreator);
    }
  };

  const handleSocialClick = async () => {
    try {
      toast.loading("Connecting social");
      await Promise.all([
        pageTracker({
          creatorId: currentCreator?.id as string,
          previousPage: "/auth/connect-social",
          nextPage: "/auth/creator-details",
        }),
        connectSocial(),
      ]);
      if (!error) {
        setIsConnectedSocials(true);
      }

      toast.success("Social connected successfully");

      setTimeout(() => {
        setIsConnectedSocials(false);
      }, 10000);
    } catch (err) {
      console.error("Error connecting social:", err);
      toast.error("Failed to connect social media account");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ClipLoader color="#ffffff" size={50} />
        </div>
      )}

      <AuthText
        header={"Connect your social media"}
        text={"Connect the Instagram account you want to use."}
        noButton
        noBorder
      />

      <div
        className={`py-2 pl-4 pr-2 rounded-10 bg-white shadow--bot--card w-fit`}
      >
        <CustomSelect
          id="creatorSelect"
          name="creatorSelect"
          width="full"
          selfEnd={false}
          handleChange={handleCreatorChange}
          textPos="left"
          moreToSelect="false"
          moreToLabel=""
        >
          {isLoading ? (
            <option value="">Loading creators...</option>
          ) : creators && creators.length > 0 ? (
            creators.map((creator) => (
              <option
                key={creator.id}
                value={creator.id}
                className="mulish--regular"
              >
                {creator.name || "Default Creator"}
              </option>
            ))
          ) : (
            <option value="">No creators available</option>
          )}
        </CustomSelect>
      </div>

      <div className="flex flex-row gap-8 flex-wrap pt-7">
        {socials.map((social) => (
          <ConnectSocialBtn
            key={social.id}
            id={social.id}
            text={social.name}
            icon={social.icon}
            connected={isConnectedSocials}
            handleClick={handleSocialClick}
            bgColor="white"
            fontType="normal"
            fontSize="sm"
            padding="p-4"
            textColor="text-black"
            borderRadius="rounded-10"
            borderColor="border-gray-200"
          />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ConnectSocials;
