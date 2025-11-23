/* displaying current user info and account settings
 * shows avatar with popover menu containing user name and settings button
 * triggers account settings modal on button click
 */
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { SettingOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import type { User } from "@/graphql/schema.types";
import { CustomAvatar } from "../../avatar";
import { Text } from "../../text";
import { AccountSettings } from "../settings";

export const CurrentUser = () => {
  // modal visibility state for account settings
  const [opened, setOpened] = useState(false);
  // fetch current authenticated user data
  const { data: user } = useGetIdentity<User>();

  // popover content with user name and settings button
  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 200,
      }}
    >
      {/* user name header */}
      <Text
        strong
        style={{
          padding: "12px 20px",
        }}
      >
        {user?.name}
      </Text>

      {/* action buttons section */}
      <div
        style={{
          borderTop: "1px solid #d9d9d9",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          icon={<SettingOutlined />}
          type="text"
          block
          onClick={() => setOpened(true)}
        >
          Account settings
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* avatar with popover trigger */}
      <Popover
        placement="bottomRight"
        content={content}
        trigger="click"
        overlayInnerStyle={{ padding: 0 }}
        overlayStyle={{ zIndex: 999 }}
      >
        <CustomAvatar
          name={user?.name}
          src={user?.avatarUrl}
          size="default"
          style={{ cursor: "pointer" }}
        />
      </Popover>

      {/* account settings modal */}
      {user && (
        <AccountSettings
          opened={opened}
          setOpened={setOpened}
          userId={user.id}
        />
      )}
    </>
  );
};
