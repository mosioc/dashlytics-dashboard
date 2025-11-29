// dashboard page tests
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "../index";
import * as useCustomModule from "@refinedev/core";

// mock refine hooks
vi.mock("@refinedev/core", async () => {
  const actual = await vi.importActual("@refinedev/core");
  return {
    ...actual,
    useCustom: vi.fn(),
  };
});

vi.mock("../components", () => ({
  DashboardDealsChart: () => <div data-testid="deals-chart">Deals Chart</div>,
  DashboardLatestActivities: () => (
    <div data-testid="latest-activities">Latest Activities</div>
  ),
  DashboardTotalCountsCard: ({ data, isLoading }: any) => (
    <div data-testid="total-counts-card" data-loading={isLoading}>
      {data ? "Data Loaded" : "No Data"}
    </div>
  ),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render dashboard components", () => {
    vi.mocked(useCustomModule.useCustom).mockReturnValue({
      result: {
        data: {
          companies: { totalCount: 10 },
          contacts: { totalCount: 20 },
          deals: { totalCount: 5 },
          dealAggregate: [{ sum: { value: 100000 } }],
        },
      },
      query: {
        isLoading: false,
      },
    } as any);

    render(<DashboardPage />);

    expect(screen.getByTestId("total-counts-card")).toBeInTheDocument();
    expect(screen.getByTestId("deals-chart")).toBeInTheDocument();
    expect(screen.getByTestId("latest-activities")).toBeInTheDocument();
  });

  it("should display loading state", () => {
    vi.mocked(useCustomModule.useCustom).mockReturnValue({
      result: undefined,
      query: {
        isLoading: true,
      },
    } as any);

    render(<DashboardPage />);

    const card = screen.getByTestId("total-counts-card");
    expect(card).toHaveAttribute("data-loading", "true");
  });

  it("should fetch total counts data", () => {
    const mockData = {
      companies: { totalCount: 10 },
      contacts: { totalCount: 20 },
      deals: { totalCount: 5 },
      dealAggregate: [{ sum: { value: 100000 } }],
    };

    vi.mocked(useCustomModule.useCustom).mockReturnValue({
      result: {
        data: mockData,
      },
      query: {
        isLoading: false,
      },
    } as any);

    render(<DashboardPage />);

    expect(useCustomModule.useCustom).toHaveBeenCalledWith({
      url: "",
      method: "get",
      meta: expect.objectContaining({
        gqlQuery: expect.anything(),
      }),
    });
  });

  it("should handle missing data", () => {
    vi.mocked(useCustomModule.useCustom).mockReturnValue({
      result: undefined,
      query: {
        isLoading: false,
      },
    } as any);

    render(<DashboardPage />);

    expect(screen.getByTestId("total-counts-card")).toBeInTheDocument();
  });
});

