import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import Login from "./components/Login";
import DashboardRoutes from "./App/Dashboard";
import EmployeeRoutes from "./App/Employee";
import ReportsRoutes from "./App/Reports";
import OrganisationRoutes from "./App/organisation";
import RecruitmentRoutes from "./App/Recruitment/routes";
import { ProtectedRoute } from "./constants/ProtectedRoute";
import ProjectsRoutes from "./Project";
import PrivacyPolicy from "./App/Policy/PrivacyPolicy";
import TermsConditions from "./App/Policy/Terms-Conditions";
import DocsRoutes from "./Docs/routes";
import FormsRoutes from "./Forms/routes";
import { PreviewFile } from "./Docs/components/PreviewFile";
import { PreviewDocFile } from "./App/Employee/routes/ViewEmployee/PreviewDocFile";
import PublicDocuments from "./Docs/components/PublicDocument";
import PublicFileDocument from "./Docs/components/PublicFileDocument";

function App() {
  const history = createBrowserHistory();
  return (
    <div>
      <Router history={history}>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <Route path="/privacy-policy" component={PrivacyPolicy}/>
          <Route path="/terms-conditions" component={TermsConditions}/>
          <Route path="/login" component={Login} />
          <Route path="/kis-attendance/public-docs/folder/:folderId" component={PublicDocuments} />
          <Route path="/kis-attendance/public-docs/file/:fileId" component={PublicFileDocument} />
          {/* <Route path="/kis-attendance/preview/public-doc/:docId" component={PreviewFile} /> */}
          <Route path="/kis-attendance/preview/public-doc/:fileId" component={PublicFileDocument} />
          <ProtectedRoute path="/employee" component={EmployeeRoutes} />
          <ProtectedRoute path="/dashboard" component={DashboardRoutes} />
          <ProtectedRoute path="/reports" component={ReportsRoutes} />
          <ProtectedRoute path="/candidate" component={RecruitmentRoutes} />
          <ProtectedRoute path="/organisation" component={OrganisationRoutes} />
          <ProtectedRoute path="/project" component={ProjectsRoutes} />
          <ProtectedRoute path="/docs" component={DocsRoutes} />
          <ProtectedRoute path="/forms" component={FormsRoutes} />
          <ProtectedRoute path="/preview/doc/:docId" component={PreviewDocFile} />
          <ProtectedRoute path="/preview/:docId" component={PreviewFile} />
          <Route path="*" component={() => "404 NOT FOUND"} />
        </Switch>
      </Router>
      <div>
        <ToastContainer autoClose={4000} />
      </div>
    </div>
  );
}

export default App;
