import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "../../App/Layouts/Header";
import { MainPage } from "../components/MainPage";

function DocsRoutes(props) {
	return (
		<div className="main_wrapper">
			<Header />
			<Switch>
				<Route path="/docs/main-page" component={MainPage} />
				<Route path="*" component={() => "404 NOT FOUND"} />
			</Switch>
			<div></div>
		</div>
	);
}

export default DocsRoutes;
