import { describe, it, expect } from "vitest";
import {
  UPDATE_USER_MUTATION,
  CREATE_COMPANY_MUTATION,
  UPDATE_COMPANY_MUTATION,
  UPDATE_TASK_STAGE_MUTATION,
  CREATE_TASK_MUTATION,
  UPDATE_TASK_MUTATION,
} from "../mutations";

describe("GraphQL Mutations", () => {
  describe("UPDATE_USER_MUTATION", () => {
    it("should be defined", () => {
      expect(UPDATE_USER_MUTATION).toBeDefined();
    });

    it("should have correct mutation name", () => {
      const mutationString = UPDATE_USER_MUTATION.loc?.source.body;
      expect(mutationString).toContain("mutation UpdateUser");
    });

    it("should accept UpdateOneUserInput parameter", () => {
      const mutationString = UPDATE_USER_MUTATION.loc?.source.body;
      expect(mutationString).toContain("$input: UpdateOneUserInput!");
    });

    it("should return required user fields", () => {
      const mutationString = UPDATE_USER_MUTATION.loc?.source.body;
      expect(mutationString).toContain("id");
      expect(mutationString).toContain("name");
      expect(mutationString).toContain("avatarUrl");
      expect(mutationString).toContain("email");
      expect(mutationString).toContain("phone");
      expect(mutationString).toContain("jobTitle");
    });

    it("should call updateOneUser mutation", () => {
      const mutationString = UPDATE_USER_MUTATION.loc?.source.body;
      expect(mutationString).toContain("updateOneUser");
    });
  });

  describe("CREATE_COMPANY_MUTATION", () => {
    it("should be defined", () => {
      expect(CREATE_COMPANY_MUTATION).toBeDefined();
    });

    it("should have correct mutation name", () => {
      const mutationString = CREATE_COMPANY_MUTATION.loc?.source.body;
      expect(mutationString).toContain("mutation CreateCompany");
    });

    it("should accept CreateOneCompanyInput parameter", () => {
      const mutationString = CREATE_COMPANY_MUTATION.loc?.source.body;
      expect(mutationString).toContain("$input: CreateOneCompanyInput!");
    });

    it("should return company id and salesOwner", () => {
      const mutationString = CREATE_COMPANY_MUTATION.loc?.source.body;
      expect(mutationString).toContain("id");
      expect(mutationString).toContain("salesOwner");
    });

    it("should return salesOwner id", () => {
      const mutationString = CREATE_COMPANY_MUTATION.loc?.source.body;
      expect(mutationString).toMatch(/salesOwner\s*\{[\s\S]*id[\s\S]*\}/);
    });
  });

  describe("UPDATE_COMPANY_MUTATION", () => {
    it("should be defined", () => {
      expect(UPDATE_COMPANY_MUTATION).toBeDefined();
    });

    it("should have correct mutation name", () => {
      const mutationString = UPDATE_COMPANY_MUTATION.loc?.source.body;
      expect(mutationString).toContain("mutation UpdateCompany");
    });

    it("should accept UpdateOneCompanyInput parameter", () => {
      const mutationString = UPDATE_COMPANY_MUTATION.loc?.source.body;
      expect(mutationString).toContain("$input: UpdateOneCompanyInput!");
    });

    it("should return all company fields", () => {
      const mutationString = UPDATE_COMPANY_MUTATION.loc?.source.body;
      const expectedFields = [
        "id",
        "name",
        "totalRevenue",
        "industry",
        "companySize",
        "businessType",
        "country",
        "website",
        "avatarUrl",
      ];

      expectedFields.forEach((field) => {
        expect(mutationString).toContain(field);
      });
    });

    it("should return salesOwner with id, name, and avatarUrl", () => {
      const mutationString = UPDATE_COMPANY_MUTATION.loc?.source.body;
      expect(mutationString).toMatch(
        /salesOwner\s*\{[\s\S]*id[\s\S]*name[\s\S]*avatarUrl[\s\S]*\}/
      );
    });
  });

  describe("UPDATE_TASK_STAGE_MUTATION", () => {
    it("should be defined", () => {
      expect(UPDATE_TASK_STAGE_MUTATION).toBeDefined();
    });

    it("should have correct mutation name", () => {
      const mutationString = UPDATE_TASK_STAGE_MUTATION.loc?.source.body;
      expect(mutationString).toContain("mutation UpdateTaskStage");
    });

    it("should accept UpdateOneTaskInput parameter", () => {
      const mutationString = UPDATE_TASK_STAGE_MUTATION.loc?.source.body;
      expect(mutationString).toContain("$input: UpdateOneTaskInput!");
    });

    it("should return only task id", () => {
      const mutationString = UPDATE_TASK_STAGE_MUTATION.loc?.source.body;
      expect(mutationString).toContain("id");
      // Should be minimal - only id
      expect(mutationString).not.toContain("title");
      expect(mutationString).not.toContain("description");
    });
  });

  describe("CREATE_TASK_MUTATION", () => {
    it("should be defined", () => {
      expect(CREATE_TASK_MUTATION).toBeDefined();
    });

    it("should have correct mutation name", () => {
      const mutationString = CREATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toContain("mutation CreateTask");
    });

    it("should accept CreateOneTaskInput parameter", () => {
      const mutationString = CREATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toContain("$input: CreateOneTaskInput!");
    });

    it("should return task id and title", () => {
      const mutationString = CREATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toContain("id");
      expect(mutationString).toContain("title");
    });

    it("should return stage with id and title", () => {
      const mutationString = CREATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toMatch(/stage\s*\{[\s\S]*id[\s\S]*title[\s\S]*\}/);
    });
  });

  describe("UPDATE_TASK_MUTATION", () => {
    it("should be defined", () => {
      expect(UPDATE_TASK_MUTATION).toBeDefined();
    });

    it("should have correct mutation name", () => {
      const mutationString = UPDATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toContain("mutation UpdateTask");
    });

    it("should accept UpdateOneTaskInput parameter", () => {
      const mutationString = UPDATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toContain("$input: UpdateOneTaskInput!");
    });

    it("should return comprehensive task fields", () => {
      const mutationString = UPDATE_TASK_MUTATION.loc?.source.body;
      const expectedFields = [
        "id",
        "title",
        "completed",
        "description",
        "dueDate",
      ];

      expectedFields.forEach((field) => {
        expect(mutationString).toContain(field);
      });
    });

    it("should return stage details", () => {
      const mutationString = UPDATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toMatch(/stage\s*\{[\s\S]*id[\s\S]*title[\s\S]*\}/);
    });

    it("should return users array with details", () => {
      const mutationString = UPDATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toMatch(
        /users\s*\{[\s\S]*id[\s\S]*name[\s\S]*avatarUrl[\s\S]*\}/
      );
    });

    it("should return checklist with title and checked", () => {
      const mutationString = UPDATE_TASK_MUTATION.loc?.source.body;
      expect(mutationString).toMatch(
        /checklist\s*\{[\s\S]*title[\s\S]*checked[\s\S]*\}/
      );
    });
  });

  describe("Mutation Structure Consistency", () => {
    it("should all use gql template tag", () => {
      const mutations = [
        UPDATE_USER_MUTATION,
        CREATE_COMPANY_MUTATION,
        UPDATE_COMPANY_MUTATION,
        UPDATE_TASK_STAGE_MUTATION,
        CREATE_TASK_MUTATION,
        UPDATE_TASK_MUTATION,
      ];

      mutations.forEach((mutation) => {
        expect(mutation.kind).toBe("Document");
        expect(mutation.definitions).toBeDefined();
        expect(mutation.definitions.length).toBeGreaterThan(0);
      });
    });

    it("should all have required input parameters", () => {
      const mutations = [
        UPDATE_USER_MUTATION,
        CREATE_COMPANY_MUTATION,
        UPDATE_COMPANY_MUTATION,
        UPDATE_TASK_STAGE_MUTATION,
        CREATE_TASK_MUTATION,
        UPDATE_TASK_MUTATION,
      ];

      mutations.forEach((mutation) => {
        const mutationString = mutation.loc?.source.body;
        expect(mutationString).toContain("$input:");
        expect(mutationString).toContain("!");
      });
    });

    it("should all return at least an id field", () => {
      const mutations = [
        UPDATE_USER_MUTATION,
        CREATE_COMPANY_MUTATION,
        UPDATE_COMPANY_MUTATION,
        UPDATE_TASK_STAGE_MUTATION,
        CREATE_TASK_MUTATION,
        UPDATE_TASK_MUTATION,
      ];

      mutations.forEach((mutation) => {
        const mutationString = mutation.loc?.source.body;
        expect(mutationString).toContain("id");
      });
    });
  });
});