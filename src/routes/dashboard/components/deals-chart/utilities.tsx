/**
 * utility functions that transform raw deal stage
 * aggregation data into a chart-friendly format. it extracts monthly
 * won/lost deal values, formats dates, and returns a sorted list for
 * dashboard chart rendering.
 */

import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import type { DashboardDealsChartQuery } from "@/graphql/types";
import dayjs from "dayjs";

// type for a deal stage returned from graphql
type DealStage = GetFieldsFromList<DashboardDealsChartQuery>;

// type for each aggregated deal entry inside a deal stage
type DealAggregate = DealStage["dealsAggregate"][0];

// final mapped shape returned to the chart
interface MappedDealData {
  timeUnix: number;
  timeText: string;
  value: number;
  state: string;
}

// helper: check that deal has valid month and year
const filterDeal = (deal?: DealAggregate) =>
  deal?.groupBy?.closeDateMonth && deal.groupBy.closeDateYear;

// map raw deal aggregates for a specific state (won or lost)
const mapDeals = (
  deals: DealAggregate[] = [],
  state: string
): MappedDealData[] => {
  return deals.filter(filterDeal).map((deal) => {
    // extract month & year safely
    const { closeDateMonth, closeDateYear } = deal.groupBy as NonNullable<
      DealAggregate["groupBy"]
    >;

    // build date from month + year
    const date = dayjs(`${closeDateYear}-${closeDateMonth}-01`);

    return {
      timeUnix: date.unix(),
      timeText: date.format("MMM YYYY"),
      value: deal.sum?.value ?? 0,
      state,
    };
  });
};

// combine won and lost deal data into a single sorted dataset
export const mapDealsData = (
  dealStages: DealStage[] = []
): MappedDealData[] => {
  // find stage for won
  const won = dealStages.find((stage) => stage.title === "WON");
  const wonDeals = mapDeals(won?.dealsAggregate, "Won");

  // find stage for lost
  const lost = dealStages.find((stage) => stage.title === "LOST");
  const lostDeals = mapDeals(lost?.dealsAggregate, "Lost");

  // merge and sort by timestamp
  return [...wonDeals, ...lostDeals].sort((a, b) => a.timeUnix - b.timeUnix);
};
