import React from "react";
import { ViewportContext } from "./Viewport";
import { axisMonths, dateToFraction, millisToDate } from "./dateHelpers";
import { useGesture } from "react-use-gesture";
import "./Axis.scss";

export function Axis() {
  const { range, setRange, pixelInMillis } = React.useContext(ViewportContext);

  const labelledMonths = React.useMemo(() => [...axisMonths(range)], [range]);
  const handlePinch = React.useCallback(
    ({ vdva: [dd, da], origin: [x] }) => {
      const delta = 18 * dd * Math.cos(da);
      const rangeDelta = delta * pixelInMillis;
      const focusOffset = x * pixelInMillis;
      setRange(r => {
        const startTime = r.start.getTime();
        const endTime = r.end.getTime();
        const rangeLength = endTime - startTime;
        const bias = focusOffset / rangeLength;
        const start = millisToDate(startTime + bias * rangeDelta);
        const end = millisToDate(endTime - (1 - bias) * rangeDelta);
        return { start, end };
      });
    },
    [pixelInMillis, setRange]
  );

  const handleDrag = React.useCallback(
    ({ vxvy: [vx] }) => {
      const rangeDelta = 18 * vx * pixelInMillis;
      setRange(r => {
        const start = millisToDate(r.start.getTime() - rangeDelta);
        const end = millisToDate(r.end.getTime() - rangeDelta);
        return { start, end };
      });
    },
    [pixelInMillis, setRange]
  );

  const axisRef = React.useRef();
  const bindGestures = useGesture(
    {
      onDrag: handleDrag,
      onPinch: handlePinch
    },
    {
      domTarget: axisRef,
      event: { passive: false }
    }
  );

  return (
    <div className="axis" ref={axisRef} {...bindGestures()}>
      {labelledMonths.map(({ label, month }) => (
        <AxisMarker key={month.getTime()} date={month} label={label} />
      ))}
    </div>
  );
}

function AxisMarker({ date, label }) {
  const { range, width } = React.useContext(ViewportContext);
  const style = React.useMemo(
    () => {
      const fraction = dateToFraction(date, range);
      const left = width * fraction;
      return { left };
    },
    [date, range, width]
  );

  const labelDiv = label && <div className="label">{label}</div>;
  return (
    <div className="axis-month" style={style}>
      {labelDiv}
      <div className="dot">•</div>
    </div>
  );
}
