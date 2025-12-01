import { Dekorater } from "./dekorater";
import { Usluga } from "./usluga";

export class Firma {
  idF : number = 0;
  naziv: string = '';
  adresa: string = '';
  kontakt: string = '';
  usluge: Array<Usluga> = [];
  dekorateri: Array<Dekorater> = [];
  lokacija:  { latituda: number; longituda: number } = { latituda: 0, longituda: 0 };
  godisnji_odmor:  { pocetak: string; kraj: string } = { pocetak: '', kraj: '' };
}
