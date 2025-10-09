"use client";

import * as React from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Hide scrollbar for Chrome, Safari and Opera
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

const TabsContext = React.createContext<{
  selectedTabIndex: number;
  setSelectedTab: (input: [number, number]) => void;
  tabs: Tab[];
} | null>(null);

// Add style tag for scrollbar hiding
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.textContent = scrollbarHideStyles;
  document.head.appendChild(styleTag);
}

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a TabsProvider");
  }
  return context;
}

export interface Tab {
  label: string;
  value: string;
  content?: React.ReactNode;
  href?: string;
  badge?: {
    text: string | number;
    variant?: "default" | "secondary" | "outline" | "destructive";
    tooltip?: string;
  };
}

interface AnimatedTabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: Tab[];
  defaultValue?: string;
  onTabChange?: (value: string) => void;
  className?: string;
}

const transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
};

const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect) => ({
  x: hoveredRect.left - navRect.left - 10,
  y: hoveredRect.top - navRect.top - 4,
  width: hoveredRect.width + 20,
  height: hoveredRect.height + 10,
});

export function AnimatedTabs({
  tabs,
  defaultValue,
  onTabChange,
  className,
  ...props
}: AnimatedTabsProps) {
  const initialTabIndex = React.useMemo(() => {
    const index = tabs.findIndex((tab) => tab.value === defaultValue);
    return index === -1 ? 0 : index;
  }, [tabs, defaultValue]);

  const [[selectedTabIndex], setSelectedTab] = React.useState<[number, number]>(
    [initialTabIndex, 0]
  );

  React.useEffect(() => {
    if (onTabChange) {
      onTabChange(tabs[selectedTabIndex].value);
    }
  }, [selectedTabIndex, onTabChange, tabs]);

  return (
    <TabsContext.Provider
      value={{
        selectedTabIndex,
        setSelectedTab,
        tabs,
      }}
    >
      <div className={cn("w-full", className)} {...props}>
        <TabsList />
        <Tabs>
          <TabsContent />
        </Tabs>
      </div>
    </TabsContext.Provider>
  );
}

function TabsList() {
  const { tabs, selectedTabIndex, setSelectedTab } = useTabsContext();
  const [buttonRefs, setButtonRefs] = React.useState<
    Array<HTMLButtonElement | null>
  >([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    setButtonRefs((prev) => prev.slice(0, tabs.length));
  }, [tabs.length]);

  const navRef = React.useRef<HTMLDivElement>(null);
  const navRect = navRef.current?.getBoundingClientRect();

  const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();

  const [hoveredTabIndex, setHoveredTabIndex] = React.useState<number | null>(
    null
  );
  const hoveredRect =
    buttonRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

  return (
    <div className="scrollbar-hide overflow-x-auto pb-2">
      <nav
        ref={navRef}
        className="relative z-0 flex min-w-max flex-shrink-0 items-center py-2"
        onPointerLeave={() => setHoveredTabIndex(null)}
      >
        {tabs.map((item, i) => {
          const isActive = selectedTabIndex === i;
          const isDangerZone = item.value === "danger-zone";

          return (
            <React.Fragment key={item.value}>
              {i > 0 && (
                <div
                  className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              )}
              <button
                className="relative z-20 flex h-8 cursor-pointer select-none items-center rounded-md bg-transparent px-4 capitalize transition-colors"
                onPointerEnter={() => setHoveredTabIndex(i)}
                onFocus={() => setHoveredTabIndex(i)}
                onClick={() => {
                  setSelectedTab([i, i > selectedTabIndex ? 1 : -1]);
                  if (item.href) {
                    navigate(item.href);
                  }
                }}
              >
                <motion.span
                  ref={(el) => {
                    buttonRefs[i] = el as HTMLButtonElement;
                  }}
                  className={cn("block", {
                    "text-foreground": !isActive,
                    "font-semibold text-black dark:text-white": isActive,
                  })}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="text-sm">{item.label}</div>

                    {item.badge && (
                      <BadgeWithTooltip
                        badge={item.badge}
                        isDangerZone={isDangerZone}
                        isActive={isActive}
                      />
                    )}
                  </div>
                </motion.span>
              </button>
            </React.Fragment>
          );
        })}

        <AnimatePresence>
          {hoveredRect && navRect && (
            <motion.div
              key="hover"
              className={cn(
                "absolute left-0 top-0 z-10 rounded-md",
                hoveredTabIndex ===
                  tabs.findIndex(({ value }) => value === "danger-zone")
                  ? "bg-red-100 dark:bg-red-500/30"
                  : "bg-zinc-100 dark:bg-zinc-800"
              )}
              initial={{
                ...getHoverAnimationProps(hoveredRect, navRect),
                opacity: 0,
              }}
              animate={{
                ...getHoverAnimationProps(hoveredRect, navRect),
                opacity: 1,
              }}
              exit={{
                ...getHoverAnimationProps(hoveredRect, navRect),
                opacity: 0,
              }}
              // @ts-ignore lsls
              transition={transition}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedRect && navRect && (
            <motion.div
              className={cn(
                "absolute bottom-0 left-0 z-10 h-[2px]",
                selectedTabIndex ===
                  tabs.findIndex(({ value }) => value === "danger-zone")
                  ? "bg-red-500"
                  : "bg-black dark:bg-white"
              )}
              initial={false}
              animate={{
                width: selectedRect.width + 18,
                x: `calc(${selectedRect.left - navRect.left - 9}px)`,
                opacity: 1,
              }}
              // @ts-ignore lsls
              transition={transition}
            />
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}

function BadgeWithTooltip({
  badge,
  isDangerZone,
  isActive,
}: {
  badge: Tab["badge"];
  isDangerZone: boolean;
  isActive: boolean;
}) {
  if (!badge) return null;

  const badgeContent = (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
        isDangerZone
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : isActive
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      )}
    >
      {badge.text}
    </span>
  );

  if (badge.tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
          <TooltipContent>
            <p>{badge.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeContent;
}

function Tabs({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function TabsContent() {
  const { tabs, selectedTabIndex } = useTabsContext();
  const selectedTab = tabs[selectedTabIndex];

  return (
    <AnimatePresence mode="wait">
      {selectedTab?.content && (
        <motion.div
          className="mt-4"
          key={selectedTab.value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {selectedTab.content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
