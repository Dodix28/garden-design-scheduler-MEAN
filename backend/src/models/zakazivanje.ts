import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Zakazivanje = new Schema({
  idZ: {
    type: Number, required:true, unique:true
  },
  datumZakazivanja: {
    type: String, required:true
  },
  vreme: {
    type: String, required:true
  },
  kvadraturaBaste: {
    type: String, 
  },
  tipBaste: {
    type: String, 
  },
  kvBazen: {
    type: Number, 
  },
  kvZelenilo: {
    type: Number, 
  },
  kvNamestaj: {
    type: Number, 
  },
  kvFontana: {
    type: Number, 
  },
  brStolova: {
    type: Number, 
  },
  brStolica: {
    type: Number, 
  },
  kor_ime: {
    type: String, 
  },
  usluge: {
    type: Array,
  },
  idF: {
    type: Number,
  },
  datumIzrade: {
    type: String,
  },
  status: {
    type: String
  },
  dekorater: {
    type: String
  },
  komentar: {
    type: String
  },
  datumZavrsetka: {
    type: String
  },
  opis: {
    type: String
  },
  idRaspored: {
    type: Number,
  },
},{ versionKey: false });

export default mongoose.model("ZakazivanjeModel", Zakazivanje, "zakazivanja");
