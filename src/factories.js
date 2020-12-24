import { millisToDate, oneWeekMillis } from "./dateHelpers";

let laneId = 0;
export function createLane() {
  laneId++;
  return {
    id: `lane${laneId}`,
    name: `Lane ${laneId}`,
    rows: []
  };
}

const defaultDuration = 10 * oneWeekMillis;

let barId = 0;
export function createBar(start, end) {
  if (!end) {
    end = millisToDate(start.getTime() + defaultDuration);
  }

  barId++;
  return {
    id: `bar${barId}`,
    name: `Roadmap Item ${barId}`,
    start,
    end
  };
}

let rowId = 0;
export function createRow() {
  rowId++;
  return {
    id: `row${rowId}`,
    bars: []
  };
}
