import React from "react";
import { Link } from "react-router-dom";

function UnCheckedEmployees(props ) {
  return (
    <div className="col">
      <div className="dashboard_card hovered_box">
        <Link to="#" onClick={props.unChecked}>
          <div className="employee_count">
            <h2 className="text_blue">{props.unCheckedCount?.unChecked}</h2>
            <p>Un-Checked Employee</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default UnCheckedEmployees;
