import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border-2 px-3 py-2 text-sm ring-offset-background",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors",
        // Light mode
        "bg-white border-input text-foreground hover:border-primary/50",
        // Dark mode
        "dark:bg-muted/50 dark:border-muted dark:text-foreground dark:hover:border-primary/50 dark:focus-visible:bg-muted/70",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
