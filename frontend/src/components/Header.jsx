import React, {useState} from "react";


const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("streamer");

  //Update search text state to reflect changes to input
  const updateSearchText = (event) => {
    const newSearchText = event.target.value;

    setSearchText(newSearchText);
  };

  //Update search type state to reflect changes to input
  const updateSearchType = (event) => {
    const newSearchType = event.target.value;

    setSearchType(newSearchType);
  };

  //If enter is pressed in the text input, execute search
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  //Go to search results page
  const handleSearch = () => {
    window.location = "search?type=" + searchType + "&value=" + searchText;
  };

  return (
    <header>
      <div id={"headerContainer"}>
        <div id={"logoContainer"}>
          <a href={"/"}>
            <img id={"logo"} src={"./images/twitchTok.svg"} alt={"TwitchTok logo"}/>
          </a>

          <a className={"siteTitle"} href={"/"}>TwitchTok</a>
        </div>


        <div id={"searchBar"}>
          <input name={"searchText"} type={"text"} placeholder={"Search"} onChange={updateSearchText}
            onKeyPress={handleKeyPress}/>

          <span>|</span>

          <select name="searchType" onChange={updateSearchType}>
            <option value="streamer">Streamer</option>
            <option value="category">Category</option>
          </select>

          <span>|</span>

          <button onClick={handleSearch}>
            <img src={"./images/search.svg"} alt={"search icon"}/>
          </button>
        </div>

        <div></div>
      </div>
    </header>
  );
};

const clientId = null;
const accessToken = null;


export default Header;