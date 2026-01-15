import { ChevronRight } from "lucide-react"
import * as React from "react"
import { cn } from "../../lib/utils"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@radix-ui/react-collapsible"

const CollapsibleTriggerIcon = React.forwardRef<
    React.ElementRef<typeof CollapsibleTrigger>,
    React.ComponentPropsWithoutRef<typeof CollapsibleTrigger>
>(({ className, children, ...props }, ref) => (
    <CollapsibleTrigger
        ref={ref}
        className={cn(
            "flex w-full items-center justify-between rounded-lg py-2 text-sm font-medium hover:bg-muted/50 [&[data-state=open]>svg]:rotate-90",
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </CollapsibleTrigger>
))
CollapsibleTriggerIcon.displayName = "CollapsibleTriggerIcon"

export { Collapsible, CollapsibleTrigger, CollapsibleTriggerIcon, CollapsibleContent }
