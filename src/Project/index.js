import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "../App/Layouts/Header";
import DailyStatusUpdates from "./components/DailyStatusUpdate";
import ProjectDetails from "./components/ProjectDetails";
import ProjectList from "./components/ProjectList";
import SalesUpdates from "./components/SalesUpdates";
import SubjectDetails from "./components/SubjectDetails";
import UserStatusUpdates from "./components/UserProjects";
import UserProjectUpdates from "./components/UserProjectUpdates";
import UserStatuses from "./components/UserStatuses";
import ProjectUpdatedDetails from "./components/ProjectUpdateDetails";


function ProjectsRoutes(props) {
  return (
    <div className="main_wrapper">
      <Header />
      <Switch>
      <Route path="/project/project-list" component={ProjectList} />
      <Route path="/project/user-updates/:userId" component={UserStatuses} />
      <Route path="/project/user-projects-updates/:userId" component={UserProjectUpdates} />
      <Route path="/project/user-status-updates-list/:userId" component={UserStatusUpdates} />
      <Route path="/project/get-project-detail/general-project-user/:daily_status" component={DailyStatusUpdates} />
      <Route path="/project/get-project-detail/sales-project/:sales_status" component={SalesUpdates} />
      <Route path="/project/get-project-detail/:projectId" component={ProjectDetails} />
      <Route path="/project/project-messages/:subjectId" component={SubjectDetails} />
      <Route path="/project/project-update/all-messages/:projectId/:subjectId" component={ProjectUpdatedDetails} />
      <Route path="/project/get-project/general-project/:daily_status" component={DailyStatusUpdates} />
      <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
      <div>
      </div>
    </div>
  );
}

export default ProjectsRoutes;