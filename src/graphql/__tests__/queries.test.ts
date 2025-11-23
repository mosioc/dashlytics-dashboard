import { describe, it, expect } from "vitest";
import { USERS_SELECT_QUERY, TASK_STAGES_SELECT_QUERY } from "../queries";

describe("GraphQL Queries", () => {
  describe("USERS_SELECT_QUERY", () => {
    it("should be defined", () => {
      expect(USERS_SELECT_QUERY).toBeDefined();
    });

    it("should have correct query name", () => {
      const queryString = USERS_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain("query UsersSelect");
    });

    it("should accept filter, sorting, and paging parameters", () => {
      const queryString = USERS_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain("$filter: UserFilter!");
      expect(queryString).toContain("$sorting: [UserSort!]");
      expect(queryString).toContain("$paging: OffsetPaging!");
    });

    it("should query users with filter, sorting, and paging", () => {
      const queryString = USERS_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain(
        "users(filter: $filter, sorting: $sorting, paging: $paging)"
      );
    });

    it("should return totalCount", () => {
      const queryString = USERS_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain("totalCount");
    });

    it("should return nodes with user details", () => {
      const queryString = USERS_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain("nodes");
      expect(queryString).toContain("id");
      expect(queryString).toContain("name");
      expect(queryString).toContain("avatarUrl");
    });

    it("should have proper GraphQL structure", () => {
      expect(USERS_SELECT_QUERY.kind).toBe("Document");
      expect(USERS_SELECT_QUERY.definitions).toBeDefined();
      expect(USERS_SELECT_QUERY.definitions.length).toBeGreaterThan(0);
    });

    it("should use required filter parameter", () => {
      const queryString = USERS_SELECT_QUERY.loc?.source.body;
      expect(queryString).toMatch(/\$filter:\s*UserFilter!/);
    });

    it("should use optional sorting parameter", () => {
      const queryString = USERS_SELECT_QUERY.loc?.source.body;
      // Should not have ! after [UserSort!]
      expect(queryString).toContain("$sorting: [UserSort!]");
      expect(queryString).not.toMatch(/\$sorting:\s*\[UserSort!\]!/);
    });
  });

  describe("TASK_STAGES_SELECT_QUERY", () => {
    it("should be defined", () => {
      expect(TASK_STAGES_SELECT_QUERY).toBeDefined();
    });

    it("should have correct query name", () => {
      const queryString = TASK_STAGES_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain("query TaskStagesSelect");
    });

    it("should accept filter, sorting, and paging parameters", () => {
      const queryString = TASK_STAGES_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain("$filter: TaskStageFilter!");
      expect(queryString).toContain("$sorting: [TaskStageSort!]");
      expect(queryString).toContain("$paging: OffsetPaging!");
    });

    it("should query taskStages with filter, sorting, and paging", () => {
      const queryString = TASK_STAGES_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain(
        "taskStages(filter: $filter, sorting: $sorting, paging: $paging)"
      );
    });

    it("should return totalCount", () => {
      const queryString = TASK_STAGES_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain("totalCount");
    });

    it("should return nodes with stage details", () => {
      const queryString = TASK_STAGES_SELECT_QUERY.loc?.source.body;
      expect(queryString).toContain("nodes");
      expect(queryString).toContain("id");
      expect(queryString).toContain("title");
    });

    it("should have proper GraphQL structure", () => {
      expect(TASK_STAGES_SELECT_QUERY.kind).toBe("Document");
      expect(TASK_STAGES_SELECT_QUERY.definitions).toBeDefined();
      expect(TASK_STAGES_SELECT_QUERY.definitions.length).toBeGreaterThan(0);
    });

    it("should return minimal fields for dropdown usage", () => {
      const queryString = TASK_STAGES_SELECT_QUERY.loc?.source.body;
      // Should only return id and title for select dropdowns
      const nodesMatch = queryString?.match(/nodes\s*\{[^}]*\}/);
      expect(nodesMatch).toBeTruthy();
      if (nodesMatch) {
        expect(nodesMatch[0]).toContain("id");
        expect(nodesMatch[0]).toContain("title");
        // Should not contain other fields
        expect(nodesMatch[0]).not.toContain("description");
        expect(nodesMatch[0]).not.toContain("createdAt");
      }
    });
  });

  describe("Query Structure Consistency", () => {
    it("should both use gql template tag", () => {
      const queries = [USERS_SELECT_QUERY, TASK_STAGES_SELECT_QUERY];

      queries.forEach((query) => {
        expect(query.kind).toBe("Document");
        expect(query.definitions).toBeDefined();
        expect(query.definitions.length).toBeGreaterThan(0);
      });
    });

    it("should both have filter, sorting, and paging parameters", () => {
      const queries = [USERS_SELECT_QUERY, TASK_STAGES_SELECT_QUERY];

      queries.forEach((query) => {
        const queryString = query.loc?.source.body;
        expect(queryString).toContain("$filter:");
        expect(queryString).toContain("$sorting:");
        expect(queryString).toContain("$paging:");
      });
    });

    it("should both return totalCount and nodes", () => {
      const queries = [USERS_SELECT_QUERY, TASK_STAGES_SELECT_QUERY];

      queries.forEach((query) => {
        const queryString = query.loc?.source.body;
        expect(queryString).toContain("totalCount");
        expect(queryString).toContain("nodes");
      });
    });

    it("should both have required filter parameter", () => {
      const queries = [USERS_SELECT_QUERY, TASK_STAGES_SELECT_QUERY];

      queries.forEach((query) => {
        const queryString = query.loc?.source.body;
        expect(queryString).toMatch(/\$filter:[^!]*!/);
      });
    });

    it("should both have required paging parameter", () => {
      const queries = [USERS_SELECT_QUERY, TASK_STAGES_SELECT_QUERY];

      queries.forEach((query) => {
        const queryString = query.loc?.source.body;
        expect(queryString).toMatch(/\$paging:[^!]*!/);
      });
    });
  });

  describe("Query Return Types", () => {
    it("USERS_SELECT_QUERY should return user connection type", () => {
      const queryString = USERS_SELECT_QUERY.loc?.source.body;
      expect(queryString).toMatch(/users.*\{[\s\S]*totalCount[\s\S]*nodes/);
    });

    it("TASK_STAGES_SELECT_QUERY should return task stage connection type", () => {
      const queryString = TASK_STAGES_SELECT_QUERY.loc?.source.body;
      expect(queryString).toMatch(
        /taskStages.*\{[\s\S]*totalCount[\s\S]*nodes/
      );
    });

    it("should return appropriate fields for select components", () => {
      // Users select should have id, name, avatarUrl
      const usersQuery = USERS_SELECT_QUERY.loc?.source.body;
      expect(usersQuery).toContain("id");
      expect(usersQuery).toContain("name");
      expect(usersQuery).toContain("avatarUrl");

      // Task stages select should have id, title
      const stagesQuery = TASK_STAGES_SELECT_QUERY.loc?.source.body;
      expect(stagesQuery).toContain("id");
      expect(stagesQuery).toContain("title");
    });
  });
});