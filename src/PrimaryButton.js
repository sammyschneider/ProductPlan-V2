import React from "react";
import "./PrimaryButton.scss";

export function PrimaryButton({ children, ...props }) {
  return (
    <button className="primary-button" {...props}>
      {children}
    </button>
  );
}
