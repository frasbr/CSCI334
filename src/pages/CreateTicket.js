import React from "react";
import axios from "axios";

import qs from "query-string";

export class CreateTicket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingId: "",
            content: "",
            document: "",
            category: "verification",
            selectedFile: null,
        };
    }

    onFileChange = (e) => {
        // updates the state
        this.setState({ selectedFile: e.target.files[0] });
    };

    onFileUpload = () => {
        // confirmation to display in console
        console.log(this.state.selectedFile);
    };

    componentDidMount() {
        const { booking } = qs.parse(document.location.search);
        if (!booking) {
            this.setState({ category: "verification" });
        } else {
            this.setState({
                category: "tour",
                bookingId: booking,
            });
        }
    }

    ticket = () => {
        const { bookingId, content, category } = this.state;
        axios
            .post("http://localhost:5000/ticket/create", {
                bookingId,
                content,
                category,
            })
            .then(({ data }) => {
                document.location = "/profile"; // maybe should re-direct to previous page of where they navigated from
            })
            .catch((err) => {
                console.log(err);
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
        return (
            <div className="base-container">
                <div className="header">
                    Submit a Ticket to an Administrator
                </div>
                <div className="content">
                    <div className="form">
                        {this.state.category === "verification" && (
                            <div className="form-group">
                                <label htmlFor="document">
                                    Upload Document:{" "}
                                </label>
                                <input
                                    type="file"
                                    name="document"
                                    placeholder=""
                                    onChange={this.onFileChange}
                                    value={this.state.document}
                                />
                            </div>
                        )}
                        {this.state.category === "tour" && (
                            <div className="form-group">
                                <label htmlFor="content">Description: </label>
                                <textarea
                                    name="content"
                                    placeholder="Add some notes relating to your dispute"
                                    onChange={this.onChange}
                                    value={this.state.content}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="footer">
                    <button
                        type="button"
                        className="submitBTN"
                        onClick={this.ticket}
                    >
                        Submit Ticket
                    </button>
                    {this.state.isError && (
                        <div className="error-message" style={{ color: "red" }}>
                            {this.state.error}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default CreateTicket;
