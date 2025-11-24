/**
 * displays all contacts belonging to the current company.
 * The company is identified by the `id` parameter in the URL (e.g. /companies/123).
 */

import { useParams } from "react-router-dom";
import { FilterDropdown, useTable } from "@refinedev/antd";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import {
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Space, Table } from "antd";
import { CustomAvatar, Text } from "../../../components";
import type { CompanyContactsTableQuery } from "@/graphql/types";
import { COMPANY_CONTACTS_TABLE_QUERY } from "./queries";

type Contact = GetFieldsFromList<CompanyContactsTableQuery>;

export const CompanyContactsTable = () => {
  // get the company id from route params (e.g. /companies/123 → params.id)
  const { id: companyId } = useParams<{ id: string }>();

  // fetch contacts for the current company
  const { tableProps } = useTable<Contact>({
    resource: "contacts",
    syncWithLocation: false,

    // default sorting – newest first
    sorters: {
      initial: [{ field: "createdAt", order: "desc" }],
    },

    // initial (searchable) + permanent (company filter) filters
    filters: {
      initial: [
        { field: "jobTitle", operator: "contains", value: "" },
        { field: "name", operator: "contains", value: "" },
      ],
      permanent: [{ field: "company.id", operator: "eq", value: companyId }],
    },

    meta: {
      gqlQuery: COMPANY_CONTACTS_TABLE_QUERY,
    },
  });

  return (
    <Card
      headStyle={{ borderBottom: "1px solid #d9d9d9" }}
      bodyStyle={{ padding: 0 }}
      title={
        <Space size="middle">
          <TeamOutlined />
          <Text>contacts</Text>
        </Space>
      }
      extra={
        <>
          <Text className="tertiary">total contacts: </Text>
          <Text strong>
            {tableProps.pagination !== false && tableProps.pagination?.total}
          </Text>
        </>
      }
    >
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{ ...tableProps.pagination, showSizeChanger: false }}
      >
        {/* name column with avatar */}
        <Table.Column<Contact>
          title="name"
          dataIndex="name"
          render={(_, record) => (
            <Space>
              <CustomAvatar name={record.name} src={record.avatarUrl} />
              <Text style={{ whiteSpace: "nowrap" }}>{record.name}</Text>
            </Space>
          )}
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="search name" />
            </FilterDropdown>
          )}
        />

        {/* job title column */}
        <Table.Column<Contact>
          title="title"
          dataIndex="jobTitle"
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="search title" />
            </FilterDropdown>
          )}
        />

        {/* quick action buttons (email / phone) */}
        <Table.Column<Contact>
          title="actions"
          dataIndex="id"
          width={112}
          render={(_, record) => (
            <Space>
              <Button
                size="small"
                href={`mailto:${record.email}`}
                icon={<MailOutlined />}
              />
              <Button
                size="small"
                href={`tel:${record.phone}`}
                icon={<PhoneOutlined />}
              />
            </Space>
          )}
        />
      </Table>
    </Card>
  );
};

// status options (not used in the table yet – kept for future filters)
const statusOptions: { label: string; value: Contact["status"] }[] = [
  { label: "new", value: "NEW" },
  { label: "qualified", value: "QUALIFIED" },
  { label: "unqualified", value: "UNQUALIFIED" },
  { label: "won", value: "WON" },
  { label: "negotiation", value: "NEGOTIATION" },
  { label: "lost", value: "LOST" },
  { label: "interested", value: "INTERESTED" },
  { label: "contacted", value: "CONTACTED" },
  { label: "churned", value: "CHURNED" },
];
