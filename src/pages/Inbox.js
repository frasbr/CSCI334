import React, { Component } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            readyToRender: false,
            focusedMessage: null,
            reply: "",
        };
    }

    componentDidMount() {
        this.getInbox();
    }

    getInbox = () => {
        axios
            .get(`http://localhost:5000/message/inbox`)
            .then(({ data }) => {
                this.setState(
                    {
                        messages: data.messages,
                    },
                    this.getMessageUserInfo
                );
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    getMessageUserInfo = () => {
        this.state.messages.forEach((message, i) => {
            axios
                .get(`http://localhost:5000/user/id/${message.sender}`)
                .then(({ data }) => {
                    this.setState((state) => {
                        state.messages[i].username = data.user.username;
                        return state;
                    });
                    if (i === this.state.messages.length - 1) {
                        this.setState({
                            readyToRender: true,
                        });
                    }
                });
        });
    };

    createDateString = (date) => {
        const dateObj = new Date(date);
        return dateObj.toDateString();
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    toggleReply = (i) => {
        this.setState((state) => {
            if (state.focusedMessage === i) {
                state.focusedMessage = null;
            } else {
                state.focusedMessage = i;
            }
            return state;
        });
    };

    sendReply = (userId, i) => {
        axios
            .post(`http://localhost:5000/message/send/${userId}`, {
                message: this.state.reply,
            })
            .then(({ data }) => {
                this.setState((state) => {
                    state.focusedMessage = null;
                    state.messageSuccess = i;
                    return state;
                });
            });
    };

    render() {
        return (
            <>
                <Navbar />
                <div>
                    <h2>Inbox</h2>
                    {this.state.readyToRender && (
                        <div className="messages">
                            {this.state.messages.map((message, i) => (
                                <div
                                    className="message"
                                    style={{ marginBottom: "30px" }}
                                >
                                    <div className="sender">
                                        Sent by: {message.username}
                                    </div>
                                    <div className="timestamp">
                                        On:{" "}
                                        {this.createDateString(message.sentAt)}
                                    </div>
                                    <div className="content">
                                        {message.message}
                                    </div>
                                    {this.state.focusedMessage === i && (
                                        <>
                                            <textarea
                                                name="reply"
                                                cols="80"
                                                rows="10"
                                                onChange={this.onChange}
                                                value={this.state.reply}
                                                placeholder="Write your reply here"
                                                style={{ display: "block" }}
                                            />
                                            <button
                                                onClick={() =>
                                                    this.sendReply(
                                                        message.sender,
                                                        i
                                                    )
                                                }
                                            >
                                                Send
                                            </button>
                                        </>
                                    )}
                                    {this.state.messageSuccess === i && (
                                        <div>Reply sent</div>
                                    )}

                                    <button onClick={() => this.toggleReply(i)}>
                                        {this.state.focusedMessage === i
                                            ? "Cancel"
                                            : "Reply"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>
        );
    }
}
