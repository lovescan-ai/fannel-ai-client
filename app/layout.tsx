import IndexLayout from "@/components/layouts/index-layout";
import "./globals.css";
import "./fonts.css";
import "./mantineStyles.css";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "Fannel AI | Instagram AI Messaging Bot™",
    template: "%s | Fannel AI",
  },
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7",
};
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense>
        <IndexLayout>{children}</IndexLayout>
      </Suspense>
    </>
  );
};

export default RootLayout;
