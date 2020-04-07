import React, { useState, useEffect } from "react";
import axios from "./axios";
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
                            Results for <span>{searchString}</span>
                        </h4>
                    )}
                </div>
                <div className="search-results">
                    {searchResults.map((searchResult) => {
                        return (
                            <div key={searchResult.id}>
                                <ProfilePicture
                                    first={searchResult["first_name"]}
                                    last={searchResult["last_name"]}
                                    imgUrl={searchResult["image_url"]}
                                    width="200px"
                                    height="200px"
                                />
                                <p>
                                    {searchResult["first_name"]}{" "}
                                    {searchResult["last_name"]}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
