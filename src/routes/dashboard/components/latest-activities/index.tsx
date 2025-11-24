/*
 * shows the latest Deal activities using audits and deals data
 * handles loading, errors, and displays skeletons while fetching
 * uses Refine v4 `useList` with GraphQL queries
 */

import { useList } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, List, Skeleton as AntdSkeleton, Space } from "antd";
import dayjs from "dayjs";
import { CustomAvatar, Text } from "../../../../components";

import type {
  DashboardLatestActivitiesAuditsQuery,
  DashboardLatestActivitiesDealsQuery,
} from "@/graphql/types";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from "./queries";

type Props = { limit?: number };

export const DashboardLatestActivities = ({ limit = 5 }: Props) => {
  // fetch audits (create/update actions for deals)
  const {
    query: { data: auditResponse, isLoading: isLoadingAudit, isError, error },
  } = useList<GetFieldsFromList<DashboardLatestActivitiesAuditsQuery>>({
    resource: "audits",
    pagination: {
      pageSize: limit,
    },
    sorters: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    filters: [
      {
        field: "action",
        operator: "in",
        value: ["CREATE", "UPDATE"],
      },
      {
        field: "targetEntity",
        operator: "eq",
        value: "Deal",
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
    },
  });

  // extracted audits array
  const audit = auditResponse?.data || [];

  // list of deal IDs that were involved in latest activities
  const dealIds = audit.map((auditItem) => auditItem.targetId);

  // fetch deals for the extracted dealIds
  const {
    query: { data: dealsResponse, isLoading: isLoadingDeals },
  } = useList<GetFieldsFromList<DashboardLatestActivitiesDealsQuery>>({
    resource: "deals",
    queryOptions: { enabled: !!dealIds.length }, // only load when we have IDs
    pagination: { mode: "off" },
    filters: [{ field: "id", operator: "in", value: dealIds }],
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
    },
  });

  // extracted deals array
  const deals = dealsResponse?.data || [];

  // combined loading state of audits + deals
  const isLoading = isLoadingAudit || isLoadingDeals;

  // show nothing on error
  if (isError) {
    console.error("Error fetching latest activities", error);
    return null;
  }

  return (
    <Card
      headStyle={{ padding: "16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: ".5rem" }}>
            Latest activities
          </Text>
        </div>
      }
    >
      {isLoading ? (
        // loading skeleton list
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: limit }).map((_, i) => ({ id: i }))}
          renderItem={(_item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={
                  <AntdSkeleton.Avatar
                    active
                    size={48}
                    shape="square"
                    style={{ borderRadius: "4px" }}
                  />
                }
                title={
                  <AntdSkeleton.Button active style={{ height: "16px" }} />
                }
                description={
                  <AntdSkeleton.Button
                    active
                    style={{ width: "300px", height: "16px" }}
                  />
                }
              />
            </List.Item>
          )}
        />
      ) : (
        // activities list
        <List
          itemLayout="horizontal"
          dataSource={audit}
          renderItem={(item) => {
            // find matching deal
            const deal = deals.find((d) => d.id === `${item.targetId}`);

            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <CustomAvatar
                      shape="square"
                      size={48}
                      src={deal?.company.avatarUrl}
                      name={deal?.company.name}
                    />
                  }
                  title={dayjs(deal?.createdAt).format("MMM DD, YYYY - HH:mm")}
                  description={
                    <Space size={4}>
                      {/* user name */}
                      <Text strong>{item.user?.name}</Text>

                      {/* action text */}
                      <Text>
                        {item.action === "CREATE" ? "created" : "moved"}
                      </Text>

                      {/* deal title */}
                      <Text strong>{deal?.title}</Text>

                      <Text>deal</Text>

                      <Text>{item.action === "CREATE" ? "in" : "to"}</Text>

                      {/* stage */}
                      <Text strong>{deal?.stage?.title || "Unassigned"}.</Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};
