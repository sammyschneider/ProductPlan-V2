import React from "react";
import { useDrop } from "react-dnd";
import { RoadmapContext } from "./RoadmapState";
import { Types } from "./DndTypes";
import "./Trash.scss";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export function Trash() {
  const { deleteBar } = React.useContext(RoadmapContext);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: Types.BAR,
    drop: (item, monitor) => {
      deleteBar(item.bar);
    },
    canDrop: (item, monitor) => {
      return !!item.bar;
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    })
  });

  return (
    <div className={classNames("trash", { isOver, canDrop })} ref={drop}>
      <FontAwesomeIcon icon={faTrash} />
    </div>
  );
}
