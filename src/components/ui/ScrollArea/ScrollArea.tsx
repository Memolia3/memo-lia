"use client";

import { cn } from "@/utils";
import React from "react";
import { ScrollAreaProps } from "./ScrollArea.types";

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = "vertical", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("overflow-auto", className)}
        style={{
          overflowX: orientation === "horizontal" || orientation === "both" ? "auto" : "hidden",
          overflowY: orientation === "vertical" || orientation === "both" ? "auto" : "hidden",
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
