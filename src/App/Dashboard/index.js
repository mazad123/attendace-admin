import React from "react";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import AllNotification from "./routes/AllNotification";
import Thought from "./routes/Thought";
import Header from "../Layouts/Header";
import { ProtectedRoute } from "../../constants/ProtectedRoute";

function DashboardRoutes(props) {
  const { path } = useRouteMatch();
  
  return (
    <div className="main_wrapper">
      <Header />
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}`} />
        <ProtectedRoute path="/dashboard/home" component={Dashboard} />
        <ProtectedRoute path="/dashboard/notification" component={AllNotification} />
        <ProtectedRoute path="/dashboard/thought" component={Thought} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

export default DashboardRoutes;
