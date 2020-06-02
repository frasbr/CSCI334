import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateTour from "./pages/CreateTour";

function App() {
    axios.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";

    const token = localStorage.getItem("authToken");
    if (token) {
        console.log("authorised");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }

    // render the app
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/home" component={Home} />
                    <Route path="/tour/create" component={CreateTour} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
