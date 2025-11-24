import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { dataProvider, liveProvider, authProvider } from "./providers";
import { resources } from "./config/resources";
import { ComponentLayout } from "./components";
import {
  CompanyCreatePage,
  CompanyEditPage,
  CompanyListPage,
  DashboardPage,
  LoginPage,
} from "./routes";

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
                  {/* authenticated routes - requires login, redirects to /login if not authenticated */}
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
                  >
                    {/* dashboard home page */}
                    <Route index element={<DashboardPage />} />

                    {/* companies crud routes */}
                    <Route path="/companies">
                      <Route index element={<CompanyListPage />} />
                      <Route path="create" element={<CompanyCreatePage />} />
                      <Route path="edit/:id" element={<CompanyEditPage />} />
                    </Route>

                    {/* 404 fallback for authenticated users */}
                    {/* <Route path="*" element={<ErrorComponent />} /> */}
                  </Route>

                  {/* public auth routes - redirects to dashboard if already authenticated */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-auth"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource resource="dashboard" />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<LoginPage />} />
                  </Route>
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
