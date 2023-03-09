import FrontClip from "../models/FrontClip.js";

//Get frontpage clip objects
export const getFrontpage = (req, res) => {
  //Return 10 random clips
  try {
    FrontClip.aggregate([{$sample: {size: 10}}]).then(clips => {
      res.send(JSON.stringify(clips));
    });
  }
  catch (err) {
    console.log("error getting frontpage clips");
    console.log(err);

    res.sendStatus(500);
  }
};