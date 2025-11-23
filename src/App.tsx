import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
  CatchAllNavigate,
} from "@refinedev/react-router";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { dataProvider, liveProvider, authProvider } from "./providers";
import { LoginPage } from "./routes/login";
import { resources } from "./config/resources";
import { ComponentLayout } from "./components";

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Green}>
        <RefineKbarProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "86WOi9-huED18-lKC55a",
                  liveMode: "auto",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-layout"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ComponentLayout>
                          <Outlet />
                        </ComponentLayout>
                      </Authenticated>
                    }
                  ></Route>

                  <Route path="/login" element={<LoginPage />} />
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
