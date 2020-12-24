import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Header.scss";

export function Header() {
  return (
    <header>
      <div className="logo">
        <img
          src="https://assets0.productplan.com/assets/footer_logo-3d313e599d3c5c8529360c59874f291523ab92b361c4c812530d250de30290a5.png"
          alt="ProductPlan logo"
        />
      </div>
      <div className="roadmap-name">Candidate Roadmap</div>
      <div className="search-icon">
        <FontAwesomeIcon icon={faSearch} />
      </div>
    </header>
  );
}
