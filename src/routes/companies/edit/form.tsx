/*
 * renders the edit page for a company record in the Refine admin panel.
 * it allows updating company details like sales owner, size, revenue, industry, etc.
 */

import { Edit, useForm, useSelect } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import type {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";
import { Form, Input, InputNumber, Select } from "antd";
import { CustomAvatar } from "../../../components";
import { USERS_SELECT_QUERY } from "../../../graphql/queries";
import { getNameInitials } from "../../../utilities";
import { UPDATE_COMPANY_MUTATION } from "./queries";
import type {
  BusinessType,
  CompanySize,
  Industry,
} from "../../../graphql/schema.types";
import type {
  UpdateCompanyMutation,
  UpdateCompanyMutationVariables,
  UsersSelectQuery,
} from "../../../graphql/types";

// useForm hook for editing a company
export const CompanyForm = () => {
  // fetches current company data and handles form submission via GraphQL mutation
  const {
    saveButtonProps,
    formProps,
    formLoading,
    query: queryResult, // contains the current company being edited
  } = useForm<
    GetFields<UpdateCompanyMutation>,
    HttpError,
    GetVariables<UpdateCompanyMutationVariables>
  >({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });

  // extract avatar and name from the currently loaded company
  const { avatarUrl, name } = queryResult?.data?.data || {};

  // fetch users for the "Sales Owner" dropdown
  const { selectProps: selectPropsUsers, query: queryResultUsers } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    pagination: { mode: "off" },
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      breadcrumb={false}
    >
      <Form {...formProps} layout="vertical">
        {/* company Avatar - shows image or initials */}
        <CustomAvatar
          shape="square"
          src={avatarUrl}
          name={getNameInitials(name || "")}
          style={{
            width: 96,
            height: 96,
            marginBottom: "24px",
          }}
        />

        {/* sales owner dropdown */}
        <Form.Item
          label="Sales owner"
          name="salesOwnerId"
          initialValue={formProps?.initialValues?.salesOwner?.id}
        >
          <Select
            {...selectPropsUsers}
            options={
              queryResultUsers.data?.data?.map(({ id, name }) => ({
                label: name,
                value: id,
              })) ?? []
            }
            placeholder="Select a sales owner"
          />
        </Form.Item>

        {/* company size */}
        <Form.Item label="Company size" name="companySize">
          <Select
            options={companySizeOptions}
            placeholder="Select company size"
          />
        </Form.Item>

        {/* total revenue - formatted as currency */}
        <Form.Item label="Total revenue" name="totalRevenue">
          <InputNumber
            autoFocus
            addonBefore="$"
            min={0}
            placeholder="0,00"
            style={{ width: "100%" }}
            formatter={
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any} 
          />
        </Form.Item>

        {/* industry */}
        <Form.Item label="Industry" name="industry">
          <Select options={industryOptions} placeholder="Select industry" />
        </Form.Item>

        {/* business type */}
        <Form.Item label="Business type" name="businessType">
          <Select
            options={businessTypeOptions}
            placeholder="Select business type"
          />
        </Form.Item>

        {/* country */}
        <Form.Item label="Country" name="country">
          <Input placeholder="Country" />
        </Form.Item>

        {/* website */}
        <Form.Item label="Website" name="website">
          <Input placeholder="https://example.com" />
        </Form.Item>
      </Form>
    </Edit>
  );
};

// company size options
const companySizeOptions: { label: string; value: CompanySize }[] = [
  { label: "Enterprise", value: "ENTERPRISE" },
  { label: "Large", value: "LARGE" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Small", value: "SMALL" },
];

// full list of industries
const industryOptions: { label: string; value: Industry }[] = [
  { label: "Aerospace", value: "AEROSPACE" },
  { label: "Agriculture", value: "AGRICULTURE" },
  { label: "Automotive", value: "AUTOMOTIVE" },
  { label: "Chemicals", value: "CHEMICALS" },
  { label: "Construction", value: "CONSTRUCTION" },
  { label: "Defense", value: "DEFENSE" },
  { label: "Education", value: "EDUCATION" },
  { label: "Energy", value: "ENERGY" },
  { label: "Financial Services", value: "FINANCIAL_SERVICES" },
  { label: "Food and Beverage", value: "FOOD_AND_BEVERAGE" },
  { label: "Government", value: "GOVERNMENT" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Hospitality", value: "HOSPITALITY" },
  { label: "Industrial Manufacturing", value: "INDUSTRIAL_MANUFACTURING" },
  { label: "Insurance", value: "INSURANCE" },
  { label: "Life Sciences", value: "LIFE_SCIENCES" },
  { label: "Logistics", value: "LOGISTICS" },
  { label: "Media", value: "MEDIA" },
  { label: "Mining", value: "MINING" },
  { label: "Nonprofit", value: "NONPROFIT" },
  { label: "Other", value: "OTHER" },
  { label: "Pharmaceuticals", value: "PHARMACEUTICALS" },
  { label: "Professional Services", value: "PROFESSIONAL_SERVICES" },
  { label: "Real Estate", value: "REAL_ESTATE" },
  { label: "Retail", value: "RETAIL" },
  { label: "Technology", value: "TECHNOLOGY" },
  { label: "Telecommunications", value: "TELECOMMUNICATIONS" },
  { label: "Transportation", value: "TRANSPORTATION" },
  { label: "Utilities", value: "UTILITIES" },
];

// business type options
const businessTypeOptions: { label: string; value: BusinessType }[] = [
  { label: "B2B", value: "B2B" },
  { label: "B2C", value: "B2C" },
  { label: "B2G", value: "B2G" },
];
