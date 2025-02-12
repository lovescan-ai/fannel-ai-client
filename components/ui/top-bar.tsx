"use client";

import React, { Suspense } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const TopProgressBar: React.FC = () => {
  return (
    <Suspense>
      <TopProgressBarContent />
    </Suspense>
  );
};

const TopProgressBarContent: React.FC = () => {
  return (
    <ProgressBar
      height="4px"
      color="#4f46e5"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

export default TopProgressBar;
