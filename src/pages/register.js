import React from "react";
import axios from "axios";
import registerImage from "./img/register.jpg";

export class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        }
    }

    register = () => {
        const {username, email, password, firstName, lastName} = this.state;
        axios
            .post("http://localhost:5000/auth/registerUser", {
                username,
                email,
                password,
                firstName,
                lastName,
            })
            .then((something) => {
                console.log(something.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }  

    render() {
        // to do: add another form 'confirmPassword' after backend implementation of variable
        return (
        <div className="base-container">
            <div className="header">Looking to Register? \nPlease fill-out your details below.</div>
            <div className="content">
                <div className="image">
                    <img src={registerImage} />
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder='enter your desired username' onChange ={this.state.username}/>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" name="firstName" placeholder='enter your first name' onChange ={this.onChange} value={this.state.firstName}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" name="lastName" placeholder='enter your last name' onChange ={this.onChange} value={this.state.lastName} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="text" name="email" placeholder='enter a valid email address' onChange ={this.onChange} value={this.state.emailAddress} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text" name="phoneNumber" placeholder='enter a valid phone number' onChange ={this.onChange} value={this.state.phoneNumber} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" placeholder='enter your desired password' onChange ={this.onChange} value={this.state.password}/>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" button className="registerBTN" onClick={this.register}>REGISTER</button>
            </div>
        </div>
    </div>
    )
    }
}

export default Register;
