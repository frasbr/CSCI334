import React from "react";
import loginImage from "./login.svg";
import axios from "axios";

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    login = () => {
        const { username, password } = this.state;
        axios
            .post("http://localhost:5000/auth/login", {
                username,
                password,
            })
            .then((something) => {
                console.log(something.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
        <div className="base-container">
            <div className="header">Login</div>
            <div className="content">
                <div className="image">
                    <img src={loginImage} />
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder='enter your username..' onChange={this.onChange} value={this.state.username}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder='enter your password..' onChange={this.onChange} value={this.state.password}/>
                    </div>
                </div>
            </div>
            <div className="footer">
            <button
                        type="button"
                        className="loginBTN"
                        onClick={this.login}
                    >
                        Login
                    </button>
            </div>
        </div>
        )
    }
}

export default Login;

