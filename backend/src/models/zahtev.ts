import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Zahtev = new Schema({
  idZ: {
    type: Number, required:true
  },
  ime: {
    type: String, required:true
  },
  prezime: {
    type: String, required:true
  },
  kor_ime: {
    type: String, required:true, unique:true
  },
  lozinka: {
    type: String, required:true
  },
  mejl: {
    type: String, required:true, unique:true
  },
  tip: {
    type: String, required:true
  },
  pol: {
    type: String, required:true
  },
  adresa: {
    type: String, required:true
  },
  kontakt: {
    type: String, required:true
  },
  brKartice: {
    type: String, required:true
  },
  profilna: {
    type: String
  },
  status: {
    type: String,
  }
});

export default mongoose.model("ZahtevModel", Zahtev, "zahtevi");
