/* company list page with search, sort, and pagination
 * displays companies in table with avatar, name, total deals amount, and action buttons
 * children prop renders nested routes like create/edit modals
 */

import React from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter, type HttpError, useGo } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import { SearchOutlined } from "@ant-design/icons";
import { CustomAvatar, PaginationTotal, Text } from "../../../components";
import type { CompaniesListQuery } from "@/graphql/types";
import { currencyNumber } from "../../../utilities";
import { COMPANIES_LIST_QUERY } from "./queries";
import { Input, Space, Table } from "antd";

type Company = GetFieldsFromList<CompaniesListQuery>;

export const CompanyListPage = ({ children }: React.PropsWithChildren) => {
  const go = useGo();

  // setup table with search, sort, and pagination
  const { tableProps, filters } = useTable<Company, HttpError, Company>({
    resource: "companies",
    onSearch: (values) => [
      {
        field: "name",
        operator: "contains",
        value: values.name,
      },
    ],
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        headerButtons={() => (
          <CreateButton
            onClick={() => {
              // navigate to create modal route while preserving query params
              go({
                to: {
                  resource: "companies",
                  action: "create",
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        )}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            pageSizeOptions: ["12", "24", "48", "96"],
            showTotal: (total) => (
              <PaginationTotal total={total} entityName="companies" />
            ),
          }}
          rowKey="id"
        >
          {/* company name column with avatar and search filter */}
          <Table.Column<Company>
            dataIndex="name"
            title="Company title"
            defaultFilteredValue={getDefaultFilter("id", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(_, record) => (
              <Space>
                <CustomAvatar
                  shape="square"
                  name={record.name}
                  src={record.avatarUrl}
                />
                <Text style={{ whiteSpace: "nowrap" }}>{record.name}</Text>
              </Space>
            )}
          />

          {/* total revenue from open deals */}
          <Table.Column<Company>
            dataIndex="totalRevenue"
            title="Open deals amount"
            render={(_, company) => (
              <Text>
                {currencyNumber(company?.dealsAggregate?.[0]?.sum?.value || 0)}
              </Text>
            )}
          />

          {/* action buttons column */}
          <Table.Column<Company>
            fixed="right"
            dataIndex="id"
            title="Actions"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>

      {/* render nested modal routes (create/edit) */}
      {children}
    </div>
  );
};
