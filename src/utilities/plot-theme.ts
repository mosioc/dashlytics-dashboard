/**
 * theme helper for Ant Design Plots (G2Plot)
 * provides light/dark color palettes and theme config
 */

// light mode palette
const lightPalette = {
  colors10: ["#1677ff", "#52c41a", "#faad14", "#eb2f96", "#722ed1"],
  colors20: [
    "#1677ff",
    "#52c41a",
    "#faad14",
    "#eb2f96",
    "#722ed1",
    "#13c2c2",
    "#f759ab",
    "#fa541c",
    "#a0d911",
  ],
};

// dark mode palette
const darkPalette = {
  colors10: ["#49a6ff", "#78d573", "#f7c646", "#ff6bba", "#9b79f2"],
  colors20: [
    "#49a6ff",
    "#78d573",
    "#f7c646",
    "#ff6bba",
    "#9b79f2",
    "#29dcdc",
    "#ff8fb0",
    "#ff9c40",
    "#b9e151",
  ],
};

/**
 * get plot theme configuration based on light/dark mode
 * pass this to any Ant Design Plot's `theme` prop
 */
export const getPlotTheme = (mode: "light" | "dark") => ({
  type: mode === "dark" ? "dark" : "light",
  styleSheet: mode === "dark" ? darkPalette : lightPalette,
});
