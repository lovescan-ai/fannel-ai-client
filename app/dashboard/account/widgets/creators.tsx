import React from "react";
import Image from "next/image";
import BasicButton from "@/components/elements/buttons/BasicButton";
import { Creator } from "@prisma/client";
import SkeletonLoader from "./skeleton";
import { cn, getGradientColor } from "@/lib/utils";

const makeInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

interface CreatorProps {
  creators: Creator[];
  editOrAdd: string;
  openEditCreator: (id: string) => void;
  isLoading?: boolean;
}

export default function Creators({
  creators,
  editOrAdd,
  openEditCreator,
  isLoading = false,
}: CreatorProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 sm:gap-6 ${
        editOrAdd === "edit" ? "hidden" : ""
      }`}
    >
      {creators.map((account, idx) => (
        <div
          key={idx}
          className={`rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex gap-4 sm:flex-row sm:gap-6 justify-between w-full p-4 sm:p-6 relative overflow-hidden bg-white`}
        >
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-2",
              getGradientColor(Number(account.id) ?? idx)
            )}
          ></div>
          <div className={"flex flex-row gap-3 sm:gap-4 items-center"}>
            {account?.profileImageUrl ? (
              <Image
                src={account?.profileImageUrl || ""}
                alt={account?.name || ""}
                height={64}
                width={64}
                className={"rounded-full h-16 w-16 object-cover"}
              />
            ) : (
              <div
                className={`h-16 w-16 ${
                  account.isActive ? "bg-brandBlue4x" : "bg-brandGray35x"
                } flex items-center justify-center text-2xl text-white font-bold uppercase rounded-full`}
              >
                {makeInitials(account?.name || "")}
              </div>
            )}
            <div>
              <p
                className={`text-lg sm:text-xl mulish--bold text-brandDarkPurple1x`}
              >
                {account.name}
              </p>
              <p
                className={`text-sm sm:text-base mulish--regular text-brandGray35x`}
              >
                Creator
              </p>
            </div>
          </div>

          <div
            className={`flex lg:flex-row flex-col justify-between sm:flex-row items-center gap-2 sm:gap-3`}
          >
            <BasicButton
              text={account.isActive ? "Active" : "Inactive"}
              borderRadius={"rounded-full"}
              width={"w-20 sm:w-24"}
              fontType={"mulish--semibold"}
              bgColor={`${
                account.isActive
                  ? "bg-green-100 !text-green-600"
                  : "bg-red-100 !text-red-600"
              }`}
            />
            <BasicButton
              handleClick={() => openEditCreator(account.id as string)}
              text={"Edit"}
              textColor={`text-brandBlue4x`}
              borderRadius={"rounded-full"}
              width={"w-20 sm:w-24"}
              fontType={"mulish--semibold"}
              bgColor={`bg-brandBlue4x/15 hover:bg-brandBlue4x/25 transition-colors duration-300`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
