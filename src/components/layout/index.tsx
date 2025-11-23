import React from "react";
import { ThemedLayout, ThemedTitle } from "@refinedev/antd";
import { Header } from "./header";

export const ComponentLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ThemedLayout
        Header={Header}
        Title={(titleProps) => {
          return <ThemedTitle {...titleProps} text="Dashlytics" />;
        }}
      >
        {children}
      </ThemedLayout>
    </>
  );
};
