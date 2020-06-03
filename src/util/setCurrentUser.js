import axios from "axios";

export default (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
        if (document.location.pathname !== "/login") {
            document.location = "/login";
        }
    }
};
