import React from "react";
import axios from "axios";
import qs from "query-string";

import Navbar from "../components/Navbar";

export default class CreateTourSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            startTime: "",
            finishTime: "",
            capacity: "",
            notes: "",
        };
    }

    componentDidMount() {
        const { id } = qs.parse(document.location.search);
        if (!id) {
            document.location = "/home";
        } else {
            this.setState({
                tourId: id,
            });
        }
    }

    generateTime = (date, time) => {
        const [year, month, day] = date.split("-");
        const [hour, minute] = time.split(":");
        const dateObj = new Date();
        dateObj.setFullYear(year);
        dateObj.setMonth(month);
        dateObj.setDate(day);
        dateObj.setHours(hour);
        dateObj.setMinutes(minute);
        return dateObj.toISOString();
    };

    createSession = () => {
        const {
            date,
            startTime,
            finishTime,
            capacity,
            notes,
            tourId,
        } = this.state;
        const start = this.generateTime(date, startTime);
        const end = this.generateTime(date, finishTime);
        axios
            .post(`http://localhost:5000/tour/session/create/${tourId}`, {
                startTime: start,
                finishTime: end,
                capacity,
                notes,
            })
            .then(({ data }) => {
                // redirect to tour page
                document.location = `/tour/view?id=${this.state.tourId}`;
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
            <>
                <Navbar />
                <div className="base-container">
                    <div className="header">Create Tour Sessions</div>
                    <div className="content">
                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="dateObj">
                                    Choose the Date for this session
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    placeholder=""
                                    onChange={this.onChange}
                                    value={this.state.date}
                                />
                                <div className="form-group">
                                    <label htmlFor="startTime">
                                        Session Start Time
                                    </label>
                                    <input
                                        type="text"
                                        name="startTime"
                                        placeholder="e.g. 07:00 for 7am"
                                        onChange={this.onChange}
                                        value={this.state.startTime}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="finishTime">
                                        Session Finish Time
                                    </label>
                                    <input
                                        type="text"
                                        name="finishTime"
                                        placeholder="e.g. 13:00 for 1pm"
                                        onChange={this.onChange}
                                        value={this.state.finishTime}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="capacity">
                                        Max Capacity for Tour?
                                    </label>
                                    <input
                                        type="text"
                                        name="capacity"
                                        placeholder="e.g. 24 max persons only."
                                        onChange={this.onChange}
                                        value={this.state.capacity}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="notes">
                                        Additional Notes for tour quests
                                    </label>
                                    <textarea
                                        name="notes"
                                        placeholder="e.g. 'meet at the big clock tower @ 7am'"
                                        onChange={this.onChange}
                                        value={this.state.notes}
                                        cols={60}
                                        rows={10}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="footer">
                            <button
                                type="button"
                                className="createSessionBTN"
                                onClick={this.createSession}
                            >
                                Create Session
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
            </>
        );
    }
}
