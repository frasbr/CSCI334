import axios from "axios";

export default (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        console.log("default header set");
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};
