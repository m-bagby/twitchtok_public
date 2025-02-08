import express from "express";
import mongoose from "mongoose";

const makeApp = (makeRoutesFunctions) => {
  const app = express();

  //Set response headers
  app.use((req, res, next) => {
    res.append("Access-Control-Allow-Origin", "https://www.twitchtok.markbagby.io");
    res.append("Access-Control-Allow-Methods", "*");
    res.append("Access-Control-Allow-Headers", "*");
    next();
  });

  //Connect to database
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect("mongodb+srv://" + USERNAME + ":" + PASSWORD + "@twitchtokcluster.rvqyf7d.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true});
  }
  catch (err) {
    console.log("error connecting to database");
    console.log(err);
  }

  //Build router
  makeRoutesFunctions.forEach((makeRoutes) => {
    makeRoutes(app);
  });

  return app;
};

export default makeApp;