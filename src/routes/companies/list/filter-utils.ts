/* utility functions for managing filter presets and saved views in localStorage
 * provides functions to save, load, and delete filter configurations
 */

const SAVED_VIEWS_KEY = "companies_saved_views";

export type FilterPreset = {
  id: string;
  name: string;
  filters: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  sorters?: Array<{
    field: string;
    order: "asc" | "desc";
  }>;
};

export type SavedView = {
  id: string;
  name: string;
  filters: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  sorters?: Array<{
    field: string;
    order: "asc" | "desc";
  }>;
  createdAt: string;
};

// get all saved views from localStorage
export const getSavedViews = (): SavedView[] => {
  try {
    const stored = localStorage.getItem(SAVED_VIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// save a new view to localStorage
export const saveView = (view: Omit<SavedView, "id" | "createdAt">): SavedView => {
  const views = getSavedViews();
  const newView: SavedView = {
    ...view,
    id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  views.push(newView);
  localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(views));
  return newView;
};

// delete a saved view by id
export const deleteSavedView = (id: string): void => {
  const views = getSavedViews();
  const filtered = views.filter((v) => v.id !== id);
  localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(filtered));
};

// get predefined filter presets
export const getFilterPresets = (): FilterPreset[] => {
  return [
    {
      id: "high_value",
      name: "High Value",
      filters: [
        {
          field: "totalRevenue",
          operator: "gte",
          value: 10000,
        },
      ],
      sorters: [
        {
          field: "totalRevenue",
          order: "desc",
        },
      ],
    },
    {
      id: "recently_created",
      name: "Recently Created",
      filters: [
        {
          field: "createdAt",
          operator: "gte",
          value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // last 30 days
        },
      ],
      sorters: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    {
      id: "all",
      name: "All Companies",
      filters: [],
      sorters: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
  ];
};

