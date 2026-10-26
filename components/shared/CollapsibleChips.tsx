"use client"

import type { ReactNode } from "react"
import { Children, useState } from "react"
import { StaggerItem } from "@/components/shared/StaggerReveal"

interface CollapsibleChipsProps {
  children: ReactNode
  className?: string
  // How many chips phones see before the "+N" chip
  visible?: number
}

// On phones, shows the first `visible` chips and a "+N" chip that reveals the rest of the row.
// sm and up always show everything. Hiding is done in CSS (hidden sm:contents), so the server
// and client render the same markup and there's no layout jump on hydration.
const CollapsibleChips = ({ children, className, visible = 4 }: CollapsibleChipsProps) => {
  const [expanded, setExpanded] = useState(false)
  const items = Children.toArray(children)
  const extra = items.length - visible
  // Collapsing a single chip would just swap it for a "+1" of the same size
  const collapsible = extra > 1 && !expanded

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className={collapsible && index >= visible ? "hidden sm:contents" : "contents"}>
          {item}
        </div>
      ))}
      {collapsible && (
        <StaggerItem className="sm:hidden">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={`Show ${extra} more`}
            className="inline-flex items-center rounded-md border border-dashed border-white/20 px-3 py-1.5 font-mono text-sm text-custom-accent transition-colors hover:border-custom-accent/50">
            +{extra}
          </button>
        </StaggerItem>
      )}
    </div>
  )
}

export default CollapsibleChips
