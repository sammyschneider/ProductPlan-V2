import React from "react";
import { RoadmapContext } from "./RoadmapState";
import { useDrop } from "react-dnd";
import classNames from "classnames";
import "./LaneDropzone.scss";
import { Types } from "./DndTypes";

export function LaneDropzone() {
  const { addLane } = React.useContext(RoadmapContext);
  const [{ canDrop }, drop] = useDrop({
    accept: Types.LANE,
    drop: item => {
      addLane(item.lane);
    },
    collect: monitor => ({
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div className={classNames("lane-dropzone", { canDrop })} ref={drop}>
      Drop here
    </div>
  );
}
