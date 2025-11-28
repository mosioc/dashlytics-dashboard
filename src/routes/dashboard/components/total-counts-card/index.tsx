/*
 * dashboard stat cards component
 * displays total companies, contacts, deals, and total deals value using Ant Design Statistic
 */

import React from "react";
import { Card, Col, Row, Skeleton, Statistic } from "antd";
import {
  BankOutlined,
  ContactsOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import type { DashboardTotalCountsQuery } from "@/graphql/types";
import { currencyNumber } from "../../../../utilities";

type DashboardTotalCountsCardProps = {
  data?: DashboardTotalCountsQuery;
  isLoading?: boolean;
};

export const DashboardTotalCountsCard: React.FC<DashboardTotalCountsCardProps> = ({
  data,
  isLoading,
}) => {
  const companiesCount = data?.companies?.totalCount ?? 0;
  const contactsCount = data?.contacts?.totalCount ?? 0;
  const dealsCount = data?.deals?.totalCount ?? 0;
  const totalDealsValue = data?.dealAggregate?.[0]?.sum?.value ?? 0;

  if (isLoading) {
    return (
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((item) => (
          <Col xs={24} sm={12} lg={6} key={item}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Companies"
            value={companiesCount}
            prefix={<BankOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Contacts"
            value={contactsCount}
            prefix={<ContactsOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Deals"
            value={dealsCount}
            prefix={<ShoppingOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Deals Value"
            value={currencyNumber(totalDealsValue)}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
      </Col>
    </Row>
  );
};

