import { describe, it, expect } from "vitest";
import type {
  UpdateUserMutationVariables,
  UpdateUserMutation,
  CreateCompanyMutationVariables,
  CreateCompanyMutation,
  UpdateCompanyMutationVariables,
  UpdateCompanyMutation,
  UpdateTaskStageMutationVariables,
  UpdateTaskStageMutation,
  CreateTaskMutationVariables,
  CreateTaskMutation,
  UpdateTaskMutationVariables,
  UpdateTaskMutation,
  UsersSelectQueryVariables,
  UsersSelectQuery,
  TaskStagesSelectQueryVariables,
  TaskStagesSelectQuery,
} from "../types";

describe("GraphQL TypeScript Types", () => {
  describe("Mutation Variable Types", () => {
    it("should type UpdateUserMutationVariables correctly", () => {
      const variables: UpdateUserMutationVariables = {
        input: {
          id: "1",
          update: {
            name: "Test User",
          },
        },
      };
      expect(variables.input).toBeDefined();
      expect(variables.input.id).toBe("1");
    });

    it("should type CreateCompanyMutationVariables correctly", () => {
      const variables: CreateCompanyMutationVariables = {
        input: {
          company: {
            name: "Test Company",
            salesOwnerId: "1",
          },
        },
      };
      expect(variables.input).toBeDefined();
      expect(variables.input.company.name).toBe("Test Company");
    });

    it("should type UpdateCompanyMutationVariables correctly", () => {
      const variables: UpdateCompanyMutationVariables = {
        input: {
          id: "1",
          update: {
            name: "Updated Company",
          },
        },
      };
      expect(variables.input).toBeDefined();
      expect(variables.input.id).toBe("1");
    });

    it("should type UpdateTaskStageMutationVariables correctly", () => {
      const variables: UpdateTaskStageMutationVariables = {
        input: {
          id: "1",
          update: {
            stageId: "2",
          },
        },
      };
      expect(variables.input).toBeDefined();
      expect(variables.input.id).toBe("1");
    });

    it("should type CreateTaskMutationVariables correctly", () => {
      const variables: CreateTaskMutationVariables = {
        input: {
          task: {
            title: "New Task",
            stageId: "1",
          },
        },
      };
      expect(variables.input).toBeDefined();
      expect(variables.input.task.title).toBe("New Task");
    });

    it("should type UpdateTaskMutationVariables correctly", () => {
      const variables: UpdateTaskMutationVariables = {
        input: {
          id: "1",
          update: {
            title: "Updated Task",
            completed: true,
          },
        },
      };
      expect(variables.input).toBeDefined();
      expect(variables.input.id).toBe("1");
    });
  });

  describe("Query Variable Types", () => {
    it("should type UsersSelectQueryVariables correctly", () => {
      const variables: UsersSelectQueryVariables = {
        filter: {},
        sorting: [{ field: "name", direction: "ASC" }],
        paging: { limit: 10, offset: 0 },
      };
      expect(variables.filter).toBeDefined();
      expect(variables.paging).toBeDefined();
    });

    it("should type TaskStagesSelectQueryVariables correctly", () => {
      const variables: TaskStagesSelectQueryVariables = {
        filter: {},
        sorting: [{ field: "title", direction: "ASC" }],
        paging: { limit: 10, offset: 0 },
      };
      expect(variables.filter).toBeDefined();
      expect(variables.paging).toBeDefined();
    });
  });

  describe("Mutation Response Types", () => {
    it("should type UpdateUserMutation response correctly", () => {
      const response: UpdateUserMutation = {
        updateOneUser: {
          id: "1",
          name: "Test User",
          avatarUrl: "https://example.com/avatar.jpg",
          email: "test@example.com",
          phone: "+1234567890",
          jobTitle: "Developer",
        },
      };
      expect(response.updateOneUser.id).toBe("1");
      expect(response.updateOneUser.name).toBeDefined();
    });

    it("should type CreateCompanyMutation response correctly", () => {
      const response: CreateCompanyMutation = {
        createOneCompany: {
          id: "1",
          salesOwner: {
            id: "1",
          },
        },
      };
      expect(response.createOneCompany.id).toBe("1");
      expect(response.createOneCompany.salesOwner).toBeDefined();
    });

    it("should type UpdateCompanyMutation response correctly", () => {
      const response: UpdateCompanyMutation = {
        updateOneCompany: {
          id: "1",
          name: "Test Company",
          totalRevenue: 1000000,
          industry: "TECH",
          companySize: "MEDIUM",
          businessType: "B2B",
          country: "US",
          website: "https://example.com",
          avatarUrl: "https://example.com/logo.png",
          salesOwner: {
            id: "1",
            name: "Sales Owner",
            avatarUrl: "https://example.com/avatar.jpg",
          },
        },
      };
      expect(response.updateOneCompany.id).toBe("1");
      expect(response.updateOneCompany.salesOwner).toBeDefined();
    });

    it("should type UpdateTaskStageMutation response correctly", () => {
      const response: UpdateTaskStageMutation = {
        updateOneTask: {
          id: "1",
        },
      };
      expect(response.updateOneTask.id).toBe("1");
    });

    it("should type CreateTaskMutation response correctly", () => {
      const response: CreateTaskMutation = {
        createOneTask: {
          id: "1",
          title: "New Task",
          stage: {
            id: "1",
            title: "Todo",
          },
        },
      };
      expect(response.createOneTask.id).toBe("1");
      expect(response.createOneTask.title).toBe("New Task");
    });

    it("should type UpdateTaskMutation response correctly with all fields", () => {
      const response: UpdateTaskMutation = {
        updateOneTask: {
          id: "1",
          title: "Updated Task",
          completed: true,
          description: "Task description",
          dueDate: "2024-12-31",
          stage: {
            id: "1",
            title: "In Progress",
          },
          users: [
            {
              id: "1",
              name: "User 1",
              avatarUrl: "https://example.com/avatar1.jpg",
            },
          ],
          checklist: [
            {
              title: "Item 1",
              checked: true,
            },
          ],
        },
      };
      expect(response.updateOneTask.id).toBe("1");
      expect(response.updateOneTask.users).toHaveLength(1);
      expect(response.updateOneTask.checklist).toHaveLength(1);
    });
  });

  describe("Query Response Types", () => {
    it("should type UsersSelectQuery response correctly", () => {
      const response: UsersSelectQuery = {
        users: {
          totalCount: 10,
          nodes: [
            {
              id: "1",
              name: "User 1",
              avatarUrl: "https://example.com/avatar1.jpg",
            },
            {
              id: "2",
              name: "User 2",
              avatarUrl: "https://example.com/avatar2.jpg",
            },
          ],
        },
      };
      expect(response.users.totalCount).toBe(10);
      expect(response.users.nodes).toHaveLength(2);
    });

    it("should type TaskStagesSelectQuery response correctly", () => {
      const response: TaskStagesSelectQuery = {
        taskStages: {
          totalCount: 5,
          nodes: [
            {
              id: "1",
              title: "Todo",
            },
            {
              id: "2",
              title: "In Progress",
            },
          ],
        },
      };
      expect(response.taskStages.totalCount).toBe(5);
      expect(response.taskStages.nodes).toHaveLength(2);
    });
  });

  describe("Type Safety", () => {
    it("should enforce required fields in mutation variables", () => {
      // This test verifies at compile time that required fields are enforced
      const validVariables: UpdateUserMutationVariables = {
        input: {
          id: "1",
          update: {},
        },
      };
      expect(validVariables.input.id).toBeDefined();
    });

    it("should allow optional fields in responses", () => {
      const response: CreateTaskMutation = {
        createOneTask: {
          id: "1",
          title: "Task",
          stage: null, // stage is optional (Maybe type)
        },
      };
      expect(response.createOneTask.stage).toBeNull();
    });

    it("should handle empty arrays in responses", () => {
      const response: UpdateTaskMutation = {
        updateOneTask: {
          id: "1",
          title: "Task",
          completed: false,
          description: "Description",
          dueDate: "2024-12-31",
          stage: null,
          users: [], // Empty array is valid
          checklist: [],
        },
      };
      expect(response.updateOneTask.users).toHaveLength(0);
      expect(response.updateOneTask.checklist).toHaveLength(0);
    });
  });
});