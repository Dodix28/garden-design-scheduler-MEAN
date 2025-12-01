import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Korisnik = new Schema({
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
    type: String, 
  },
  profilna: {
    type: String, required:true , default: '/uploads/default.png'
  }
}, { versionKey: false });

export default mongoose.model("KorisnikModel", Korisnik, "korisnici");
