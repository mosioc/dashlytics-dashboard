/* company list page with search, sort, and pagination
 * displays companies in table with avatar, name, total deals amount, and action buttons
 * children prop renders nested routes like create/edit modals
 */
import React from "react";
import { List, useTable } from "@refinedev/antd";
import { type HttpError, useGo } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import type { CompaniesListQuery } from "@/graphql/types";
import { COMPANIES_LIST_QUERY } from "./queries";

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
      <List></List>

      {/* render nested modal routes (create/edit) */}
      {children}
    </div>
  );
};
