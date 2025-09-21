import React from "react";
import EmployeeList from "../components/EmployeeList";

function Employee() {
  return (
    <>
      <div className="main_content_panel">
        <div className="header_title">
          <p className="today_date">
            {/* <b>{moment().format("D MMMM Y")}</b> */}
          </p>
        </div>
        <div className="row">
          <EmployeeList />
        </div>
      </div>
    </>
    // </div>
  );
}

export default Employee;
