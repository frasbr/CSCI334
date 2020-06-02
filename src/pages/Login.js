import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import setCurrentUser from "../util/setCurrentUser";

import loginImage from "./img/login.svg";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: "",
            isErrors: false,
        };
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    login = () => {
        // Clear previous error message
        this.setState({ error: "", isErrors: false });

        // Attempt to login
        const { username, password } = this.state;
        axios
            .post("http://localhost:5000/auth/login", {
                username,
                password,
            })
            .then(({ data }) => {
                // Store token in localstorage
                localStorage.setItem("authToken", data.token);

                // Log the user in
                setCurrentUser(data.token);

                // Redirect user
                document.location = "/home";
            })
            .catch((err) => {
                if (err.response) {
                    this.setState({
                        error: err.response.data.message,
                        isErrors: true,
                    });
                }
            });
    };

    render() {
        return (
            <div className="base-container">
                <div className="header">
                    Welcome back. Please enter your login credentials.
                </div>
                <div className="content">
                    <div className="image">
                        <img src={loginImage} alt="" />
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder=""
                                onChange={this.onChange}
                                value={this.state.username}
                            />
                            {this.state.isErrors && (
                                <div
                                    className="error-message"
                                    style={{ color: "red" }}
                                >
                                    {this.state.error}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder=""
                                onChange={this.onChange}
                                value={this.state.password}
                            />
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button
                        type="button"
                        className="loginBTN"
                        onClick={this.login}
                    >
                        LOGIN
                    </button>
                </div>
                <div className="register-link">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </div>
        );
    }
}

export default Login;
