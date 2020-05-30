import React from "react";
import loginImage from "../../login.svg";

export class Register extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return
        <div className="base-container">
            <div className="header">Register</div>
            <div className="content">
                <div className="image">
                    <img src={loginImage} />
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" name="firstName" placeholder='enter your first name..' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" name="lastName" placeholder='enter your last name..' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" placeholder='enter your email..' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text" name="phoneNumber" placeholder='enter your phone number..' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" placeholder='enter your password..' />

                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder='enter your password..' />
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" button className="registerBTN">Register</button>
            </div>
        </div>
    }
}

