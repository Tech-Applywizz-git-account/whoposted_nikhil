import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] text-sm font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#0a66c2] text-white hover:bg-[#004f99] shadow-sm",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border border-[#d1e7ff] bg-transparent text-[#0a66c2] hover:bg-[rgba(10,102,194,0.05)]",
        secondary:
          "bg-[#f6f9fc] text-[#061b31] border border-[#e5edf5] hover:bg-[#eef2f7]",
        ghost:
          "hover:bg-[rgba(10,102,194,0.05)] text-slate-600 hover:text-[#0a66c2]",
        link: "text-[#0a66c2] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
