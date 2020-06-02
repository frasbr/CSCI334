import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import registerImage from "./img/register.jpg";

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
        };
    }

    register = () => {
        const { username, email, password, firstName, lastName } = this.state;
        axios
            .post("http://localhost:5000/auth/register/user", {
                username,
                email,
                password,
                firstName,
                lastName,
            })
            .then(({ data }) => {
                if (data.success) {
                    // redirect
                    document.location = "/login";
                }
            })
            .catch((err) => {
                if (err.response) {
                    this.setState({
                        error: err.response.data.message,
                        isError: true,
                    });
                }
            });
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    render() {
        // to do: add another form 'confirmPassword' after backend implementation of variable
        return (
            <div className="base-container">
                <div className="header">
                    Looking to Register? Please fill-out your details below.
                </div>
                <div className="content">
                    <div className="image">
                        <img src={registerImage} alt="" />
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="enter your desired username"
                                onChange={this.onChange}
                                value={this.state.username}
                            />
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="enter your first name"
                                    onChange={this.onChange}
                                    value={this.state.firstName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="enter your last name"
                                    onChange={this.onChange}
                                    value={this.state.lastName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="enter a valid email address"
                                    onChange={this.onChange}
                                    value={this.state.emailAddress}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="enter your desired password"
                                    onChange={this.onChange}
                                    value={this.state.password}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <button
                            type="button"
                            className="registerBTN"
                            onClick={this.register}
                        >
                            REGISTER
                        </button>
                        {this.state.isError && (
                            <div
                                className="error-message"
                                style={{ color: "red" }}
                            >
                                {this.state.error}
                            </div>
                        )}
                    </div>
                </div>
                <div className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        );
    }
}

export default Register;
