import React from 'react';
import axios from 'axios';

import createTourImage from "./img/createTour.jpg";

export class CreateTour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            location: "",
            description: "",
            category: "",
            price: "",
        };
}

create = () => {
    const { title, location, description, category, price } = this.state;
    axios
        .post("http://localhost:5000/tour/create", {
            title,
            location,
            description,
            category,
            price,
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
                Desire to create your own Tour? <br/> Fill in the details of your new tour below.
            </div>
            <div className="content">
                <div className="image">
                    <img src={createTourImage} alt="" />
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="title">Display Title for your Tour</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="enter desired name for your new tour"
                            onChange={this.onChange}
                            value={this.state.title}
                        />
                        <div className="form-group">
                            <label htmlFor="location">Where is this Tour Located?</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="enter with format of 'city, postcode, country'"
                                onChange={this.onChange}
                                value={this.state.location}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description and Features of your Tour</label>
                            <textarea
                                name="description"
                                placeholder="enter features and a description regarding your tour"
                                onChange={this.onChange}
                                value={this.state.description}
                                rows={4}
                                cols={37}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category of your Tour</label>
                            <textarea
                                name="category"
                                placeholder="e.g. 'Sightseeing', 'Watersports', 'Culture'"
                                onChange={this.onChange}
                                value={this.state.category}
                                rows={2}
                                cols={37}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">The admission cost of your Tour</label>
                            <input
                                type="text"
                                name="cost"
                                placeholder="e.g. '$120.90 AUD'"
                                onChange={this.onChange}
                                value={this.state.cost}
                            />
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button
                        type="button"
                        className="createTourBTN"
                        onClick={this.create}
                    >
                        Create Tour
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

export default CreateTour;