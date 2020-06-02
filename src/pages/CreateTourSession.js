import React from 'react';
import axios from 'axios';
import Date from 'react';

let dateObj = new Date(); // im unsure of how to do the date ik this is incorrect

export class CreateTour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // need date to be added to backend
            dateObj: "",
            startTime: "",
            finishTime: "",
            capacity: "",
            notes: "",
        };
    }
    
    createSession = () => {
        const { dateObj, startTime, finishTime, capacity, notes } = this.state;
        axios
            .post(`http://localhost:5000/session/create?id=${tourId}`, {
                dateObj,
                startTime,
                finishTime,
                capacity,
                notes,
            })
            .then(({ data }) => {
 
                // redirect to tour page
                const {id} = data.tour;
                document.location = `/tour/view?id=${id}`;
            
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
                    Create Tour Sessions
                </div>
                <div className="content">
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="dateObj">Choose the Date for this session</label>
                            <input
                                type="date"
                                name="dateObj"
                                placeholder=""
                                onChange={this.onChange}
                                value={this.state.dateObj.toISOstring()}
                            />
                            <div className="form-group">
                                <label htmlFor="startTime">Session Start Time</label>
                                <input
                                    type="text"
                                    name="startTime"
                                    placeholder="e.g. 07:00 for 7am"
                                    onChange={this.onChange}
                                    value={this.state.startTime}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="finishTime">Session Finish Time</label>
                                <input
                                    type="text"
                                    name="finishTime"
                                    placeholder="e.g. 13:00 for 1pm"
                                    onChange={this.onChange}
                                    value={this.state.finishTime}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="capacity">Max Capacity for Tour?</label>
                                <input
                                    type="text"
                                    name="capacity"
                                    placeholder="e.g. 24 max persons only."
                                    onChange={this.onChange}
                                    value={this.state.capacity}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="notes">Additional Notes for tour quests</label>
                                <textarea
                                    name="notes"
                                    placeholder="e.g. 'meet at the big clock tower @ 7am'"
                                    onChange={this.onChange}
                                    value={this.state.notes}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <button
                            type="button"
                            className="createSessionBTN"
                            onClick={this.create}
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
        );
    }
    }
    
    export default CreateTourSession;





