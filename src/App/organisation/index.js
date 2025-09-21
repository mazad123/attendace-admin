import React from "react";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import Header from "../Layouts/Header";
import Organisation from "./routes/Organisation";
import UserLevel from "./routes/UserLevel";
function OrganisationRoutes() {
  const { path } = useRouteMatch();
  return (
    <div className="main_wrapper">
      <Header />
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}`} />
        <Route exact path="/organisation/view" component={Organisation} />
        <Route exact path="/organisation/add-employee-level" component={UserLevel} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

export default OrganisationRoutes;
