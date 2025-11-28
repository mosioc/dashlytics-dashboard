/* quick filter buttons and saved views component
 * provides preset filter buttons and saved views management
 */

import React, { useState, useEffect } from "react";
import { Button, Dropdown, Input, Modal, Space } from "antd";
import type { MenuProps } from "antd";
import {
  FilterOutlined,
  SaveOutlined,
  DeleteOutlined,
  DownOutlined,
} from "@ant-design/icons";
import type { CrudFilters, CrudSorting } from "@refinedev/core";
import {
  getFilterPresets,
  getSavedViews,
  saveView,
  deleteSavedView,
  type FilterPreset,
  type SavedView,
} from "./filter-utils";

type FilterButtonsProps = {
  filters: CrudFilters;
  sorters: CrudSorting;
  onFiltersChange: (filters: CrudFilters) => void;
  onSortersChange: (sorters: CrudSorting) => void;
};

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  filters,
  sorters,
  onFiltersChange,
  onSortersChange,
}) => {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [saveViewModalVisible, setSaveViewModalVisible] = useState(false);
  const [viewName, setViewName] = useState("");
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  useEffect(() => {
    setSavedViews(getSavedViews());
  }, []);

  const presets = getFilterPresets();

  // apply a filter preset
  const applyPreset = (preset: FilterPreset) => {
    setActivePresetId(preset.id);

    // create completely new filter objects each time with fresh references
    const refinedFilters: CrudFilters = preset.filters.map((f) => ({
      field: String(f.field),
      operator: f.operator as "eq" | "ne" | "lt" | "gt" | "lte" | "gte" | "in" | "nin" | "contains" | "ncontains" | "null" | "nnull",
      value: f.value,
    }));

    // create completely new sorter objects each time
    const refinedSorters: CrudSorting = (preset.sorters || []).map((s) => ({
      field: s.field,
      order: s.order,
    }));

    // apply filters and sorters directly
    // create new array instances to ensure change detection
    onFiltersChange(Array.from(refinedFilters));
    onSortersChange(Array.from(refinedSorters));
  };

  // apply a saved view
  const applySavedView = (view: SavedView) => {
    setActivePresetId(null);

    // create completely new filter objects each time with fresh references
    const refinedFilters: CrudFilters = view.filters.map((f) => ({
      field: String(f.field),
      operator: f.operator as "eq" | "ne" | "lt" | "gt" | "lte" | "gte" | "in" | "nin" | "contains" | "ncontains" | "null" | "nnull",
      value: f.value,
    }));

    // create completely new sorter objects each time
    const refinedSorters: CrudSorting = (view.sorters || []).map((s) => ({
      field: s.field,
      order: s.order,
    }));

    // apply filters and sorters directly
    // create new array instances to ensure change detection
    onFiltersChange(Array.from(refinedFilters));
    onSortersChange(Array.from(refinedSorters));
  };

  // save current view
  const handleSaveView = () => {
    if (!viewName.trim()) return;

    // filter out conditional filters and only save filters with field property
    const currentFilters = filters
      .filter((f) => "field" in f && "operator" in f)
      .map((f) => {
        const filter = f as { field: string; operator: string; value: unknown };
        return {
          field: filter.field,
          operator: filter.operator || "contains",
          value: filter.value,
        };
      });

    const currentSorters = sorters.map((s) => ({
      field: s.field,
      order: s.order,
    }));

    saveView({
      name: viewName.trim(),
      filters: currentFilters,
      sorters: currentSorters,
    });

    setSavedViews(getSavedViews());
    setViewName("");
    setSaveViewModalVisible(false);
  };

  // delete a saved view
  const handleDeleteView = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedView(id);
    setSavedViews(getSavedViews());
  };

  // build saved views menu items
  const savedViewsMenuItems: MenuProps["items"] = [
    ...savedViews.map((view) => ({
      key: view.id,
      label: (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{view.name}</span>
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={(e) => handleDeleteView(view.id, e)}
            style={{ marginLeft: 8 }}
          />
        </div>
      ),
      onClick: () => applySavedView(view),
    })),
    {
      type: "divider",
    },
    {
      key: "save_current",
      label: (
        <Space>
          <SaveOutlined />
          Save current view
        </Space>
      ),
      onClick: () => setSaveViewModalVisible(true),
    },
  ];

  return (
    <>
      <Space wrap style={{ marginBottom: 16 }}>
        {/* quick filter preset buttons */}
        {presets.map((preset) => (
          <Button
            key={preset.id}
            type={activePresetId === preset.id ? "primary" : "default"}
            icon={<FilterOutlined />}
            onClick={() => applyPreset(preset)}
          >
            {preset.name}
          </Button>
        ))}

        {/* saved views dropdown */}
        {savedViews.length > 0 && (
          <Dropdown menu={{ items: savedViewsMenuItems }} trigger={["click"]}>
            <Button>
              Saved Views <DownOutlined />
            </Button>
          </Dropdown>
        )}

        {/* save current view button (always visible) */}
        <Button
          icon={<SaveOutlined />}
          onClick={() => setSaveViewModalVisible(true)}
        >
          Save View
        </Button>
      </Space>

      {/* save view modal */}
      <Modal
        title="Save Current View"
        open={saveViewModalVisible}
        onOk={handleSaveView}
        onCancel={() => {
          setSaveViewModalVisible(false);
          setViewName("");
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter view name"
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
          onPressEnter={handleSaveView}
          autoFocus
        />
      </Modal>
    </>
  );
};

