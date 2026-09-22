import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] font-medium whitespace-nowrap w-fit",
  {
    variants: {
      variant: {
        default: "border-input text-muted-foreground bg-card",
        ok: "border-ok/45 text-ok bg-ok/8",
        warn: "border-warn/45 text-warn bg-warn/8",
        primary: "border-primary/45 text-primary bg-primary/10",
        draft: "border-draft/45 text-draft bg-draft/10",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
