import React from "react";
import { useDrag } from "react-dnd";
import "./RoadmapSidebar.scss";
import { Types } from "./DndTypes";
import { Trash } from "./Trash";
import { getEmptyImage } from "react-dnd-html5-backend";
import { AddLaneButton, AddBarButton } from "./SidebarButtons";

export function RoadmapSidebar() {
  return (
    <div className="roadmap-sidebar">
      <DraggableAddLaneButton />
      <DraggableAddBarButton />
      <Trash />
    </div>
  );
}

function DraggableAddLaneButton() {
  const [, drag, preview] = useDrag({
    item: { type: Types.LANE }
  });

  React.useEffect(
    () => {
      preview(getEmptyImage(), { captureDraggingState: true });
    },
    [preview]
  );

  return (
    <div ref={drag}>
      <AddLaneButton />
    </div>
  );
}

function DraggableAddBarButton() {
  const [, drag, preview] = useDrag({
    item: { type: "bar" }
  });

  React.useEffect(
    () => {
      preview(getEmptyImage(), { captureDraggingState: true });
    },
    [preview]
  );

  return (
    <div ref={drag}>
      <AddBarButton />
    </div>
  );
}
