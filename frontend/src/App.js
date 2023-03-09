import React, {useState, useMemo, useEffect} from "react";
import {getAccessToken} from "./api/backend";
import Header from "./components/Header.jsx";
import Router from "./Router";
import AccessTokenContext from "./AccessTokenContext";


function App() {
  //access token for access to Twitch's API
  const [accessToken, setAccessToken] = useState(null);
  const accessTokenProvider = useMemo(() => ({accessToken, setAccessToken}), [accessToken, setAccessToken]);

  const [loading, setLoading] = useState(false);


  //Initialize access token
  useEffect(() => {
    //Use access token in session storage
    if (sessionStorage.getItem("accessToken") !== null) {
      setAccessToken(JSON.parse(sessionStorage.getItem("accessToken")));
    }
    //Get access token from backend
    else {
      setLoading(true);

      getAccessToken().then(newToken => {
        sessionStorage.setItem("accessToken", JSON.stringify(newToken));
        setAccessToken(newToken);
        setLoading(false);
      });
    }

    //Initialize volume attributes
    if (sessionStorage.getItem("volume") === null) {
      sessionStorage.setItem("volume", JSON.stringify(1.0));
    }
    if (sessionStorage.getItem("muted") === null) {
      sessionStorage.setItem("muted", JSON.stringify(true));
    }
  }, []);


  return (
    <>
      <AccessTokenContext.Provider value={accessTokenProvider}>
        <Header/>

        <main className="App">
          {
            accessToken &&

            <Router/>
          }

          {
            loading &&
            <div className={"appLoading"}>
              <img className={"loadingIcon"} src={"./images/loadingThin.svg"} alt={"loading symbol"}/>
              <img className={"twitchTokIcon"} src={"./images/twitchTok.svg"} alt={"TwitchTok Icon"}/>
            </div>
          }

        </main>
      </AccessTokenContext.Provider>
    </>
  );
}

export default App;