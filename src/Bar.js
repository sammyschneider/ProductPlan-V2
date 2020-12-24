import React from "react";
import { ViewportContext } from "./Viewport";
import { useDrag } from "react-dnd";
import { dateToFraction } from "./dateHelpers";
import "./Bar.scss";
import { Types } from "./DndTypes";

export function Bar({ bar }) {
  const name = bar.name || "Unnamed bar";

  const [{ isDragging }, drag] = useDrag({
    item: { type: Types.BAR, bar },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const { range, width } = React.useContext(ViewportContext);
  const style = React.useMemo(
    () => {
      const { start, end } = bar;
      const startFraction = dateToFraction(start, range);
      const endFraction = dateToFraction(end, range);
      const barOffset = width * startFraction;
      const barWidth = (endFraction - startFraction) * width;
      const style = { left: barOffset, width: barWidth };
      if (isDragging) {
        style.opacity = 0.5;
      }
      return style;
    },
    [bar, range, width, isDragging]
  );

  return (
    <div className="bar" ref={drag} style={style}>
      {name}
    </div>
  );
}
