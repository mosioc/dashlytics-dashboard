/* modal for creating new companies with name and sales owner selection
 * redirects to company list after successful creation
 * uses refine's modal form hook for form state and submission handling
 */

import { useModalForm, useSelect } from "@refinedev/antd";
import { type HttpError, useGo } from "@refinedev/core";
import type {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";
import { Form, Input, Modal, Select } from "antd";
import { CustomAvatar } from "../../../components";
import { USERS_SELECT_QUERY } from "../../../graphql/queries";
import type {
  CreateCompanyMutation,
  CreateCompanyMutationVariables,
  UsersSelectQuery,
} from "../../../graphql/types";
import { CREATE_COMPANY_MUTATION } from "./queries";

export const CompanyCreateModal = () => {
  const go = useGo();

  // navigate back to company list preserving query params
  const goToListPage = () => {
    go({
      to: { resource: "companies", action: "list" },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  // setup form with mutation handling
  const { formProps, modalProps } = useModalForm<
    GetFields<CreateCompanyMutation>,
    HttpError,
    GetVariables<CreateCompanyMutationVariables>
  >({
    action: "create",
    defaultVisible: true,
    resource: "companies",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
    meta: {
      gqlMutation: CREATE_COMPANY_MUTATION,
    },
  });

  // fetch users for sales owner dropdown
  const { selectProps, query: queryResult } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
    optionLabel: "name",
  });

  return (
    <Modal
      {...modalProps}
      mask={true}
      onCancel={goToListPage}
      title="Add new company"
      width={512}
    >
      <Form {...formProps} layout="vertical">
        {/* company name input */}
        <Form.Item
          label="Company name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Please enter company name" />
        </Form.Item>

        {/* sales owner select with avatar */}
        <Form.Item
          label="Sales owner"
          name="salesOwnerId"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Please sales owner user"
            {...selectProps}
            options={
              queryResult.data?.data?.map((user) => ({
                value: user.id,
                label: (
                  <CustomAvatar
                    name={user.name}
                    // avatarUrl={user.avatarUrl ?? undefined}
                  />
                ),
              })) ?? []
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
