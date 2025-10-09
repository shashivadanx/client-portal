import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";

import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbStore } from "@/store/breadcrumb";

// This function converts route paths to readable titles
// e.g., "user-management" becomes "User Management"
const formatRouteSegment = (
  segment: string,
  breadcrumb: { id: string; title: string }[]
): string => {
  const matchingItem = breadcrumb.find((item) => item.id === segment);
  if (matchingItem) {
    return matchingItem.title;
  }
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function UniversalBreadcrumb() {
  const location = useLocation();
  // Track the current path in state to ensure component updates
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    // Update path when location changes
    setCurrentPath(location.pathname);
  }, [location]);

  const breadcrumb = useBreadcrumbStore((state) => state.breadcrumb);
  const hiddenBreadcrumbSegments = useBreadcrumbStore(
    (state) => state.hiddenBreadcrumbSegments
  );

  const breadcrumbItems = useMemo(() => {
    // Remove leading slash and split by slashes
    const pathSegments = currentPath.split("/").filter(Boolean);

    // If path is empty (we're at root "/"), only show Dashboard
    if (pathSegments.length === 0) {
      return [];
    }

    let items: {
      title: string;
      url: string;
      isLast: boolean;
    }[] = [];

    // Only take the first segment for the second level
    // This ensures we show Dashboard + first level only
    const segmentsToShow = pathSegments.slice(0, 1);

    // Generate breadcrumb items with proper links
    segmentsToShow.forEach((segment, index) => {
      const url = `/${segmentsToShow.slice(0, index + 1).join("/")}`;
      const isLast = index === segmentsToShow.length - 1;

      if (hiddenBreadcrumbSegments.includes(segment)) {
        return;
      }

      items = [
        ...items,
        {
          title: formatRouteSegment(segment, breadcrumb),
          url,
          isLast,
        },
      ];
    });

    return items;
  }, [currentPath, breadcrumb, hiddenBreadcrumbSegments]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home/Dashboard is always the first item */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Only add separator if we have more items */}
        {breadcrumbItems.length > 0 && (
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
        )}

        {/* Render breadcrumb items (will only be one item for second level) */}
        {breadcrumbItems.map((item) => (
          <Fragment key={item.url}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.url}>{item.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
