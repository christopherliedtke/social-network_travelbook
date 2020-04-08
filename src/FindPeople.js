import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

export default function FindPeople() {
    const [searchString, setSearchString] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        let ignore = false;

        axios
            .get(`/findPeople`, {
                params: {
                    q: searchString,
                },
            })
            .then((response) => {
                if (!ignore) {
                    setSearchResults(response.data);
                }
            })
            .catch();

        return () => {
            ignore = true;
        };
    }, [searchString]);

    return (
        <section className="find-people">
            <div className="container">
                <div className="searchbar">
                    <h3>Search for a fellow traveller</h3>
                    <input
                        placeholder="Search..."
                        onChange={(e) => setSearchString(e.target.value)}
                    ></input>
                    {searchString && (
                        <h4 className="text-center">
                            Results for{" "}
                            <span className="sec-color">{searchString}</span>
                        </h4>
                    )}
                </div>
                <div className="search-results">
                    {searchResults.map((searchResult) => {
                        return (
                            <div
                                className="search-result"
                                key={searchResult.id}
                            >
                                <Link to={`/user/${searchResult.id}`}>
                                    <ProfilePicture
                                        first={searchResult["first_name"]}
                                        last={searchResult["last_name"]}
                                        imgUrl={searchResult["image_url"]}
                                        width="180px"
                                        height="180px"
                                    />
                                    <p>
                                        {searchResult["first_name"]}{" "}
                                        {searchResult["last_name"]}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
