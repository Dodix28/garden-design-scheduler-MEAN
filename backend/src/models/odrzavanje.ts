import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Odrzavanje = new Schema({
  idO: {
    type: Number, required:true, unique:true
  },
  status: {
    type: String, required:true
  },
  datumZavrsetka: {
    type: String, 
  },
  vremeZavrsetka: {
    type: String, 
  },
  idZ: {
    type: Number, 
  },
  idF: {
    type: Number, 
  },
  dekorater: {
    type: String,
  }
},{ versionKey: false });

export default mongoose.model("OdrzavanjeModel", Odrzavanje, "odrzavanja");
