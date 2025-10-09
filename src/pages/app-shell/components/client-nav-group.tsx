import { Link, useLocation } from "react-router";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";

interface BaseNavItem {
  title: string;
  icon?: React.ElementType;
  visible?: boolean;
  roles: Array<"client">;
  badge?: string;
}

type NavParams = Record<string, string | number>;

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
  params?: NavParams;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string; params?: NavParams })[];
  url?: never;
  params?: NavParams;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title?: string;
  items: NavItem[];
}

interface SidebarData {
  navGroups: NavGroup[];
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };

export function ClientNavGroup({ title, items }: NavGroup) {
  const { state } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${getItemUrl(item)}`;

          if (!item.items)
            return (
              <SidebarMenuLink key={key} item={item} pathname={pathname} />
            );

          if (state === "collapsed")
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                pathname={pathname}
              />
            );

          return (
            <SidebarMenuCollapsible key={key} item={item} pathname={pathname} />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// Helper function to get the URL from an item, supporting both url string and url+params structure
const getItemUrl = (item: NavItem): string => {
  if ("url" in item && typeof item.url === "string") {
    return item.url;
  }
  // If url is not a string, return empty string as fallback
  return "";
};

// Helper function to get Link props, supporting both url string and url+params structure
const getLinkProps = (item: NavItem) => {
  // When `url` is a pattern string like "/clients/:id" or contains "$id", replace params if provided
  if ("url" in item && typeof item.url === "string") {
    const baseUrl = item.url as string;
    if (item.params && typeof item.params === "object") {
      let url = baseUrl;
      Object.entries(item.params).forEach(([key, value]) => {
        const v = String(value);
        url = url.replace(`:${key}`, v);
        url = url.replace(`$${key}`, v);
      });
      return { to: url } as const;
    }
    return { to: baseUrl } as const;
  }
  // Fallback for collapsible items without direct url
  return { to: "" } as const;
};

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
);

const SidebarMenuLink = ({
  item,
  pathname,
}: {
  item: NavLink;
  pathname: string;
}) => {
  const { setOpenMobile } = useSidebar();
  const linkProps = getLinkProps(item);

  return (
    <SidebarMenuItem>
      {
        <SidebarMenuButton
          asChild
          isActive={checkIsActive(pathname, item)}
          tooltip={item.title}
        >
          <Link {...linkProps} onClick={() => setOpenMobile(false)}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </Link>
        </SidebarMenuButton>
      }
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  pathname,
}: {
  item: NavCollapsible;
  pathname: string;
}) => {
  const { setOpenMobile } = useSidebar();
  return (
    <>
      {
        <Collapsible
          asChild
          defaultOpen={checkIsActive(pathname, item, true)}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent">
              <SidebarMenuSub>
                {item.items.map((subItem) => {
                  const subLinkProps = getLinkProps(subItem);
                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={checkIsActive(pathname, subItem)}
                      >
                        <Link
                          {...subLinkProps}
                          onClick={() => setOpenMobile(false)}
                        >
                          {subItem.icon && <subItem.icon />}
                          <span>{subItem.title}</span>
                          {subItem.badge && (
                            <NavBadge>{subItem.badge}</NavBadge>
                          )}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      }
    </>
  );
};

const SidebarMenuCollapsedDropdown = ({
  item,
  pathname,
}: {
  item: NavCollapsible;
  pathname: string;
}) => {
  return (
    <>
      {
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={checkIsActive(pathname, item)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" sideOffset={4}>
              <DropdownMenuLabel>
                {item.title} {item.badge ? `(${item.badge})` : ""}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {item.items.map((sub) => {
                const subLinkProps = getLinkProps(sub);
                return (
                  <DropdownMenuItem
                    key={`${sub.title}-${getItemUrl(sub)}`}
                    asChild
                  >
                    <Link
                      {...subLinkProps}
                      className={`${
                        checkIsActive(pathname, sub) ? "bg-secondary" : ""
                      }`}
                    >
                      {sub.icon && <sub.icon />}
                      <span className="max-w-52 text-wrap">{sub.title}</span>
                      {sub.badge && (
                        <span className="ml-auto text-xs">{sub.badge}</span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      }
    </>
  );
};

function checkIsActive(pathname: string, item: NavItem, mainNav = false) {
  const itemUrl = getItemUrl(item);

  return (
    pathname === itemUrl || // /endpoint
    pathname.split("?")[0] === itemUrl || // endpoint with query params
    !!item?.items?.filter((i) => getItemUrl(i) === pathname).length || // if child nav is active
    (mainNav &&
      pathname.split("/")[1] !== "" &&
      pathname.split("/")[1] === itemUrl?.split("/")[1])
  );
}
