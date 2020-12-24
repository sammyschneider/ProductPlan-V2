import React from "react";
import "./RoadmapHeading.scss";

export function RoadmapHeading() {
  return (
    <div className="roadmap-heading">
      <h2>Product roadmap</h2>
      <div className="roadmap-tabs">
        <div className="tab active">Roadmap</div>
        <div className="tab">Planning Board</div>
        <div className="tab">Parking Lot</div>
      </div>
    </div>
  );
}
