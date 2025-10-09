import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Note: When using this component, ensure to add a z-index to any popovers or dialogs
// to prevent them from being hidden behind the SelectionToolbar.

interface SelectionToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  children?: React.ReactNode;
  showItemCount?: boolean;
  itemLabel?: string;
  itemLabelPlural?: string;
  showClearButton?: boolean;
  clearButtonIcon?: React.ReactNode;
  position?: "top" | "bottom";
  animation?: boolean;
  animationProps?: {
    initial?: object;
    animate?: object;
    exit?: object;
    transition?: object;
  };
}

const SelectionToolbar = React.forwardRef<
  HTMLDivElement,
  SelectionToolbarProps<any>
>(
  (
    {
      table,
      children,
      className,
      showItemCount = true,
      itemLabel = "item",
      itemLabelPlural = "items",
      showClearButton = true,
      clearButtonIcon = <X className="h-3.5 w-3.5" />,
      position = "bottom",
      animation = true,
      animationProps,
      ...props
    },
    ref
  ) => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedRowsCount = selectedRows.length;

    const clearSelection = () => {
      table.resetRowSelection();
    };

    // Fixed animation properties
    const defaultAnimationProps = {
      initial: { y: position === "bottom" ? 100 : -100, opacity: 0 },
      animate: { y: position === "bottom" ? -100 : 100, opacity: 1 },
      exit: { y: position === "bottom" ? 100 : -100, opacity: 0 },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    };

    const mergedAnimationProps = {
      ...defaultAnimationProps,
      ...animationProps,
    };

    const Wrapper: any = animation ? motion.div : "div";
    const wrapperProps = animation ? mergedAnimationProps : {};

    return (
      <AnimatePresence>
        {selectedRowsCount > 0 && (
          <Wrapper
            style={{ zIndex: 20 }}
            ref={ref}
            className={cn(
              "fixed left-0 right-0 flex w-full items-center justify-center p-4",
              position === "bottom" ? "bottom-0" : "top-0",
              className
            )}
            {...wrapperProps}
            {...props}
          >
            <div className="flex flex-wrap items-center gap-1 rounded-lg border bg-zinc-50 p-2 shadow-lg dark:bg-zinc-950">
              {showItemCount && (
                <div className="flex items-center px-2 py-1">
                  <span className="mr-2 text-sm font-medium">
                    {selectedRowsCount}{" "}
                    {selectedRowsCount === 1 ? itemLabel : itemLabelPlural}{" "}
                    selected
                  </span>
                  {showClearButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-900"
                      onClick={clearSelection}
                    >
                      {clearButtonIcon}
                    </Button>
                  )}
                </div>
              )}
              {children}
            </div>
          </Wrapper>
        )}
      </AnimatePresence>
    );
  }
);
SelectionToolbar.displayName = "SelectionToolbar";

//------------------------------------------------

type SelectionToolbarSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const SelectionToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  SelectionToolbarSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-700", className)}
      {...props}
    />
  );
});
SelectionToolbarSeparator.displayName = "SelectionToolbarSeparator";

//----------------------------------------------

interface SelectionToolbarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  showLabelOnMobile?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  asChild?: boolean;
}

const SelectionToolbarItem = React.forwardRef<
  HTMLButtonElement,
  SelectionToolbarItemProps
>(
  (
    {
      icon,
      label,
      showLabelOnMobile = false,
      className,
      variant = "ghost",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    // If asChild is true, render children directly
    if (asChild && children) {
      return <div className={cn(className)}>{children}</div>;
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          "flex h-8 items-center gap-1 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800",
          className
        )}
        {...props}
      >
        {children || (
          <>
            {icon}
            {label && (
              <span className={cn(showLabelOnMobile ? "" : "hidden md:inline")}>
                {label}
              </span>
            )}
          </>
        )}
      </Button>
    );
  }
);
SelectionToolbarItem.displayName = "SelectionToolbarItem";

type SelectionToolbarGroupProps = React.HTMLAttributes<HTMLDivElement>;

const SelectionToolbarGroup = React.forwardRef<
  HTMLDivElement,
  SelectionToolbarGroupProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
});
SelectionToolbarGroup.displayName = "SelectionToolbarGroup";

export {
  SelectionToolbar,
  SelectionToolbarSeparator,
  SelectionToolbarItem,
  SelectionToolbarGroup,
};
