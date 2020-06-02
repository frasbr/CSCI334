import React, { Component } from "react";
import qs from "query-string";
import Axios from "axios";

export default class TourView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tour: null,
            guide: null,
        };
    }

    componentDidMount() {
        this.getTour();
    }

    getTour = () => {
        const { id } = qs.parse(document.location.search);
        Axios.get(`http://localhost:5000/tour/byId/${id}`).then(({ data }) => {
            this.getGuideInfo(data.tour.guide);
            this.setState(
                {
                    tour: data.tour,
                },
                () => {
                    console.log("tour:", this.state.tour);
                }
            );
        });
    };

    getGuideInfo = (id) => {
        Axios.get(`http://localhost:5000/user/id/${id}`).then(
            ({ data, status }) => {
                this.setState(
                    {
                        guide: data.user,
                    },
                    () => {
                        console.log("guide:", this.state.guide);
                    }
                );
            }
        );
    };

    render() {
        return (
            <div>
                {this.state.tour && this.state.guide && (
                    <div className="tour">
                        <div className="headline">{this.state.tour.title}</div>
                        <div className="description">
                            {this.state.tour.description}
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
            </div>
        );
    }
}
