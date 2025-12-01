import { Bazen } from "./bazen";
import { Fontana } from "./fontana";
import { Sto } from "./sto";
import { Stolica } from "./stolica";
import { Zelenilo } from "./zelenilo";

export class Raspored {
  idRaspored: number = 0;
  tipBaste: string = '';
  zelenila: Array<Zelenilo>= [];
  bazeni: Array<Bazen> = [];
  stolovi: Array<Sto> = [];
  stolice: Array<Stolica> = [];
  fontane: Array<Fontana> = [];
}
