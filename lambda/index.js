import mongoose from "mongoose";
import AccessKey from "./AccessKey.js";


//Create a new access token and update the existing database object
export const handler = async (event) => {
  //URL to request new access token
  const accessTokenURL = "https://id.twitch.tv/oauth2/token?client_id=" + CLIENT_ID + "&client_secret=" + SECRET_KEY + "&grant_type=client_credentials";

  //Fetch response
  const res = {
    statusCode: 200,
  };

  //Connect to mongodb
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb+srv://" + USERNAME + ":" + PASSWORD + DATABASE_URL,{useNewUrlParser: true});
  }
  catch (err) {
    console.log("error connecting to database");
    console.log(err);
  }

  try {
    //Generate a new access token
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    }).then(response => {
      //Success, update database access key to have new token
      if (response.status === 200) {
        response.json()
          .then(json => {
            if (json.access_token) {
              //Make change to database key object
              const accessKey = new AccessKey;
              accessKey._id = mongoose.Types.ObjectId(ACCESS_KEY_OBJ_ID);
              accessKey.token = json.access_token;

              //Update access key in database
              AccessKey.findByIdAndUpdate(ACCESS_KEY_OBJ_ID, {token: json.access_token}, (err, key) => {
                if (err) {
                  console.log("error updating access token in database");
                  console.log(err);
                  res.statusCode = 500;
                  return (res);
                }
                //Success, return updated access key object
                else {
                  console.log("New key created and updated successfully");
                  console.log(key);
                  return (res);
                }
              });
            }
          });
      }
      else {
        console.log("error generating token");
        console.log(response.statusCode);
        res.statusCode = 500;
        return (res);
      }
    });
  }
  catch (err) {
    console.log("error in fetch");
    console.log(err);
  }
};