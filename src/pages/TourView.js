import React, { Component } from "react";
import qs from "query-string";
import Axios from "axios";

import Navbar from "../components/Navbar";

export default class TourView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tour: null,
            sessions: [],
            guide: null,
            isEditable: false,
            editing: false,
            title: "",
            description: "",
            location: "",
            category: "",
            price: "",
            offer: "",
        };
    }

    componentDidMount() {
        this.getTour();
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    getTour = () => {
        const { id } = qs.parse(document.location.search);
        Axios.get(`http://localhost:5000/tour/byId/${id}`).then(({ data }) => {
            this.getGuideInfo(data.tour.guide);
            this.getTourSessions(data.tour.id);
            this.setState(
                {
                    tour: data.tour,
                    title: data.tour.title,
                    description: data.tour.description,
                    location: data.tour.location,
                    category: data.tour.category,
                    price: data.tour.price / 100,
                    offer: data.tour.price / 100,
                },
                () => {
                    console.log("tour:", this.state.tour);
                }
            );
        });
    };

    getTourSessions = (tourId) => {
        Axios.get(`http://localhost:5000/tour/session/byTour/${tourId}`)
            .then(({ data }) => {
                this.setState({
                    sessions: data.sessions,
                });
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    getGuideInfo = (id) => {
        Axios.get(`http://localhost:5000/user/id/${id}`).then(({ data }) => {
            this.setState(
                {
                    guide: data.user,
                },
                () => {
                    console.log("guide:", this.state.guide);
                }
            );

            // compare guide with current user to determine editing capability
            const curUser = localStorage.getItem("currentUser");
            // if this isnt there for some reason then just ignore
            if (!curUser) return;
            // set state if match
            if (data.user.id === curUser.id) {
                this.setState({
                    isEditable: true,
                });
            }
        });
    };

    getBookingInfo = (session) => {
        this.setState(
            {
                bookingsToShow: null,
            },
            () => {
                Axios.get(
                    `http://localhost:5000/tour/booking/bySession/${session.id}`
                )
                    .then(({ data }) => {
                        this.setState(
                            {
                                bookingsToShow: data.bookings,
                            },
                            this.getBookingUserInfo
                        );
                    })
                    .catch((err) => {
                        console.log(err.response);
                    });
            }
        );
    };

    getBookingUserInfo = () => {
        this.state.bookingsToShow.forEach((booking, i) => {
            Axios.get(`http://localhost:5000/user/id/${booking.userId}`).then(
                ({ data }) => {
                    this.setState((state) => {
                        state.bookingsToShow[i].username = data.user.username;
                        return state;
                    });
                }
            );
            if (i === this.state.bookingsToShow.length - 1) {
                this.setState({
                    bookingsReadyToShow: true,
                });
            }
        });
    };

    startEdit = () => {
        this.setState({
            editing: true,
        });
    };

    stopEdit = () => {
        const {
            title,
            description,
            location,
            category,
            price,
            tour,
        } = this.state;
        const { id } = tour;
        Axios.post(`http://localhost:5000/tour/update/${id}`, {
            title,
            description,
            location,
            category,
            price,
        }).then(({ data }) => {
            this.setState({
                tour: data.tour,
                editing: false,
            });
        });
    };

    getSessionDate = (session) => {
        const dateObj = new Date(session.startTime);
        return `${dateObj.getDate()}${"/"}${dateObj.getMonth()}${"/"}${dateObj.getYear()}`;
    };

    startBooking = (i) => {
        this.setState({
            isBooking: true,
            currentBooking: i,
        });
    };

    endBooking = () => {
        this.setState({
            isBooking: false,
            currentBooking: null,
            offer: this.state.tour.price,
        });
    };

    viewBookings = (session, i) => {
        this.setState({
            showBookings: i,
            bookingsReadyToShow: false,
        });
        this.getBookingInfo(session);
    };

    stopViewingBookings = () => {
        this.setState({
            showBookings: null,
        });
    };

    confirmBooking = (session, i) => {
        Axios.post(`http://localhost:5000/tour/session/${session.id}/book`, {
            offer: this.state.offer,
        }).then(({ data }) => {
            this.setState(
                {
                    bookingSuccessMsg: "Made an offer for $" + this.state.offer,
                    bookingSuccess: i,
                },
                // after this state is set then run the endBooking func
                this.endBooking
            );
        });
    };

    updateBookingOffer = (booking, newState, i) => {
        Axios.post(`http://localhost:5000/tour/booking/${booking.id}/update`, {
            state: newState,
        }).then(({ data }) => {
            this.setState((state) => {
                state.bookingsToShow[i].state = newState;
                return state;
            });
        });
    };

    displayDate = (date) => {
        const dateObj = new Date(date);
        return dateObj.toDateString();
    };

    render() {
        return (
            <div>
                <Navbar />
                {this.state.tour && this.state.guide && !this.state.editing && (
                    <div className="tour">
                        <h2 className="headline">{this.state.tour.title}</h2>
                        <div className="description">
                            description: {this.state.tour.description}
                        </div>
                        <div className="location">
                            location: {this.state.tour.location}
                        </div>
                        <div className="category">
                            category: {this.state.tour.category}
                        </div>
                        <div className="price">
                            price: ${this.state.tour.price}
                        </div>
                        <div className="host">
                            Hosted by: {this.state.guide.firstName}{" "}
                            {this.state.guide.lastName}
                        </div>
                    </div>
                )}
                {this.state.tour && this.state.guide && this.state.editing && (
                    <div className="tour">
                        <div className="form-group">
                            <label htmlFor="title">title</label>
                            <input
                                type="text"
                                name="title"
                                onChange={this.onChange}
                                value={this.state.title}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">description</label>
                            <input
                                type="text"
                                name="description"
                                onChange={this.onChange}
                                value={this.state.description}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">location</label>
                            <input
                                type="text"
                                name="location"
                                onChange={this.onChange}
                                value={this.state.location}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">category</label>
                            <input
                                type="text"
                                name="category"
                                onChange={this.onChange}
                                value={this.state.category}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">price</label>
                            <input
                                type="text"
                                name="price"
                                onChange={this.onChange}
                                value={this.state.price}
                            />
                        </div>
                        <div className="host">
                            Hosted by: {this.state.guide.firstName}{" "}
                            {this.state.guide.lastName}
                        </div>
                    </div>
                )}
                {this.state.guide && !this.state.editing && (
                    <button className="editBtn" onClick={this.startEdit}>
                        Edit
                    </button>
                )}
                {this.state.guide && this.state.editing && (
                    <button className="saveBtn" onClick={this.stopEdit}>
                        Save changes
                    </button>
                )}
                <h2 className="sessions">Sessions</h2>
                {this.state.sessions.map((session, i) => (
                    <div
                        key={session.id}
                        className="session"
                        style={{ marginBottom: "20px" }}
                    >
                        <div className="date">
                            {this.getSessionDate(session)}
                        </div>
                        <div className="capacity">{session.capacity}</div>
                        <div className="notes">{session.notes}</div>
                        {this.state.guide && (
                            <button
                                className="viewBookingsBtn"
                                onClick={() => this.viewBookings(session, i)}
                            >
                                View current bookings
                            </button>
                        )}
                        {this.state.bookingSuccess !== i && (
                            <button
                                className="book-btn"
                                onClick={() => this.startBooking(i)}
                            >
                                Make a booking
                            </button>
                        )}
                        {this.state.bookingSuccessMsg &&
                            this.state.bookingSuccess === i && (
                                <div>{this.state.bookingSuccessMsg}</div>
                            )}
                        {this.state.isBooking &&
                            this.state.currentBooking === i && (
                                <div className="booking-form">
                                    <div className="form-group">
                                        <label htmlFor="offer">Offer:</label>
                                        <input
                                            type="text"
                                            name="offer"
                                            value={this.state.offer}
                                            onChange={this.onChange}
                                        />
                                        Enter the price you are offering to pay.
                                        By default this is set to the price that
                                        has been asked for by the tour guide
                                    </div>
                                    <button
                                        className="confirm-booking"
                                        onClick={() =>
                                            this.confirmBooking(session, i)
                                        }
                                    >
                                        Confirm
                                    </button>
                                </div>
                            )}
                        {this.state.bookingsReadyToShow &&
                            this.state.showBookings === i && (
                                <>
                                    <h4>Bookings</h4>
                                    <div
                                        className="bookings"
                                        style={{ display: "flex" }}
                                    >
                                        {this.state.bookingsToShow.map(
                                            (booking, j) => (
                                                <div
                                                    className="booking"
                                                    style={{
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <div className="name">
                                                        {booking.username}
                                                    </div>
                                                    <div className="date">
                                                        Sent at:{" "}
                                                        {this.displayDate(
                                                            booking.createdAt
                                                        )}
                                                    </div>
                                                    <div className="offer">
                                                        Offer: {booking.offer}
                                                    </div>
                                                    <div className="state">
                                                        State: {booking.state}
                                                    </div>
                                                    {booking.state ===
                                                        "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    this.updateBookingOffer(
                                                                        booking,
                                                                        "confirmed",
                                                                        j
                                                                    )
                                                                }
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    this.updateBookingOffer(
                                                                        booking,
                                                                        "rejected",
                                                                        j
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                    </div>
                ))}
            </div>
        );
    }
}
