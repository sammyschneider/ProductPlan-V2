import { createBar, createLane, createRow } from "./factories";
import { shiftDateMillis } from "./dateHelpers";

/*
 * This module performs the "business logic". Each action returns
 * a function that mutates some state, so the functions can be called
 * directly in tests, or used with immer to perform state updates in
 * RoadmapState. This allows the state mutations to be tested without
 * any component tree.
 */

export function addLane() {
  return state => {
    state.lanes.push(createLane());
  };
}

export function addBar(barToAdd, destination) {
  return state => {
    const { laneId, index, start, newRow } = destination;
    let bar = null;
    if (barToAdd) {
      bar = { ...barToAdd };
      const diff = start.getTime() - bar.start.getTime();
      shiftDateMillis(bar.start, diff);
      shiftDateMillis(bar.end, diff);
    } else {
      bar = createBar(start);
    }

    const { lanes } = state;
    const targetLane = lanes.find(lane => lane.id === laneId);
    if (!targetLane) {
      return;
    }

    bar.location = { laneId, index };
    if (newRow) {
      const row = createRow();
      row.bars.push(bar);
      targetLane.rows.splice(index, 0, row);
    } else {
      targetLane.rows[index].bars.push(bar);
    }
    fixBarLocations(targetLane);
  };
}

export function deleteBar(bar) {
  return state => {
    removeBar(bar)(state);
    removeEmptyRows()(state);
  };
}

// This function removes a bar, but doesn't remove empty rows.
function removeBar(bar) {
  return state => {
    const { laneId, index } = bar.location;
    const { lanes } = state;
    const lane = lanes.find(lane => lane.id === laneId);
    if (!lane) {
      return;
    }

    const row = lane.rows[index];
    const barIndex = row.bars.findIndex(b => b.id === bar.id);
    row.bars.splice(barIndex, 1);
  };
}

export function removeEmptyRows() {
  return state => {
    for (let lane of state.lanes) {
      lane.rows = lane.rows.filter(r => r.bars.length > 0);
      fixBarLocations(lane);
    }
  };
}

export function moveBar(bar, destination) {
  return s => {
    removeBar(bar)(s);
    addBar(bar, destination)(s);
    removeEmptyRows()(s);
  };
}

function fixBarLocations(lane) {
  for (let i = 0; i < lane.rows.length; i++) {
    for (let b of lane.rows[i].bars) {
      b.location.index = i;
    }
  }
}
