import React from "react";
import axios from "axios";

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

        onFileChange = e => {

            // updates the state
            this.setState({ selectedFile: e.target.files[0]});
        };

        onFileUpload = () => {

            const formData = new FormData();

            formData.append("myFile",
            this.state.selectedFile,
            this.setState.selectedFile.name
            );
            // confirmation to display in console
            console.log(this.state.selectedFile); 
        }

        ticket = () => {
            const { bookingID, content, document, searchType} = this.state;
            axios
                .post("http://localhost:5000/ticket/create", {
                    bookingID,
                    content,
                    document,
                    searchType,
                })

                .then(({ data }) => {
                    if (data.success) {
                        // redirect
                        document.location = "/profile"; // maybe should re-direct to previous page of where they navigated from
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
            return (
                <div className="base-container">
                    <div className="header">
                        Submit a Ticket to an Administrator 
                    </div>
                    <div className="content">
                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="filter">Ticket Type (category): </label>
                            <select
                                name="category"
                                onChange={this.onChange}
                                value={this.state.category}
                            >
                                <option value="verification">ID Verification Request</option>
                                <option value="tour">Tour disputes</option>
                            </select>
                                <div className="form-group">
                                    <label htmlFor="content">Description</label>
                                    {this.state.content === "tour" && (
                                    <textarea
                                        name="content"
                                        placeholder="input tour dispute information here.."
                                        onChange={this.onChange}
                                        value={this.state.content}
                                    /> )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="document">Upload Document: </label>
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
                </div>
            );
        }
    }

export default CreateTicket;