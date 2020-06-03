import React, { Component } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default class ViewTickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tickets: [],
        };
    }
    componentDidMount() {
        this.getTickets();
    }

    getTickets = () => {
        axios
            .get("http://localhost:5000/ticket/all")
            .then(({ data }) => {
                this.setState(
                    {
                        tickets: data.tickets,
                    },
                    this.getTicketUserInfo
                );
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    getTicketUserInfo = () => {
        this.state.tickets.forEach((ticket, i) => {
            axios
                .get(`http://localhost:5000/user/id/${ticket.issuerId}`)
                .then(({ data }) => {
                    this.setState((state) => {
                        state.tickets[i].username = data.user.username;
                        return state;
                    });
                })
                .catch((err) => {
                    console.log(err.response);
                });
            if (i === this.state.tickets.length - 1) {
                this.setState({
                    readyToRender: true,
                });
            }
        });
    };

    refundUser = (ticket) => {
        axios
            .post(`http://localhost:5000/ticket/refund/${ticket.id}`)
            .then(({ data }) => {
                this.setState((state) => {
                    const ticketIndex = state.tickets.findIndex(
                        (t) => t.id === ticket.id
                    );
                    state.tickets[ticketIndex].refunded = true;
                    return state;
                });
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    render() {
        return (
            <>
                <Navbar />
                <div>
                    <h2>Tickets</h2>
                    {this.state.readyToRender && (
                        <div className="tickets">
                            {this.state.tickets.map((ticket) => (
                                <div
                                    className="ticket"
                                    style={{ marginBottom: "20px" }}
                                >
                                    <div className="name">
                                        Username: {ticket.username}
                                    </div>
                                    <div className="category">
                                        Category: {ticket.category}
                                    </div>
                                    <div className="content">
                                        Notes: {ticket.content}
                                    </div>
                                    {ticket.category === "tour" &&
                                        !ticket.refunded && (
                                            <button
                                                onClick={() =>
                                                    this.refundUser(ticket)
                                                }
                                            >
                                                Refund user
                                            </button>
                                        )}
                                    {ticket.refunded && (
                                        <div>Ticket has been refunded</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>
        );
    }
}
