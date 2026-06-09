import { memo } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "outline" | "secondary";

interface IBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default:     "bg-primary/10 text-primary border border-primary/20",
  success:     "bg-success/10 text-success border border-success/20",
  warning:     "bg-warning/10 text-warning border border-warning/20",
  destructive: "bg-destructive/10 text-destructive border border-destructive/20",
  outline:     "border border-border text-muted-foreground",
  secondary:   "bg-secondary text-secondary-foreground",
};

export const Badge = memo(function Badge({
  children,
  variant = "default",
  className,
}: IBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
      variants[variant],
      className,
    )}>
      {children}
    </span>
  );
});