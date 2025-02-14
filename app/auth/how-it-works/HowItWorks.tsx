"use client";

import React, { useState } from "react";
import ConnectSocial from "../../../public/connect-social.png";
import ActivateSocial from "../../../public/activate-bot-bg.png";
import AutomateSocial from "../../../public/automate-bot-bg.png";
import AuthWrap from "../widgets/AuthWrap";
import { CheckCircle, LinkIcon, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import CircularPreloader from "@/components/ui/preloader";

const HowItWorks = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: "connect",
      icon: LinkIcon,
      name: "Connect",
      text: "Connect the instagram account you wish to integrate with our AI bot.",
      img: ConnectSocial,
    },
    {
      id: "activate",
      icon: CheckCircle,
      name: "Activate",
      text: "Activate the AI bot to start responding to your incoming DMs.",
      img: ActivateSocial,
    },
    {
      id: "automate",
      icon: RefreshCcw,
      name: "Automate",
      text: "Sit back as our AI bot turns your social media interactions into subscriptions.",
      img: AutomateSocial,
    },
  ];

  const router = useRouter();
  const handleNextStep = () => {
    setIsLoading(true);
    setCurrentStepIndex((prevIndex) =>
      Math.min(prevIndex + 1, steps.length - 1)
    );
    setIsLoading(false);
  };

  return (
    <AuthWrap
      zIndex="z-[100]"
      altImageSection
      previewImg={steps[currentStepIndex].img as any}
      previewMini={""}
      className={`h-[80vh]`}
    >
      <CircularPreloader isLoading={isLoading} />
      <div className="flex flex-col relative items-start w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 mulish--regular">
          How it works
        </h1>
        <div className="space-y-6 w-full relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col">
              <div className="flex items-center relative">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center z-10 bg-white shadow-[0px_2px_10px_rgba(0,0,0,0.15)]`}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: index <= currentStepIndex ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  {<step.icon className="w-6 h-6 text-brandBlue4x" />}
                </motion.div>
                <motion.span
                  className={`ml-4 font-bold text-2xl mulish--regular`}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: index === currentStepIndex ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  {step.name}
                </motion.span>
              </div>
              <AnimatePresence mode="wait">
                {index === currentStepIndex && (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-black mulish--regular py-4 text-lg">
                      {step.text}
                    </p>
                    {index < steps.length - 1 ? (
                      <button
                        onClick={handleNextStep}
                        className="bg-brandBlue4x mulish--regular text-white px-4 py-2 mb-4 w-fit h-12 rounded-full"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsLoading(true);
                          router.push("/dashboard");
                        }}
                        className="bg-brandBlue4x mulish--regular text-white px-4 py-2 mb-4 w-32 mulish--regular font-medium h-12 rounded-full"
                      >
                        Done
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </AuthWrap>
  );
};

export default HowItWorks;
