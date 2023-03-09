import mongoose from "mongoose";
import AccessKey from "../models/AccessKey.js";


//Get the access token for the frontend
export const getAccessKey = (req, res) => {
  //Find the access key object and return it
  AccessKey.findById(ACCESS_KEY_OBJ_ID).exec((error, accessKey) => {
    if (error) {
      console.log("Error getting access key by id");
      console.log(error);
      res.sendStatus(400);
    }
    else {
      res.send(accessKey);
    }
  });
};