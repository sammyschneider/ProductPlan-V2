import React from "react";
import "./RoadmapContent.scss";
import { Lane } from "./Lane";
import { Axis } from "./Axis";
import { LaneDropzone } from "./LaneDropzone";
import { Viewport } from "./Viewport";
import { RoadmapContext } from "./RoadmapState";

/*
 * The roadmap content is where most of the state for the application lives.
 * This component defines the actions that drive state changes, and exposes
 * them in a context so components further down in the tree can invoke them.
 */
export function RoadmapContent() {
  const { state } = React.useContext(RoadmapContext);

  return (
    <div className="roadmap-content">
      <Viewport>
        <Axis />
        {state.lanes.map(lane => <Lane key={lane.id} lane={lane} />)}
        <LaneDropzone />
      </Viewport>
    </div>
  );
}
