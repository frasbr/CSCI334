import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import TourView from "./pages/TourView";
import CreateTour from "./pages/CreateTour";
import CreateTourSession from "./pages/CreateTourSession";
import CreateTicket from "./pages/CreateTicket";
import Profile from "./pages/Profile";
import ViewTickets from "./pages/ViewTickets";
import Inbox from "./pages/Inbox";

function App() {
    axios.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";

    const token = localStorage.getItem("authToken");
    if (token) {
        console.log("authorised");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        if (
            document.location.pathname === "/" ||
            document.location.pathname === "/login"
        ) {
            document.location = "/home";
        }
    } else {
        if (document.location.pathname !== "/login") {
            document.location = "login";
        }
    }

    // render the app
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/home" component={Home} />
                    <Route path="/tour/view" component={TourView} />
                    <Route path="/tour/create" component={CreateTour} />
                    <Route
                        path="/tour/session/create"
                        component={CreateTourSession}
                    />
                    <Route path="/ticket/create" component={CreateTicket} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/ticket/view" component={ViewTickets} />
                    <Route path="/inbox" component={Inbox} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
