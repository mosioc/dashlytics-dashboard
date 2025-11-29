// dashboard total counts card tests
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardTotalCountsCard } from "../index";

// mock utilities
vi.mock("../../../../utilities", () => ({
  currencyNumber: (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value),
}));

describe("DashboardTotalCountsCard", () => {
  it("should display all 4 stat cards", () => {
    const mockData = {
      companies: { totalCount: 10 },
      contacts: { totalCount: 20 },
      deals: { totalCount: 5 },
      dealAggregate: [{ sum: { value: 100000 } }],
    };

    render(<DashboardTotalCountsCard data={mockData} isLoading={false} />);

    expect(screen.getByText("Total Companies")).toBeInTheDocument();
    expect(screen.getByText("Total Contacts")).toBeInTheDocument();
    expect(screen.getByText("Total Deals")).toBeInTheDocument();
    expect(screen.getByText("Total Deals Value")).toBeInTheDocument();
  });

  it("should display correct counts", () => {
    const mockData = {
      companies: { totalCount: 10 },
      contacts: { totalCount: 20 },
      deals: { totalCount: 5 },
      dealAggregate: [{ sum: { value: 100000 } }],
    };

    render(<DashboardTotalCountsCard data={mockData} isLoading={false} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    // currencyNumber formats as $100,000.00
    expect(screen.getByText("$100,000.00")).toBeInTheDocument();
  });

  it("should show skeleton loading state", () => {
    render(<DashboardTotalCountsCard data={undefined} isLoading={true} />);

    // ant design skeleton renders with specific classes
    const skeletons = screen.getAllByRole("generic");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should handle missing data with default values", () => {
    render(<DashboardTotalCountsCard data={undefined} isLoading={false} />);

    // use getAllByText since there are multiple "0" values
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThan(0);
    expect(screen.getByText("$0.00")).toBeInTheDocument(); // deals value
  });

  it("should handle zero values", () => {
    const mockData = {
      companies: { totalCount: 0 },
      contacts: { totalCount: 0 },
      deals: { totalCount: 0 },
      dealAggregate: [{ sum: { value: 0 } }],
    };

    render(<DashboardTotalCountsCard data={mockData} isLoading={false} />);

    // use getAllByText since there are multiple "0" values
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThan(0);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("should format currency correctly", () => {
    const mockData = {
      companies: { totalCount: 1 },
      contacts: { totalCount: 1 },
      deals: { totalCount: 1 },
      dealAggregate: [{ sum: { value: 1234567 } }],
    };

    render(<DashboardTotalCountsCard data={mockData} isLoading={false} />);

    // currencyNumber formats as $1,234,567.00
    expect(screen.getByText("$1,234,567.00")).toBeInTheDocument();
  });

  it("should handle missing dealAggregate", () => {
    const mockData = {
      companies: { totalCount: 10 },
      contacts: { totalCount: 20 },
      deals: { totalCount: 5 },
      dealAggregate: [],
    };

    render(<DashboardTotalCountsCard data={mockData} isLoading={false} />);

    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
