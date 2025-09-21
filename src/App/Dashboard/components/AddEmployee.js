import React from "react";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

function AttendenceDetail() {
  return (
    <div className="col-lg-3 mb-4 col-6 col-md-3 order-4 order-lg-4">
      <div className="dashboard_card hovered_box">
        <Link to="/employee/add">
          <div className="employee_count">
            <h2>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </h2>
            <p>Add Employee</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AttendenceDetail;
