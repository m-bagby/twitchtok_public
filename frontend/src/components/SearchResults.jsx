import React, {useMemo, useState, useEffect, useContext} from "react";
import {useLocation} from "react-router-dom";

import {searchTwitch} from "../api/twitchUtils.js";
import AccessTokenContext from "../AccessTokenContext";
import SearchResultCard from "./SearchResultCard.jsx";


const SearchResults = () => {
  const {accessToken} = useContext(AccessTokenContext);

  const [results, setResults] = useState([]);
  const [fetchingResults, setFetchingResults] = useState(true);

  //Search properties in url
  const {search} = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  //Twitch query type and value
  const searchType = query.get("type");
  const searchText = query.get("value");

  //Execute the search
  useEffect(() => {
    getResults();
  }, []);

  //Get results for Twitch query
  const getResults = () => {
    searchTwitch(accessToken, searchType, searchText).then(searchResults => {
      setResults(searchResults.data);
      setFetchingResults(false);
    });
  };

  return (
    <div className={"container"}>
      {
        fetchingResults
          ?
          <img className={"loadingIcon"} src={"./images/loading.svg"} alt={"loading symbol"}/>

          :
          <div className={"searchResults"}>
            {
              results.length === 0
                ?
                <h2>Sorry. No results were found for the {searchType} <i>{searchText}</i></h2>

                :
                <>
                  <h2>Results for the {searchType} <i>{searchText}</i> :</h2>

                  <ul className={"searchResultsList"}>
                    {
                      results.map(result => (
                        <li key={result.id}>
                          <SearchResultCard result={result} resultType={searchType}/>
                        </li>
                      ))
                    }
                  </ul>
                </>
            }
          </div>
      }

    </div>
  );
};


export default SearchResults;