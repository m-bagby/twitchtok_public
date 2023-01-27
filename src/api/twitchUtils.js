import {getFrontpageClipIDs} from "./backend";

const gameTitles = new Map(); //hold translations of game ids to game titles

//Get homepage clips
export const getHomepageClips = async (accessToken) => {
  return new Promise(async (resolve) => {
    //Get random clipIDs from my backend's compilation of popular clips
    const clipIDs = await getFrontpageClipIDs();

    //Put together url query for clips
    let queryString = "?";
    for (let i in clipIDs) {
      queryString += "id=" + clipIDs[i];

      if (i < clipIDs.length - 1) {
        queryString += "&";
      }
    }

    //Get the full clips from Twitch
    const getClipsURL = "https://api.twitch.tv/helix/clips";

    const header = {
      "Authorization": "Bearer " + accessToken,
      "Client-ID": clientId,
      "Accept": "application/json",
    };

    fetch(getClipsURL + queryString, {
      method: "get",
      headers: header,
    }).then(response => {
      if (response.ok) {
        response.json().then(async json => {
          //Fill in game titles
          json.data = await addGameTitles(accessToken, json.data);

          resolve(json);
        });
      } else {
        console.log("error fetching frontpage clips from Twitch");
      }
    })
  });
}


//Get streamer clips
//Get game clips
export async function getClips(accessToken, searchType, id, queryCursor = "") {
  let query = "?"
  if (searchType === "category") {
    query += "game_id=" + id;
  } else if (searchType === "streamer") {
    query += "broadcaster_id=" + id;
  }

  if (queryCursor !== "") {
    query += "&after=" + queryCursor;
  }
  query += "&first=5";


  const gameClipsURL = "https://api.twitch.tv/helix/clips" + query;

  const header = {
    "Authorization": "Bearer " + accessToken,
    "Client-ID": clientId,
    "Accept": "application/json",
  };

  return new Promise(resolve => {
    fetch(gameClipsURL, {
      method: "GET",
      headers: header,
    })
      .then(response => {
        if (response.ok) {
          response.json()
            .then(async (json) => {
              //Fill in game titles
              json.data = await addGameTitles(accessToken, json.data);

              resolve(json);
            });
        } else {
          console.log("error");
        }
      });
  });
}


//Add game titles to clip objects
const addGameTitles = async (accessToken, clips) => {
  let unmappedGameIds = [];

  return new Promise(async resolve => {
    //Add known titles to clips
    for (let i in clips) {
      if (gameTitles.has(clips[i].game_id)) {
        clips[i].gameName = gameTitles.get(clips[i].game_id);
      } else {
        unmappedGameIds.push(clips[i].game_id);
      }
    }

    //Map new game ids and add titles to the remaining clips
    if (unmappedGameIds.length > 0) {
      await getGameNames(accessToken, unmappedGameIds).then((games) => {
        for (let game of games) {
          if (!gameTitles.has(game.id)) {
            gameTitles.set(game.id, game.name)
          }
        }
      });

      for (let i in clips) {
        if (!clips[i].gameName) {
          const name = gameTitles.get(clips[i].game_id);
          clips[i].gameName = name;
        }
      }
    }

    resolve(clips);
  });
}


//get game names
export async function getGameNames(accessToken, ids) {
  let query = "?";

  for (let i in ids) {
    query += "id=" + ids[i];

    //Add &s between separate ids
    if (i !== ids.length - 1) {
      query += "&";
    }
  }

  const header = {
    "Authorization": "Bearer " + accessToken,
    "Client-ID": clientId,
    "Accept": "application/json",
  };
  const url = "https://api.twitch.tv/helix/games" + query;

  return new Promise(resolve => {
    fetch(url, {
      method: "GET",
      headers: header,
    })
      .then(response => {
        if (response.ok) {
          response.json()
            .then(json => {
              resolve(json.data);
            });
        } else {
          console.log("error");
        }
      });
  });
}


//Search for a streamer or game on Twitch
export const searchTwitch = async (accessToken, searchType, searchText) => {
  return new Promise(resolve => {
    //channels categories
    if (searchType === "streamer") {
      searchType = "channels";
    } else {
      searchType = "categories"
    }

    const getUrl = "https://api.twitch.tv/helix/search/" + searchType + "?query=" + searchText;

    fetch(getUrl, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Client-ID": clientId,
        "Accept": "application/json",
      }
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(body => {
          resolve(body);
        });
      } else {
        console.log("Error searching Twitch");
        console.log(response);
      }
    })
  });
}