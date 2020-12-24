import React from "react";
import "./RoadmapContent.scss";
import produce from "immer";
import * as Roadmap from "./roadmap";

export const RoadmapContext = React.createContext(null);

/*
 * This component houses the roadmap state and exposes state-transition
 * functions to its children.
 */
export function RoadmapState({ initialState, children }) {
  const [state, setState] = React.useState(initialState || { lanes: [] });

  const addLane = React.useCallback(() => {
    setState(produce(Roadmap.addLane()));
  }, []);

  const addBar = React.useCallback((bar, destination) => {
    setState(produce(Roadmap.addBar(bar, destination)));
  }, []);

  const deleteBar = React.useCallback(bar => {
    setState(produce(Roadmap.deleteBar(bar)));
  }, []);

  const moveBar = React.useCallback((bar, destination) => {
    setState(produce(Roadmap.moveBar(bar, destination)));
  }, []);

  const roadmapContext = { state, addBar, deleteBar, moveBar, addLane };

  return (
    <RoadmapContext.Provider value={roadmapContext}>
      {children}
    </RoadmapContext.Provider>
  );
}
