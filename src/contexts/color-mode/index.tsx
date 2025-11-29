import { type PropsWithChildren, createContext, useEffect, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

type ColorModeContextType = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("refine-theme");
    if (saved === "dark" || saved === "light") {
      setMode(saved);
    } else {
      // fallback to system preference
      const isSystemDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(isSystemDark ? "dark" : "light");
    }
  }, []);

  // persist theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("refine-theme", mode);
  }, [mode]);

  // toggle theme between light and dark
  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm:
            mode === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};

