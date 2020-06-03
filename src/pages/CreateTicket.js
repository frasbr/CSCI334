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
        const formData = new FormData();

        formData.append(
            "myFile",
            this.state.selectedFile,
            this.setState.selectedFile.name
        );
        // confirmation to display in console
        console.log(this.state.selectedFile);
    };

    componentDidMount() {
        const { booking } = qs.parse(document.location.search);
        if (!booking) {
            this.setState({category: "verification"});
        } else {
            this.setState({
                category: "tour",
                bookingId: booking
            });
        }
    }

    ticket = () => {
        console.log(this.state);
        const { bookingId, content, document, category } = this.state;
        axios
            .post("http://localhost:5000/ticket/create", {
                bookingId,
                content,
                document,
                category,
            })

            .then(({ data }) => {
               
                 document.location = "/profile"; // maybe should re-direct to previous page of where they navigated from
                
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
        console.log(e.target.value);
        console.log(this.state.category);
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
                        </div>
                    </div>
                    <div className="footer">
                        <button
                            type="button"
                            className="submitBTN"
                            onClick={this.ticket}
                        >
                            Submit Form
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
        );
    }
}

export default CreateTicket;
