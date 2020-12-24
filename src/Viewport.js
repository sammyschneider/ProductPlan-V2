import React from "react";
import useResizeObserver from "use-resize-observer";
import { defaultRange } from "./dateHelpers";

export const ViewportContext = React.createContext(null);

/*
 * A viewport represents a range of pixels that correspond to a range of dates.
 * Inside a viewport, an X coordinate can be converted to a moment in time and
 * vice-versa.
 */
export function Viewport({ children }) {
  const [viewportRef, width] = useResizeObserver();
  const [range, setRange] = React.useState(defaultRange());

  const pixelInMillis = React.useMemo(
    () => {
      const rangeMillis = range.end.getTime() - range.start.getTime();
      return rangeMillis / width;
    },
    [range, width]
  );

  const pixelToMillis = React.useCallback(
    x => {
      return range.start.getTime() + x * pixelInMillis;
    },
    [range, pixelInMillis]
  );

  const viewport = { range, setRange, width, pixelInMillis, pixelToMillis };

  return (
    <ViewportContext.Provider value={viewport}>
      <div className="viewport" ref={viewportRef}>
        {children}
      </div>
    </ViewportContext.Provider>
  );
}
