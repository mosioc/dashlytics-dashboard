/* application header component with sticky positioning and user profile section
 * uses ant design theme tokens for consistent styling across the app
 * positioned at top with elevated background color for visual hierarchy
 */

import React from "react";
import { Layout, Space, theme } from "antd";
import { CurrentUser } from "../user";
const { useToken } = theme;

export const Header = () => {
  // access current theme tokens for dynamic styling
  const { token } = useToken();

  // sticky header styles with theme-aware background
  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "sticky",
    top: 0,
    zIndex: 999,
  };

  return (
    <Layout.Header style={headerStyles}>
      {/* right-aligned user controls section */}
      <Space align="center" size="middle">
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};
