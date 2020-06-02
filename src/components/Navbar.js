import React, { Component } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

import setCurrentUser from "../util/setCurrentUser";

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    getCurrentUser = () => {
        axios
            .get("http://localhost:5000/user/current")
            .then(({ data }) => {
                this.setState({
                    user: data.user,
                });
                let user = localStorage.getItem("currentUser");
                if (!user) {
                    localStorage.setItem("currentUser", data.user);
                } else {
                    if (user.id !== data.user.id) {
                        localStorage.setItem("currentUser", data.user);
                    }
                }
            })
            .catch((err) => {
                if (err.response) {
                    // log user out
                    setCurrentUser();
                }
            });
    };

    render() {
        return (
            <nav className="navbar">
                {this.state.user && (
                    <div className="hello">
                        Hello, {this.state.user.username}
                    </div>
                )}

                <Link to="/home">Home</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/ticket/create">Ticket</Link>
            </nav>
        );
    }
}
