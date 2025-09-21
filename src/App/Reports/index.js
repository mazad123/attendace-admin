import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "../Layouts/Header";
import Reports from "./routes/Reports";
import WorkStatusReport from "./routes/WorkStatusReport";
import EmployeeAttendanceReport from "./routes/EmployeeAttendanceReport";

function EmployeeRoutes(props) {
  return (
    <div className="main_wrapper">
      <Header />
      <Switch>
      <Route path="/reports/work" component={WorkStatusReport} />
      <Route path="/reports/employee-leaves-report" component={EmployeeAttendanceReport} />
        <Route path="/" component={Reports} />
        <Route path="*" component={() => "404 NOT FOUND"} /> 
      </Switch>
      <div>

      </div>
    </div>
  );
}

export default EmployeeRoutes;
