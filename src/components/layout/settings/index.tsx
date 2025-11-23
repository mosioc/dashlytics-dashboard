/* renders the account settings drawer, allowing the user to edit their profile details
 * it uses refine's useForm hook with optimistic updates and a graphql mutation
 */

import { SaveButton, useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import type { GetFields, GetVariables } from "@refinedev/nestjs-query";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin } from "antd";
import type {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "@/graphql/types";
import { getNameInitials } from "../../../utilities";
import { CustomAvatar } from "../../avatar";
import { Text } from "../../text";
import { UPDATE_USER_MUTATION } from "./queries";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
};

export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
  // initialize refine form with graphql mutation for updating a user
  const { saveButtonProps, formProps, query } = useForm<
    GetFields<UpdateUserMutation>,
    HttpError,
    GetVariables<UpdateUserMutationVariables>
  >({
    mutationMode: "optimistic", // update UI instantly before server response
    resource: "users",
    action: "edit",
    id: userId, // target user id
    meta: { gqlMutation: UPDATE_USER_MUTATION }, // custom mutation
  });

  // extract user data from query
  const { avatarUrl, name } = query?.data?.data || {};

  // drawer styling overrides
  const drawerStyles = {
    body: { background: "#f5f5f5", padding: query?.isLoading ? 0 : undefined },
    header: { display: "none" }, // hide default header
  };

  return (
    <Drawer
      open={opened} // drawer visibility
      onClose={() => setOpened(false)} // close handler
      width={756}
      styles={drawerStyles}
    >
      {query?.isLoading ? (
        // loading screen while fetching user data
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          {/* custom header section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              background: "#fff",
            }}
          >
            <Text strong>Account Settings</Text>
            <Button
              type="text"
              icon={<CloseOutlined />} // close icon button
              onClick={() => setOpened(false)}
            />
          </div>

          {/* main content area */}
          <div style={{ padding: 16 }}>
            <Card>
              {/* form for editing user fields */}
              <Form {...formProps} layout="vertical">
                {/* user avatar */}
                <CustomAvatar
                  shape="square"
                  src={avatarUrl}
                  name={getNameInitials(name || "")}
                  style={{ width: 96, height: 96, marginBottom: 24 }}
                />

                {/* name input */}
                <Form.Item label="Name" name="name">
                  <Input placeholder="Name" />
                </Form.Item>

                {/* email input */}
                <Form.Item label="Email" name="email">
                  <Input placeholder="Email" />
                </Form.Item>

                {/* job title input */}
                <Form.Item label="Job title" name="jobTitle">
                  <Input placeholder="Job title" />
                </Form.Item>

                {/* phone input */}
                <Form.Item label="Phone" name="phone">
                  <Input placeholder="Phone" />
                </Form.Item>
              </Form>

              {/* save button aligned to the right */}
              <SaveButton
                {...saveButtonProps}
                style={{ display: "block", marginLeft: "auto" }}
              />
            </Card>
          </div>
        </>
      )}
    </Drawer>
  );
};
