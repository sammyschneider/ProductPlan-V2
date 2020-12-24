import React from "react";
import { RoadmapContext } from "./RoadmapState";
import "./Tutorial.scss";
import { Popover } from "./Popover";
import { PrimaryButton } from "./PrimaryButton";
import useTimeout from "use-timeout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export function Tutorial() {
  const [step, setStep] = React.useState("notStarted");
  const [showPopover, setShowPopover] = React.useState(true);
  const { state } = React.useContext(RoadmapContext);

  // Wait two seconds before initiating the tutorial
  useTimeout(() => {
    setStep("createLane");
  }, 2000);

  // Detect when to move to the next step
  React.useEffect(
    () => {
      switch (step) {
        case "createLane": {
          if (state.lanes.length > 0) {
            setStep("createBar");
            setShowPopover(true);
          }
          break;
        }
        case "createBar": {
          if (
            state.lanes.some(lane => lane.rows.some(row => row.bars.length > 0))
          ) {
            setStep("createMoreBars");
            setShowPopover(true);
          }
          break;
        }
        case "createMoreBars": {
          let barCount = 0;
          for (let lane of state.lanes) {
            for (let row of lane.rows) {
              barCount += row.bars.length;
            }
          }
          if (barCount > 2) {
            setStep("done");
          }
          break;
        }
        default: {
        }
      }
    },
    [state.lanes, step]
  );

  const dismissPopover = React.useCallback(() => {
    setShowPopover(false);
  }, []);

  if (!showPopover) {
    return null;
  }

  switch (step) {
    case "createLane": {
      return (
        <TutorialPopover
          selector=".add-lane-button"
          closeAction={dismissPopover}
        >
          <b>We'll start with a lane.</b>
          <p>
            Lanes represent high level categories, such as teams, product lines,
            or strategic initiatives. Add a color and a description to your lane
            to communicate valuable details to stakeholders.
          </p>
          <p>Drag and drop a lane to get started.</p>
        </TutorialPopover>
      );
    }
    case "createBar": {
      return (
        <TutorialPopover
          selector=".add-bar-button"
          closeAction={dismissPopover}
        >
          <b>Awesome! Now lets add a few bars.</b>
          <p>
            Bars are your specific initiative. Use them to represent your epics,
            projects, or tasks, and provide an at a glance view of priority,
            relationships, and progress.
          </p>
          <p>Drag and drop a bar to get started.</p>
        </TutorialPopover>
      );
    }
    case "createMoreBars": {
      return (
        <TutorialPopover
          selector=".add-bar-button"
          closeAction={dismissPopover}
        >
          <b>Alright let's set up a couple more.</b>
          <p>
            Once they're added you can share out your roadmap with your team.
          </p>
        </TutorialPopover>
      );
    }
    default: {
      return null;
    }
  }
}

function TutorialPopover({ selector, closeAction, children }) {
  return (
    <Popover selector={selector}>
      <div className="tutorial-popover">
        <div className="popover-close-icon" onClick={closeAction}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        {children}
        <PrimaryButton onClick={closeAction}>Got it</PrimaryButton>
      </div>
    </Popover>
  );
}
