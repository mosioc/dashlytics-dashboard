/* application header component with sticky positioning and user profile section
 * uses ant design theme tokens for consistent styling across the app
 * positioned at top with elevated background color for visual hierarchy
 */

import React, { useContext } from "react";
import { Layout, Space, theme, Button } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import { CurrentUser } from "../user";
import { ColorModeContext } from "../../../contexts/color-mode";

const { useToken } = theme;

export const Header = () => {
  const colorModeContext = useContext(ColorModeContext);
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

  if (!colorModeContext) {
    return null;
  }

  const { mode, toggleTheme } = colorModeContext;

  return (
    <Layout.Header style={headerStyles}>
      {/* right-aligned user controls section */}
      <Space align="center" size="middle">
        {/* theme toggle button */}
        <Button
          type="text"
          icon={<BgColorsOutlined />}
          onClick={toggleTheme}
          title={mode === "dark" ? "Switch to Light" : "Switch to Dark"}
        />
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};
