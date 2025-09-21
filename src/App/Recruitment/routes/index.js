import React from "react";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import Header from "../../Layouts/Header";
import AddCategory from "../components/AddCategory";
// import AddMarksStatus from "../components/AddMarksStatus";
import CandidateList from "../components/CandidateList";
import EditCandidate from "../components/EditCandidate";
import AddNewCandidate from "./AddNewCandidate";
// import CandidateDetail from "./CandidateDetail";
function RecruitmentRoutes(props) {
  const { path } = useRouteMatch();
  return (
    <div className="main_wrapper">
      <Header />
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}`} />
        <Route path="/candidate/add" component={AddNewCandidate} />
        <Route path="/candidate/list" component={CandidateList} />
        <Route path="/candidate/add-category" component={AddCategory} />
        {/* <Route path="/candidate/detail/:candidateId" component={CandidateDetail} />
        <Route path="/candidate/add-result-status" component={AddMarksStatus} />*/} 
        <Route path="/candidate/edit/:candidateId" component={EditCandidate} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

export default RecruitmentRoutes;
