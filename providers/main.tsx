import React from "react";
import QueryProvider from "./query-providedr";
import { MantineProvider } from "@mantine/core";
import { Toaster } from "sonner";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <QueryProvider>
        <Toaster richColors position="bottom-right" closeButton />
        {children}
      </QueryProvider>
    </MantineProvider>
  );
}
