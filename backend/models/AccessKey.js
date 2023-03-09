import mongoose from "mongoose";


const accessKeySchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  }
});

export default mongoose.model("AccessKey", accessKeySchema);