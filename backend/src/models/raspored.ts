import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Raspored = new Schema({
  idRaspored: { type: Number, required: true },
  tipBaste: { type: String},
  zelenila:{
    type:Array
  },
  bazeni:{
    type:Array
  },
  stolovi: {
    type:Array
  },
  stolice:{
    type:Array
  },
  fontane:{
    type:Array
  }
}, { versionKey: false });

export default mongoose.model("RasporedModel", Raspored, "rasporedi");