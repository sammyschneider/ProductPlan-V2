import React from "react";
import { useDragLayer } from "react-dnd";
import { Types } from "./DndTypes";
import "./CustomDragLayer.scss";
import { AddLaneButton, AddBarButton } from "./SidebarButtons";

export function CustomDragLayer() {
  const {
    item,
    itemType,
    initialOffset,
    currentOffset,
    isDragging
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  function renderItem() {
    switch (itemType) {
      case Types.BAR: {
        // Let existing bars use default HTML5 drag rendering
        if (item.bar) {
          return null;
        }

        return <AddBarButton />;
      }
      case Types.LANE: {
        return <AddLaneButton />;
      }
      default: {
        return null;
      }
    }
  }

  function getItemStyle() {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none"
      };
    }

    let { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform
    };
  }

  if (!isDragging) {
    return null;
  }

  return (
    <div class="custom-drag-layer">
      <div style={getItemStyle()}>{renderItem()}</div>
    </div>
  );
}
