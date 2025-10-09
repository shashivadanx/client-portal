import { Outlet } from "react-router";
import ClientAppShell from "./components";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { Header } from "@/components/layout/header";
import { UniversalBreadcrumb } from "@/components/layout/universal-breadcrumb";

export default function AppShell() {
  const defaultOpen = Cookies.get("sidebar:state") !== "false";
  return (
    <div>
      <SidebarProvider defaultOpen={defaultOpen}>
        <ClientAppShell />
        <SidebarInset>
          <Header>
            <UniversalBreadcrumb />
            {/* <div className="ml-auto flex items-center space-x-4">
              <ThemeSwitch />
            </div> */}
          </Header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
