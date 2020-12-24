import React from "react";
import Arrow from "react-svg-arrow";
import Popper from "popper.js";
import "./Popover.scss";

export function Popover({ selector, direction = "left", children, ...props }) {
  const popperRef = React.useRef();
  const arrowRef = React.useRef();
  React.useEffect(
    () => {
      const target = document.querySelector(selector);
      const popper = new Popper(target, popperRef.current, {
        placement: direction,
        modifiers: {
          arrow: {
            element: arrowRef.current
          }
        }
      });
      return () => popper.destroy();
    },
    [selector, direction, children]
  );

  const arrow = React.useMemo(
    () =>
      React.createElement(Arrow, {
        size: 12,
        color: "white",
        direction: flip(direction),
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)"
      }),
    [direction]
  );
  return (
    <div className="popper" ref={popperRef} {...props}>
      <div className="popover-content">{children}</div>
      <div className="popper__arrow" ref={arrowRef}>
        {arrow}
      </div>
    </div>
  );
}

function flip(direction) {
  return {
    left: "right",
    right: "left",
    top: "bottom",
    bottom: "top"
  }[direction];
}
