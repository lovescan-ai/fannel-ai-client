import React, { Suspense } from "react";
import Messages from "./Messages";

const page = () => {
  return (
    <div>
      <Suspense>
        <Messages />
      </Suspense>
    </div>
  );
};

export default page;
