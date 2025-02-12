import React from "react";

const CreatorCardLoader = () => {
  return (
    <div
      className={`rounded-10 w-full settings--form--gradient flex flex-col sm:flex-row gap-6 justify-between px-6 py-3 border-l-8 bg-white `}
    >
      <div className={"flex flex-row gap-3 items-center w-full"}>
        <div
          className={`aspect-square skeleton flex items-center justify-center text-2xl min-w-16 text-white font-bold uppercase rounded-full p-3`}
        ></div>
        <div className={`flex flex-col gap-2 w-full`}>
          <div className="w-fortyPercent h-4 min-h-4 flex rounded-10 skeleton"></div>
          <div className="w-twentyPercent h-2 min-h-2 flex rounded-10 skeleton"></div>
        </div>
      </div>

      <div
        className={`flex xs:flex-col flex-row self-end items-center sm:grid auto-rows-fr auto-cols-fr w-fit gap-2`}
      >
        <div className={`w-24 h-10 rounded-10 skeleton`}></div>
        <div className={`w-24 h-10 rounded-10 skeleton`}></div>
      </div>
    </div>
  );
};

export default CreatorCardLoader;
