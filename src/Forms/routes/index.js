import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "../../App/Layouts/Header";
import GeneratedForms from "../components/GeneratedForms";
import GenerateForm from "../components/GenerateForm";
import ViewForm from "../components/ViewForm";

function FormRoutes(props) {
  return (
    <div className="main_wrapper">
      <Header/>
      <Switch>
        <Route path="/forms/generate-form/:formId" component={GenerateForm} />
        <Route path="/forms/view-form/:formId" component={ViewForm} />
        <Route path="/forms/generated-forms" component={GeneratedForms} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

export default FormRoutes;