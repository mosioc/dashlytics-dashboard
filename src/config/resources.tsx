/*
 * refine resource configuration defining available routes and navigation menu items
 * each resource maps to crud operations with corresponding routes and display metadata
 */

import type { IResourceItem } from "@refinedev/core";
import {
  DashboardOutlined,
  // ProjectOutlined,
  ShopOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "companies",
    list: "/companies",
    show: "/companies/:id",
    create: "/companies/create",
    edit: "/companies/edit/:id",
    meta: {
      label: "Companies",
      icon: <ShopOutlined />,
    },
  },
  // {
  //   name: "tasks",
  //   list: "/tasks",
  //   create: "/tasks/new",
  //   edit: "/tasks/edit/:id",
  //   meta: {
  //     label: "Tasks",
  //     icon: <ProjectOutlined />,
  //   },
  // },
];
