import mongoose from "mongoose";


const frontClipSchema = new mongoose.Schema({
  clipID: {
    type: String,
    required: true,
    unique: true,
  }
});

export default mongoose.model("FrontClip", frontClipSchema);