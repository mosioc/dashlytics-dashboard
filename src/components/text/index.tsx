/* customizable text component wrapper around ant design typography
 * provides predefined size variants with consistent font size and line height ratios
 * uses ConfigProvider to apply theme tokens without prop drilling
 */

import React from "react";
import { ConfigProvider, Typography } from "antd";

export type TextProps = {
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "xxxl"
    | "huge"
    | "xhuge"
    | "xxhuge";
} & React.ComponentProps<typeof Typography.Text>;

// size presets with calculated line heights for optimal readability
const sizes = {
  xs: {
    fontSize: 12,
    lineHeight: 20 / 12,
  },
  sm: {
    fontSize: 14,
    lineHeight: 22 / 14,
  },
  md: {
    fontSize: 16,
    lineHeight: 24 / 16,
  },
  lg: {
    fontSize: 20,
    lineHeight: 28 / 20,
  },
  xl: {
    fontSize: 24,
    lineHeight: 32 / 24,
  },
  xxl: {
    fontSize: 30,
    lineHeight: 38 / 30,
  },
  xxxl: {
    fontSize: 38,
    lineHeight: 46 / 38,
  },
  huge: {
    fontSize: 46,
    lineHeight: 54 / 46,
  },
  xhuge: {
    fontSize: 56,
    lineHeight: 64 / 56,
  },
  xxhuge: {
    fontSize: 68,
    lineHeight: 76 / 68,
  },
} as const;

export const Text = ({ size = "sm", children, ...rest }: TextProps) => {
  const sizeConfig = sizes[size];

  return (
    <ConfigProvider
      theme={{
        token: sizeConfig,
      }}
    >
      <Typography.Text {...rest}>{children}</Typography.Text>
    </ConfigProvider>
  );
};
