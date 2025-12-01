import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Firma = new Schema({
  idF: {
    type: Number, required:true, unique:true
  },
  naziv: {
    type: String, required:true
  },
  adresa: {
    type: String, required:true
  },
  kontakt: {
    type: String, 
  },
  usluge: {
    type: Array, 
  },
  dekorateri: {
    type: Array,
  },
  lokacija: {
    latituda: { type: Number },
  longituda: { type: Number }
  },
  godisnji_odmor: {
    pocetak: { type: String },
    kraj: { type: String }
  }
},{ versionKey: false });

export default mongoose.model("FirmaModel", Firma, "firme");
