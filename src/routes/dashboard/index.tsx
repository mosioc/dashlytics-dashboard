/*
 * fetches total counts via GraphQL using useCustom
 * displays the deals chart and latest activities components
 */

import React from "react";
import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";
import type { DashboardTotalCountsQuery } from "@/graphql/types";
import { DashboardDealsChart, DashboardLatestActivities } from "./components";
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "./queries";

export const DashboardPage: React.FC = () => {
  // fetch total counts from GraphQL
  const { result, query } = useCustom<DashboardTotalCountsQuery>({
    url: "",
    method: "get",
    meta: { gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY },
  });

  // extracted data and loading state
  const data = result?.data;
  const isLoading = query.isLoading;

  return (
    <div className="page-container">
      {/* deals chart row */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={16} style={{ height: "460px" }}>
          <DashboardDealsChart />
        </Col>
      </Row>

      {/* latest activities row */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <DashboardLatestActivities />
        </Col>
      </Row>
    </div>
  );
};
