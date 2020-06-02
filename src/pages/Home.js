import React, { Component } from "react";
import debounce from "lodash/debounce";
import axios from "axios";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            searchType: "name",
            tours: [],
        };
    }

    handleSearch = (e) => {
        e.preventDefault();
        console.log("handling search");
        // clear previous search error message
        this.setState({
            searchError: "",
        });

        // attempt to search
        this.search();
    };

    search = debounce(() => {
        const { query, searchType } = this.state;

        // set the url for the request based on the searchType
        let url;
        switch (searchType) {
            case "name":
                url = `http://localhost:5000/tour/byTitle/${query}`;
                break;
            case "location":
                url = `http://localhost:5000/tour/byLocation/${query}`;
                break;
            default:
                // if searchType is somehow not one of those values then get the hell out of here
                return;
        }

        // make the request
        axios
            .get(url)
            .then(({ data }) => {
                this.setState(
                    {
                        tours: data.tours,
                    },
                    () => {
                        console.log(this.state.tours);
                    }
                );
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response);
                    this.setState({
                        searchError: err.response.data.message,
                    });
                }
            });
    }, 200);

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    render() {
        return (
            <div className="base-container">
                <div className="header">Home</div>

                <div className="form">
                    <div className="form-group">
                        <label htmlFor="filter">Search by:</label>
                        <select
                            name="searchType"
                            onChange={this.onChange}
                            value={this.state.searchType}
                        >
                            <option value="name">Name</option>
                            <option value="location">Location</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="query" style={{ visibility: "hidden" }}>
                            Search:
                        </label>
                        <input
                            type="text"
                            name="query"
                            placeholder="Search for tours..."
                            onChange={this.onChange}
                            value={this.state.query}
                        />
                    </div>
                    <button
                        type="button"
                        className="searchBTN"
                        onClick={this.handleSearch}
                    >
                        Search
                    </button>
                </div>
                <div className="tour-count">
                    Found {this.state.tours.length} tours
                </div>
                {this.state.tours.length > 0 && (
                    <div className="search-results">
                        {this.state.tours.map((tour) => (
                            <div className="tour">
                                <div className="title">{tour.title}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}
