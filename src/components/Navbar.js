import React, { Component } from "react";
import axios from "axios";

import "./Navbar.scss";

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
                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(data.user)
                    );
                } else {
                    user = JSON.parse(user);
                    if (user.id !== data.user.id) {
                        localStorage.setItem(
                            "currentUser",
                            JSON.stringify(data.user)
                        );
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

    logout = () => {
        setCurrentUser();
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
                <Link to="/inbox">Inbox</Link>
                {this.state.user && this.state.user.validated && (
                    <Link to="/tour/create">Create a tour</Link>
                )}

                <button className="logout" onClick={this.logout}>
                    Log out
                </button>
                {this.state.user && this.state.user.isAdmin && (
                    <Link to="/ticket/view">View Support Tickets</Link>
                )}
                {this.state.user && !this.state.user.validated && (
                    <Link to="/ticket/create" />
                )}
            </nav>
        );
    }
}
