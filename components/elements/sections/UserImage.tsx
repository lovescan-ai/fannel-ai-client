import React from "react";
import Image from "next/image";
import { User } from "@prisma/client";

const UserImage = ({ user }: { user: User }) => {
  const initials =
    (user?.name ?? "")
      .match(/("[^"]+"|\S+)/g)
      ?.reduce(
        (acc, word) => acc + (word.startsWith('"') ? word[1] : word[0]),
        ""
      ) ?? "";

  return (
    <>
      {user?.profileImageUrl ? (
        <Image
          src={user?.profileImageUrl ?? ""}
          alt={user?.name ?? ""}
          height={16}
          width={16}
          className={"rounded-full h-8 w-8"}
        />
      ) : (
        <div
          className={`aspect-square bg-brandBlue4x flex items-center justify-center text-sm text-white font-bold uppercase rounded-full p-1`}
        >
          {initials}
        </div>
      )}
    </>
  );
};

export default UserImage;
