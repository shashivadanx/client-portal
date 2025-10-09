import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";

// Update the buttonVariants cva to remove hover translate effects and add more rounded corners
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg hover:bg-gradient-to-br hover:from-primary hover:to-primary/90 active:shadow-sm",
        destructive:
          "bg-gradient-to-br from-destructive to-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg hover:from-destructive hover:to-destructive active:shadow-sm",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-sm hover:shadow hover:from-secondary hover:to-secondary/90 active:shadow-none",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      effect: {
        expandIcon: "group gap-0 relative",
        ringHover:
          "transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat background-position_0s_ease",
        shineHover:
          "relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000",
        gooeyRight:
          "relative z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-white/40 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%]",
        gooeyLeft:
          "relative z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-white/40 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]",
        underline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        hoverUnderline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
        gradientSlideShow:
          "bg-[size:400%] bg-[linear-gradient(-45deg,var(--gradient-lime),var(--gradient-ocean),var(--gradient-wine),var(--gradient-rust))] animate-gradient-flow",
        // Enhanced shadow effects - removed translate-y effects
        shadow:
          "shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-all duration-300",
        shadowLift:
          "shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300",
        shadowGlow:
          "shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)] transition-all duration-300",
        shadowPulse:
          "shadow-[0_4px_8px_rgba(0,0,0,0.1)] animate-pulse hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-all duration-300",
        glassmorphism:
          "backdrop-blur-sm bg-white/20 border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-white/30 hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-all duration-300",
        neobrutalism:
          "border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all",
        softShadow:
          "shadow-[0_12px_24px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] transition-all duration-300",
        // Updated 3D effects - removed translate-y effects
        lifted3D:
          "shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-b-4 border-b-primary/50 hover:border-b-2 hover:border-t-2 hover:border-t-white/30 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300",
        floatingCard:
          "shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out",
        pressable:
          "shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] hover:shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 active:translate-y-1 active:shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)] transition-all duration-150",
        ripple:
          "relative overflow-hidden active:after:animate-ripple after:absolute after:h-32 after:w-32 after:rounded-full after:bg-white/30 after:opacity-0 after:origin-center after:scale-0",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        xs: "h-8 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
        xl: "h-12 px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface IconProps {
  icon: React.ElementType;
  iconPlacement: "left" | "right";
}

interface IconRefProps {
  icon?: never;
  iconPlacement?: undefined;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  tooltip?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
}

export type ButtonIconProps = IconProps | IconRefProps;

// Update the Button component to handle loading cursor
const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonIconProps
>(
  (
    {
      className,
      variant,
      effect,
      size,
      icon: Icon,
      iconPlacement,
      asChild = false,
      loading = false,
      loadingText,
      tooltip,
      tooltipSide = "top",
      tooltipAlign = "center",
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const buttonContent = (
      <Comp
        className={cn(
          buttonVariants({ variant, effect, size, className }),
          loading && "cursor-wait"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {Icon &&
          iconPlacement === "left" &&
          !loading &&
          (effect === "expandIcon" ? (
            <div className="w-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100">
              <Icon />
            </div>
          ) : (
            <Icon />
          ))}
        <Slottable>
          {loading && loadingText ? loadingText : props.children}
        </Slottable>
        {Icon &&
          iconPlacement === "right" &&
          !loading &&
          (effect === "expandIcon" ? (
            <div className="w-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pl-2 group-hover:opacity-100">
              <Icon />
            </div>
          ) : (
            <Icon />
          ))}
      </Comp>
    );

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side={tooltipSide} align={tooltipAlign}>
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonContent;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
