import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useDrop } from "react-dnd";
import { RoadmapContext } from "./RoadmapState";
import { ViewportContext } from "./Viewport";
import { Bar } from "./Bar";
import "./Lane.scss";
import { Types } from "./DndTypes";
import classNames from "classnames";
import { millisToDate } from "./dateHelpers";

export function Lane({ lane }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const name = lane.name || "Unnamed lane";
  const { range, pixelInMillis } = React.useContext(ViewportContext);

  const caret = React.useMemo(
    () =>
      collapsed ? (
        <FontAwesomeIcon icon={faCaretRight} />
      ) : (
        <FontAwesomeIcon icon={faCaretDown} />
      ),
    [collapsed]
  );

  const laneContentStyle = React.useMemo(
    () => {
      const oneMonth = 2.628e9;
      const stripWidth = oneMonth / pixelInMillis;
      const stripeColor = "#e0e4e7";
      const { start } = range;
      const priorMonth = new Date(start.getFullYear(), start.getMonth());
      const offset = start.getTime() - priorMonth.getTime();
      const offsetInPixels = offset / pixelInMillis;
      return {
        background: `repeating-linear-gradient(90deg, transparent, transparent ${stripWidth -
          1}px, ${stripeColor} 1px, ${stripeColor} ${stripWidth}px)`,
        backgroundPosition: `-${offsetInPixels}px 0px`
      };
    },
    [range, pixelInMillis]
  );

  const laneContent = React.useMemo(
    () => {
      if (lane.rows.length === 0) {
        return <BarDropzone laneId={lane.id} index={0} newRow={true} />;
      }

      return (
        <>
          {lane.rows.map((row, i) => (
            <LaneRow key={row.id} row={row} laneId={lane.id} index={i} />
          ))}
        </>
      );
    },
    [lane]
  );

  return (
    <div className="lane">
      <div className="lane-header">
        <span
          className="lane-toggle-caret"
          onClick={() => {
            setCollapsed(c => !c);
          }}
        >
          {caret}
        </span>
        {name}
      </div>
      <div className="lane-content" style={laneContentStyle} hidden={collapsed}>
        {laneContent}
      </div>
    </div>
  );
}

export function LaneRow({ row, index, laneId }) {
  const { state } = React.useContext(RoadmapContext);
  const centerRef = React.useRef();
  const [lastY, setLastY] = React.useState(null);
  const [{ isOver, item }, drop] = useDrop({
    accept: Types.BAR,
    hover: (item, monitor) => {
      const { y } = monitor.getClientOffset();
      setLastY(y);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      item: monitor.getItem()
    })
  });

  const [showPrevRow, showNextRow] = React.useMemo(
    () => {
      if (!centerRef.current || lastY === null || !isOver) {
        return [false, false];
      }

      let thisRowSize, prevRowSize, nextRowSize;
      if (item && item.bar) {
        const lane = state.lanes.find(lane => lane.id === laneId);
        thisRowSize = rowSize(lane.rows[index], item.bar.id);
        prevRowSize = index > 0 && rowSize(lane.rows[index - 1], item.bar.id);
        nextRowSize =
          index < lane.rows.length - 1 &&
          rowSize(lane.rows[index + 1], item.bar.id);
      }

      const { top, bottom } = centerRef.current.getBoundingClientRect();
      const proximity = 18;
      const showPrevRow =
        thisRowSize !== 0 && prevRowSize !== 0 && lastY < top + proximity;
      const showNextRow =
        thisRowSize !== 0 && nextRowSize !== 0 && lastY > bottom - proximity;
      return [showPrevRow, showNextRow];
    },
    [isOver, lastY, item, index, laneId, state]
  );

  return (
    <div className="lane-row" ref={drop}>
      <BarDropzone
        key={`above-${laneId}`}
        index={index}
        laneId={laneId}
        newRow={true}
        expanded={showPrevRow}
      />
      <div ref={centerRef}>
        <BarDropzone key={`at-${laneId}`} index={index} laneId={laneId}>
          {row.bars.map(bar => <Bar key={bar.id} bar={bar} />)}
        </BarDropzone>
      </div>
      <BarDropzone
        key={`below-${laneId}`}
        index={index + 1}
        laneId={laneId}
        newRow={true}
        expanded={showNextRow}
      />
    </div>
  );
}

export function BarDropzone({
  index,
  laneId,
  children,
  newRow = false,
  expanded = true
}) {
  const { moveBar, addBar } = React.useContext(RoadmapContext);
  const { pixelToMillis } = React.useContext(ViewportContext);

  const [{ isOver }, drop] = useDrop({
    accept: Types.BAR,
    drop: (item, monitor) => {
      const { x } = monitor.getSourceClientOffset();
      const dropMillis = pixelToMillis(x);
      const start = millisToDate(dropMillis);
      const destination = { laneId, index, start, newRow };
      const { bar } = item;
      if (bar) {
        moveBar(bar, destination);
      } else {
        addBar(bar, destination);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div
      className={classNames("bar-dropzone", {
        isOver,
        newRow,
        expanded
      })}
      ref={drop}
    >
      {children}
    </div>
  );
}

function rowSize(row, draggedBarId) {
  return row.bars.filter(b => b.id !== draggedBarId).length;
}
