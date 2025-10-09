import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function ClientProfile() {
  const client = {
    name: "Client",
    logo: "/placeholder.svg?height=36&width=36",
    role: "Client",
    id: "client",
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="relative mb-2 bg-sidebar-accent/20 hover:bg-sidebar-accent/30 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-9 items-center justify-center">
            <Avatar className="size-9 overflow-hidden rounded-lg border-2 border-sidebar-border shadow-sm">
              <AvatarImage
                src={client?.logo || "/placeholder.svg?height=36&width=36"}
                alt={client?.name || "Client"}
                className="rounded-lg object-cover"
              />
              <AvatarFallback className="flex items-center justify-center rounded-lg bg-sidebar-primary text-base font-semibold text-sidebar-primary-foreground">
                {client?.name
                  ? client.name.substring(0, 2).toUpperCase()
                  : "OR"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold">
              {client?.name || "Select Client"}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
