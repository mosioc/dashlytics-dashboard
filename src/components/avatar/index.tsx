/* custom avatar component with automatic initials and color generation
 * generates background color from name string for consistent user identification
 *memoized to prevent unnecessary re-renders when name and src don't change
 */

import React from "react";
import type { AvatarProps } from "antd";
import { Avatar as AntdAvatar } from "antd";
import { getNameInitials, getRandomColorFromString } from "@/utilities";

type Props = AvatarProps & {
  name?: string;
};

const CustomAvatarComponent = ({ name = "", style, ...rest }: Props) => {
  const hasImage = Boolean(rest?.src);
  const backgroundColor = hasImage
    ? "transparent"
    : getRandomColorFromString(name);
  const initials = getNameInitials(name);

  return (
    <AntdAvatar
      alt={name}
      size="small"
      style={{
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        ...style,
      }}
      {...rest}
    >
      {initials}
    </AntdAvatar>
  );
};

// memoized to optimize performance, only re-renders when name or image source changes
export const CustomAvatar = React.memo(
  CustomAvatarComponent,
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name && prevProps.src === nextProps.src;
  }
);