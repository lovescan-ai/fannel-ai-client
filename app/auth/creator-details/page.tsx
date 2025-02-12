"use server";

import React, { Suspense } from "react";
import AuthWrap from "../widgets/AuthWrap";
import previewImg from "../../../public/creator-details-preview.png";
import CreatorDetails from "./CreatorDetails";
import { Loader } from "lucide-react";

const page = async () => {
  return (
    <AuthWrap
      previewImg={previewImg as any}
      previewAlt={"Creator details - Flannel review"}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-brandBlue2x w-10 h-10" />
          </div>
        }
      >
        <CreatorDetails />
      </Suspense>
    </AuthWrap>
  );
};

export default page;
