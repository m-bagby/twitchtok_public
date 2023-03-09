//Get app's access token for the Twitch API from the backend
export const getAccessToken = async () => {
  return new Promise(resolve => {
    fetch(BACKEND_URL + "/accessToken", {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    }).then(response => {
      if (response.status === 200) {
        response.json().then(json => {
          resolve(json.token);
        });
      }
      else {
        alert("Oops! Something went wrong");
      }
    });
  });
};


//Get a collection clip IDs for the frontpage from the backend
export const getFrontpageClipIDs = async () => {
  return new Promise(resolve => {
    fetch(BACKEND_URL + "/frontpage", {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    }).then(response => {
      if (response.status === 200) {
        response.json().then(clips => {
          const clipIDs = [];

          for (let clip of clips) {
            clipIDs.push(clip.clipID);
          }

          resolve(clipIDs);
        });
      }
      else {
        alert("Oops! Something went wrong");
      }
    });
  });
};