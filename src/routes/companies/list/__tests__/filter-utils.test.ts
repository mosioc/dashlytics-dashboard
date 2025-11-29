// filter utilities tests
import { describe, it, expect, beforeEach } from "vitest";
import {
  getSavedViews,
  saveView,
  deleteSavedView,
  getFilterPresets,
  type SavedView,
} from "../filter-utils";

describe("filter-utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getSavedViews", () => {
    it("should return empty array when no views exist", () => {
      const views = getSavedViews();
      expect(views).toEqual([]);
    });

    it("should return parsed views from localStorage", () => {
      const mockViews: SavedView[] = [
        {
          id: "view-1",
          name: "My View",
          filters: [{ field: "name", operator: "contains", value: "test" }],
          sorters: [{ field: "createdAt", order: "desc" }],
          createdAt: "2025-01-01T00:00:00.000Z",
        },
      ];

      localStorage.setItem(
        "companies_saved_views",
        JSON.stringify(mockViews)
      );

      const views = getSavedViews();
      expect(views).toEqual(mockViews);
    });

    it("should return empty array on parse error", () => {
      localStorage.setItem("companies_saved_views", "invalid json");

      const views = getSavedViews();
      expect(views).toEqual([]);
    });
  });

  describe("saveView", () => {
    it("should save view to localStorage with generated id", () => {
      const viewData = {
        name: "New View",
        filters: [{ field: "name", operator: "contains", value: "test" }],
        sorters: [{ field: "createdAt", order: "asc" }],
      };

      const savedView = saveView(viewData);

      expect(savedView.id).toMatch(/^view_\d+_[a-z0-9]+$/);
      expect(savedView.name).toBe("New View");
      expect(savedView.filters).toEqual(viewData.filters);
      expect(savedView.sorters).toEqual(viewData.sorters);
      expect(savedView.createdAt).toBeDefined();

      const views = getSavedViews();
      expect(views).toHaveLength(1);
      expect(views[0]).toEqual(savedView);
    });

    it("should append to existing views", () => {
      const firstView = {
        name: "First View",
        filters: [],
      };
      const secondView = {
        name: "Second View",
        filters: [],
      };

      saveView(firstView);
      saveView(secondView);

      const views = getSavedViews();
      expect(views).toHaveLength(2);
      expect(views[0].name).toBe("First View");
      expect(views[1].name).toBe("Second View");
    });

    it("should generate unique ids", () => {
      const viewData = {
        name: "View",
        filters: [],
      };

      const view1 = saveView(viewData);
      const view2 = saveView(viewData);

      expect(view1.id).not.toBe(view2.id);
    });
  });

  describe("deleteSavedView", () => {
    it("should delete view by id", () => {
      const view1 = saveView({
        name: "View 1",
        filters: [],
      });
      const view2 = saveView({
        name: "View 2",
        filters: [],
      });

      deleteSavedView(view1.id);

      const views = getSavedViews();
      expect(views).toHaveLength(1);
      expect(views[0].id).toBe(view2.id);
    });

    it("should handle deleting non-existent view", () => {
      saveView({
        name: "View 1",
        filters: [],
      });

      deleteSavedView("non-existent-id");

      const views = getSavedViews();
      expect(views).toHaveLength(1);
    });

    it("should handle deleting from empty list", () => {
      deleteSavedView("any-id");

      const views = getSavedViews();
      expect(views).toEqual([]);
    });
  });

  describe("getFilterPresets", () => {
    it("should return predefined presets", () => {
      const presets = getFilterPresets();

      expect(presets).toHaveLength(3);
      expect(presets[0].id).toBe("high_value");
      expect(presets[1].id).toBe("recently_created");
      expect(presets[2].id).toBe("all");
    });

    it("should have high value preset with correct filters", () => {
      const presets = getFilterPresets();
      const highValue = presets.find((p) => p.id === "high_value");

      expect(highValue).toBeDefined();
      expect(highValue?.name).toBe("High Value");
      expect(highValue?.filters).toHaveLength(1);
      expect(highValue?.filters[0]).toEqual({
        field: "totalRevenue",
        operator: "gte",
        value: 10000,
      });
      expect(highValue?.sorters).toEqual([
        { field: "totalRevenue", order: "desc" },
      ]);
    });

    it("should have recently created preset with date filter", () => {
      const presets = getFilterPresets();
      const recentlyCreated = presets.find(
        (p) => p.id === "recently_created"
      );

      expect(recentlyCreated).toBeDefined();
      expect(recentlyCreated?.name).toBe("Recently Created");
      expect(recentlyCreated?.filters).toHaveLength(1);
      expect(recentlyCreated?.filters[0].field).toBe("createdAt");
      expect(recentlyCreated?.filters[0].operator).toBe("gte");
      expect(recentlyCreated?.sorters).toEqual([
        { field: "createdAt", order: "desc" },
      ]);
    });

    it("should have all companies preset with empty filters", () => {
      const presets = getFilterPresets();
      const all = presets.find((p) => p.id === "all");

      expect(all).toBeDefined();
      expect(all?.name).toBe("All Companies");
      expect(all?.filters).toEqual([]);
      expect(all?.sorters).toEqual([{ field: "createdAt", order: "desc" }]);
    });
  });
});

