import React from "react";
import { Link } from "react-router-dom";

function AttendenceDetail(props) {
  return (
    <>
      <div className="col">
        <div className="dashboard_card hovered_box">
          <Link to="#" onClick={props.onLeave}>
            <div className="employee_count">
              <h2 className="text_orange">{props.leaveCount?.onLeave}</h2>
              <p>On-Leave</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default AttendenceDetail;
