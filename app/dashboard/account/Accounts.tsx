"use client";

import BasicButton from "@/components/elements/buttons/BasicButton";
import React, { useEffect, useState } from "react";
import AddIcon from "@/components/ui/icons/add";
import DashBody from "../widgets/DashBody";
import NewCreatorModal from "./widgets/NewCreatorModal";
import Creators from "./widgets/creators";
import { useRealtimeCreators } from "@/lib/hooks/use-realtime-creators-list";
import { Creator } from "@prisma/client";
import useReadUser from "@/lib/hooks/use-read-user";
import { useRealtimeSubscription } from "@/lib/hooks/use-subscription";

const Accounts: React.FC = () => {
  const [editOrAdd, setEditOrAdd] = useState<"edit" | "add" | "">("");
  const [currentEditItem, setCurrentEditItem] = useState<Creator[]>([]);
  const { user } = useReadUser();
  const { subscription } = useRealtimeSubscription(user?.id);
  const { creators, loading } = useRealtimeCreators(user?.id);

  const openEditCreator = (id: string) => {
    const temp = creators?.filter((creator) => creator.id === id);
    setCurrentEditItem(temp || []);
    setEditOrAdd("edit");
  };

  return (
    <DashBody bgColor="bg-white" hideOverflow={false} padding="p-0">
      <div
        className={`lg:py-20 py-10 px-4 lg:px-0 max-w-2xl w-full mx-auto flex flex-col gap-14`}
      >
        <h1
          className={`mulish--bold text-4xl text-brandDarkPurple1x text-left`}
        >
          Account
        </h1>

        {editOrAdd == "edit" && (
          <NewCreatorModal
            setType={setEditOrAdd}
            type="edit"
            id={currentEditItem[0]?.id || ""}
            data={currentEditItem}
            setData={setCurrentEditItem}
            creator={currentEditItem[0]}
          />
        )}
        <Creators
          creators={creators || []}
          editOrAdd={editOrAdd}
          openEditCreator={openEditCreator}
          isLoading={loading}
        />
        {/* {subscription?.plan === "tier-small-agencies" && ( */}
        <>
          <div
            className={`${
              editOrAdd == "add"
                ? "invisible opacity-0 h-0 w-0 p-0 hidden transition-all duration-300 ease-in-out"
                : "px-4 sm:px-6 py-4 sm:py-3"
            } rounded-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between w-full border-dashed border-2 border-brandBlue4x bg-white`}
          >
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <AddIcon className="w-14 h-14 sm:w-auto sm:h-auto" />
              <p className={`text-lg sm:text-2xl text-black mulish--medium`}>
                Add new creator
              </p>
            </div>

            <BasicButton
              handleClick={() => setEditOrAdd("add")}
              text={"Add"}
              borderRadius={"rounded-10"}
              width={"w-full sm:w-20"}
              fontType={"mulish--regular"}
              bgColor={`bg-brandBlue4x`}
              className="mt-4 sm:mt-0"
            />
          </div>
          {editOrAdd == "add" && (
            <NewCreatorModal setType={setEditOrAdd} type="add" id="" />
          )}
        </>
        {/* )} */}
      </div>
    </DashBody>
  );
};

export default Accounts;
