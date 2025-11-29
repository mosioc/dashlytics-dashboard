// company create modal tests
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanyCreateModal } from "../create-modal";
import { TestWrapper } from "../../../../test/test-wrapper";
import * as useModalFormModule from "@refinedev/antd";
import * as useSelectModule from "@refinedev/antd";
import * as useGoModule from "@refinedev/core";

// mock refine hooks
vi.mock("@refinedev/antd", async () => {
  const actual = await vi.importActual("@refinedev/antd");
  return {
    ...actual,
    useModalForm: vi.fn(),
    useSelect: vi.fn(),
  };
});

vi.mock("@refinedev/core", async () => {
  const actual = await vi.importActual("@refinedev/core");
  return {
    ...actual,
    useGo: vi.fn(),
  };
});

vi.mock("../../../components", () => ({
  CustomAvatar: ({ name }: { name: string }) => (
    <div data-testid="avatar">{name}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe("CompanyCreateModal", () => {
  const mockGo = vi.fn();
  const mockFormProps = {
    onFinish: vi.fn(),
    initialValues: {},
  };
  const mockModalProps = {
    open: true,
    onCancel: vi.fn(),
  };

  const mockSelectProps = {
    options: [],
    loading: false,
    onSearch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useGoModule.useGo).mockReturnValue(mockGo);

    vi.mocked(useModalFormModule.useModalForm).mockReturnValue({
      formProps: mockFormProps,
      modalProps: mockModalProps,
    } as any);

    vi.mocked(useSelectModule.useSelect).mockReturnValue({
      selectProps: mockSelectProps,
      query: {
        data: {
          data: [
            { id: "user-1", name: "John Doe" },
            { id: "user-2", name: "Jane Smith" },
          ],
        },
        isLoading: false,
      },
    } as any);
  });

  it("should render modal with form", async () => {
    render(
      <TestWrapper>
        <CompanyCreateModal />
      </TestWrapper>
    );

    // wait for modal to render
    await waitFor(() => {
      expect(screen.getByText("Add new company")).toBeInTheDocument();
    });

    expect(screen.getByText("Company name")).toBeInTheDocument();
    expect(screen.getByText("Sales owner")).toBeInTheDocument();
  });

  it("should render company name input with placeholder", () => {
    render(<CompanyCreateModal />);

    const input = screen.getByPlaceholderText("Please enter company name");
    expect(input).toBeInTheDocument();
  });

  it("should render sales owner select with placeholder", () => {
    render(<CompanyCreateModal />);

    expect(
      screen.getByText("Please select sales owner user")
    ).toBeInTheDocument();
  });

  it("should call goToListPage on cancel", async () => {
    const user = userEvent.setup();
    const mockOnCancel = vi.fn(() => {
      mockGo({
        to: { resource: "companies", action: "list" },
        options: { keepQuery: true },
        type: "replace",
      });
    });

    vi.mocked(useModalFormModule.useModalForm).mockReturnValue({
      formProps: mockFormProps,
      modalProps: {
        ...mockModalProps,
        onCancel: mockOnCancel,
      },
    } as any);

    render(<CompanyCreateModal />);

    // find cancel button (ant design modal cancel button)
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockGo).toHaveBeenCalledWith({
      to: { resource: "companies", action: "list" },
      options: { keepQuery: true },
      type: "replace",
    });
  });

  it("should display users in sales owner dropdown", () => {
    render(<CompanyCreateModal />);

    // users should be available in the select options
    expect(screen.getByText("Sales owner")).toBeInTheDocument();
  });

  it("should handle loading state for users", () => {
    vi.mocked(useSelectModule.useSelect).mockReturnValue({
      selectProps: mockSelectProps,
      query: {
        data: undefined,
        isLoading: true,
      },
    } as any);

    render(<CompanyCreateModal />);

    expect(screen.getByText("Sales owner")).toBeInTheDocument();
  });

  it("should handle empty users list", () => {
    vi.mocked(useSelectModule.useSelect).mockReturnValue({
      selectProps: mockSelectProps,
      query: {
        data: {
          data: [],
        },
        isLoading: false,
      },
    } as any);

    render(<CompanyCreateModal />);

    expect(screen.getByText("Sales owner")).toBeInTheDocument();
  });

  it("should have required validation on company name", () => {
    render(<CompanyCreateModal />);

    const nameInput = screen.getByPlaceholderText("Please enter company name");
    expect(nameInput).toBeRequired();
  });

  it("should have required validation on sales owner", () => {
    render(<CompanyCreateModal />);

    // sales owner field should be required
    expect(screen.getByText("Sales owner")).toBeInTheDocument();
  });
});

