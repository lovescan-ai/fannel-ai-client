"use client";

import React, { useEffect } from "react";

interface ModalWrapProps {
  id: string;
  children: React.ReactNode;
  modalState: boolean;
  handleModal: () => void;
  padding?: string;
  overflow?: string;
}

const ModalWrap: React.FC<ModalWrapProps> = ({
  id,
  children,
  modalState,
  handleModal,
  padding,
  overflow,
}) => {
  useEffect(() => {
    const body = document.querySelector("body");
    const scrollPosition = window.pageYOffset;
    if (modalState) {
      body?.style.setProperty("overflow", "hidden");
      body?.style.setProperty("height", "100vh");
    } else {
      body?.style.removeProperty("overflow");
      body?.style.removeProperty("height");
    }
    window.scrollTo(0, scrollPosition);
  }, [modalState]);

  return (
    <div
      id={id}
      className={`z-50 ${
        modalState ? "flex" : "hidden"
      } modal flex-col fixed top-0 col-span-12 left-0 w-full h-full lg:h-screen backdrop-blur-sm bg-black/30 ${
        padding ? padding : "py-20"
      } ${overflow ? overflow : "overflow-y-auto"} items-center z-50`}
    >
      <div
        onClick={handleModal}
        className="overlay cursor-pointer pop-up-closer w-full h-full z-20 fixed top-0 left-0 "
      ></div>
      {children}
    </div>
  );
};

export default ModalWrap;
