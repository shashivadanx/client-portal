import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { clientSidebarData } from "../data/app-shell-data";
import { ClientNavGroup } from "./client-nav-group";
import { ClientNavUser } from "./client-nav-user";
import { ClientProfile } from "./client-profile";

export default function ClientAppShell({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const sidebarData = clientSidebarData({ clientId: "" });
  return (
    <div>
      <Sidebar collapsible="icon" variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <ClientProfile />
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {sidebarData.navGroups.map((props) => (
            <ClientNavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <ClientNavUser />{" "}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}
