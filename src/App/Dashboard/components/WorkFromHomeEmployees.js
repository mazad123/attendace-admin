import React from "react";
import { Link } from "react-router-dom";

const WorkFromHomeEmployees = ({ WorkFromHomeCount, wfhEmployees }) => {
  return (
    <div className="col">
      <div className="dashboard_card hovered_box">
        <Link to="#" onClick={wfhEmployees} >
          <div className="employee_count">
            <h2 className="text_green">{WorkFromHomeCount?.workFromHome}</h2>
            <p>WFH Employees</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default WorkFromHomeEmployees;
