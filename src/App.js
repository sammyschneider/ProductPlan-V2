import React from "react";
import './App.scss';
import { Header } from "./Header";
import { RoadmapHeading } from "./RoadmapHeading";
import { RoadmapContent } from "./RoadmapContent";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { RoadmapSidebar } from "./RoadmapSidebar";
import { RoadmapState } from "./RoadmapState";
import { Tutorial } from "./Tutorial";
import { CustomDragLayer } from "./CustomDragLayer";

export default function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Header />
        <RoadmapHeading />
        <RoadmapState>
          <RoadmapSidebar />
          <RoadmapContent />
          <Tutorial />
        </RoadmapState>
        <CustomDragLayer />
      </DndProvider>
    </div>
  );
}