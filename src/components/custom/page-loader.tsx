import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  // Size of the loader icon (in pixels)
  size?: number;
  // Color of the loader icon
  color?: string;
  // Animation speed (slow, normal, fast)
  speed?: "slow" | "normal" | "fast";
  // Background color
  background?: string;
  // Whether to take up the full screen height
  fullScreen?: boolean;
  // Additional class names
  className?: string;
}

export function PageLoader({
  size = 40,
  color,
  speed = "normal",
  background,
  fullScreen = true,
  className,
}: PageLoaderProps) {
  // Map speed values to appropriate animation classes
  const speedClasses = {
    slow: "animate-spin-slow",
    normal: "animate-spin",
    fast: "animate-spin-fast",
  };

  // Determine container classes based on fullScreen prop
  const containerClasses = fullScreen
    ? "flex h-screen items-center justify-center"
    : "flex items-center justify-center p-4";

  return (
    <div
      className={cn(containerClasses, className)}
      style={{ backgroundColor: background }}
    >
      <Loader2 className={speedClasses[speed]} size={size} color={color} />
    </div>
  );
}
