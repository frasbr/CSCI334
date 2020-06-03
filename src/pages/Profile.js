import React, { Component } from "react";
import axios from "axios";
import qs from "query-string";
import setCurrentUser from "../util/setCurrentUser";

import Navbar from "../components/Navbar";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            bio: "",
        };
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    componentDidMount() {
        const { user } = qs.parse(document.location.search);

        if (!user) {
            this.getCurrentUserProfile();
        } else {
            this.fetchUser(user);
        }
    }

    getCurrentUserProfile = () => {
        let user = localStorage.getItem("currentUser");
        if (user) {
            user = JSON.parse(user);

            this.setState(
                {
                    user,
                    isOwnProfile: true,
                },
                this.getSessionsBelongingToUser
            );
        } else {
            this.fetchCurrentUser();
        }
    };

    fetchUser = async (userId) => {
        return axios
            .get(`http://localhost:5000/user/id/${userId}`)
            .then(({ data }) => {
                this.setState(
                    {
                        user: data.user,
                        isOwnProfile: false,
                    },
                    this.getSessionsBelongingToUser
                );
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    fetchCurrentUser = async () => {
        return axios
            .get("http://localhost:5000/user/current")
            .then(({ data }) => {
                this.setState(
                    {
                        user: data.user,
                        isOwnProfile: true,
                    },
                    this.getSessionsBelongingToUser
                );
            })
            .catch((err) => {
                if (err.response) {
                    // log user out
                    setCurrentUser();
                }
            });
    };

    startEdit = () => {
        this.setState({
            editing: true,
        });
    };

    stopEdit = () => {
        if (!this.state.isOwnProfile) return;
        axios
            .post(`http://localhost:5000/user/update/${this.state.user.id}`, {
                bio: this.state.bio,
            })
            .then(({ data }) => {
                this.setState({
                    user: data.user,
                    editing: false,
                });
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    getSessionsBelongingToUser = () => {
        console.log("fetching sessions");
        axios
            .get(
                `http://localhost:5000/tour/session/byUser/${this.state.user.id}`
            )
            .then(({ data }) => {
                console.log("sessions ", data.sessions);
                this.setState(
                    {
                        sessions: data.sessions,
                    },
                    this.getTourNamesFromSessions
                );
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    getTourNamesFromSessions = () => {
        this.state.sessions.forEach((session, i) => {
            axios
                .get(`http://localhost:5000/tour/byId/${session.tourId}`)
                .then(({ data }) => {
                    this.setState(
                        (state) => {
                            state.sessions[i].tourName = data.tour.title;
                            return state;
                        },
                        () => {
                            if (i === this.state.sessions.length - 1) {
                                this.setState({
                                    sessionsReadyToRender: true,
                                });
                            }
                        }
                    );
                });
        });
    };

    render() {
        const { user, isOwnProfile, editing } = this.state;
        let dateString;
        if (user) {
            dateString = new Date(user.createdAt).toDateString();
        }
        return (
            <>
                <Navbar />
                <div>
                    {user && (
                        <>
                            <h2>{user.username}</h2>
                            <div className="name">
                                {user.firstName} {user.lastName}
                            </div>
                            {isOwnProfile && (
                                <div className="balance">
                                    balance: ${user.balance / 100}
                                </div>
                            )}
                            <div className="registerDate">
                                member since: {dateString}
                            </div>
                            {!editing && (
                                <div className="bio">bio: {user.bio}</div>
                            )}
                            {editing && (
                                <div className="form-group">
                                    <label
                                        htmlFor="bio"
                                        style={{ visibility: "hidden" }}
                                    >
                                        bio:
                                    </label>
                                    <textarea
                                        name="bio"
                                        placeholder="Enter a bio..."
                                        onChange={this.onChange}
                                        value={this.state.bio}
                                    />
                                </div>
                            )}
                            {isOwnProfile && !editing && (
                                <button onClick={this.startEdit}>
                                    Edit bio
                                </button>
                            )}
                            {isOwnProfile && editing && (
                                <button onClick={this.stopEdit}>
                                    Save changes
                                </button>
                            )}
                            {this.state.sessionsReadyToRender && (
                                <>
                                    <h3>Sessions</h3>
                                    <div
                                        className="sessions"
                                        style={{ display: "flex" }}
                                    >
                                        {this.state.sessions.map((session) => (
                                            <div
                                                className="session"
                                                style={{ marginRight: "20px" }}
                                            >
                                                <div className="tourName">
                                                    {session.tourName}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </>
        );
    }
}
