import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Zakazivanje } from '../models/zakazivanje';
import { Usluga } from '../models/usluga';

@Injectable({
  providedIn: 'root'
})
export class ZakazivanjeService {

  uri = 'http://localhost:4000/zakazivanje';

  constructor(private http: HttpClient) { }

  dohvatiZakazivanjaVlasnik(kor_ime: string){
    const data = {
      kor_ime: kor_ime,
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/dohvatiZakazivanjaVlasnik`, data);
  }

  dohvatiNaCekanju(idF: number){
    const data = {
      idF : idF
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/dohvatiNaCekanju`, data);
  }

  odbijNaCekanju(idZ: number, komentar: string, dekorater: string){
    const data = {
      idZ: idZ,
      komentar: komentar,
      dekorater: dekorater
    }
    return this.http.post<Zakazivanje>(`${this.uri}/odbijNaCekanju`, data);
  }

  prihvatiNaCekanju(idZ: number, dekorater: string){
    const data = {
      idZ: idZ,
      dekorater: dekorater
    }
    return this.http.post<Zakazivanje>(`${this.uri}/prihvatiNaCekanju`, data);
  }

  dohvatiZavrsenaZakazivanjaZaVlasnika(kor_ime: string){
    const data = {
      kor_ime: kor_ime,
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/zavrsenaZakazivanjazaVlasnika`, data);
  }

  dohvatiSvaZavrsenaZakazivanja(){
    return this.http.get<Zakazivanje[]>(`${this.uri}/svaZavrsenaZakazivanja`);
  }

  dohvatiZakazivanje(idZ: number){
    const data = {
      idZ: idZ
    }
    return this.http.post<Zakazivanje>(`${this.uri}/getZakazivanje`,data);
  }

  dodajZakazivanje(kor_ime: string, datumZakazivanja: string, kvadraturaBaste: number, vreme: string,tipBaste: string, kvZelenilo: number, kvNamestaj:number,
    kvFontana: number, brStolova:number, brStolica:number, kvBazen: number, idF: number, usluge: Array<Usluga>,idRaspored: number,opis: string
  ){
    const data = {
      kor_ime: kor_ime,
      datumZakazivanja:datumZakazivanja,
              vreme:vreme,
              kvadraturaBaste: kvadraturaBaste,
              tipBaste: tipBaste,
              kvZelenilo: kvZelenilo,
              kvNamestaj: kvNamestaj,
              kvFontana: kvFontana,
              brStolova: brStolova,
              brStolica: brStolica,
              kvBazen: kvBazen,
              idF: idF,
              usluge: usluge,
              idRaspored: idRaspored,
              opis: opis
    }
    return this.http.post<Zakazivanje>(`${this.uri}/addZakazivanje`,data);
  }

  dodajRaspored(idZ: number, idRaspored: number){
    const data = {
      idZ: idZ,
      idRaspored: idRaspored
    }
    return this.http.post<Zakazivanje>(`${this.uri}/addRaspored`,data);
  }

  dohvatiPrihvaceneZaRadnika(dekorater: string){
    const data = {
      dekorater: dekorater
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/getPrihvacenoZaRadnika`,data);
  }

  dohvatiPrihvaceneZaFirmu(idF: number){
    const data = {
      idF: idF
    }
    return this.http.post<Zakazivanje[]>(`${this.uri}/getPrihvacenoZaFirmu`,data);
  }

  getPrihvacenoZavrsenoNaCekanju(){
    return this.http.get<Zakazivanje[]>(`${this.uri}/getPrihvacenoZavrsenoNaCekanju`);
  }

}
