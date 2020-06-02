import React, { Component } from "react";
import qs from "query-string";
import Axios from "axios";

import Navbar from "../components/Navbar";

export default class TourView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tour: null,
            guide: null,
            isEditable: false,
            editing: false,
            title: "",
            description: "",
            location: "",
            category: "",
            price: "",
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
            this.setState(
                {
                    tour: data.tour,
                    title: data.tour.title,
                    description: data.tour.description,
                    location: data.tour.location,
                    category: data.tour.category,
                    price: data.tour.price,
                },
                () => {
                    console.log("tour:", this.state.tour);
                }
            );
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

    render() {
        return (
            <div>
                <Navbar />
                {this.state.tour && this.state.guide && !this.state.editing && (
                    <div className="tour">
                        <div className="headline">{this.state.tour.title}</div>
                        <div className="description">
                            {this.state.tour.description}
                        </div>
                        <div className="location">
                            {this.state.tour.location}
                        </div>
                        <div className="category">
                            category: {this.state.tour.category}
                        </div>
                        <div className="price">
                            price: ${this.state.tour.price / 100}
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
            </div>
        );
    }
}
