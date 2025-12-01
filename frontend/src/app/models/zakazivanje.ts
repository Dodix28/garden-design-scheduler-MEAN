import { Usluga } from "./usluga";

export class Zakazivanje {
  idZ : number = 0;
  datumZakazivanja: string = '';
  vreme: string = '';
  kvadraturaBaste: number = 0;
  tipBaste: string = ''
  kvBazen: number = 0;
  kvZelenilo: number = 0;
  kvNamestaj: number = 0;
  kvFontana: number = 0;
  brStolova: number = 0;
  brStolica: number = 0;
  kor_ime: string = '';
  usluge: Array<Usluga> = [];
  idF: number = 0;
  datumIzrade: string = "";
  status: string = '';
  dekorater: string = '';
  komentar: string = "";
  datumZavrsetka: string= "";
  opis: String = "";
  idRaspored: number = 0;

  nazivFirme: string = "";
  brFontana: number = 0;
  brBazena: number = 0;

}
