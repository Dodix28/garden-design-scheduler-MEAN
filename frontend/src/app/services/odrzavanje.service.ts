import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Odrzavanje } from '../models/odrzavanje';

@Injectable({
  providedIn: 'root'
})
export class OdrzavanjeService {

  uri = 'http://localhost:4000/odrzavanja';

  constructor(private http: HttpClient) { }

  dohvatiNaCekanju(idF : number){
    const data = {
      idF: idF
    }
  return this.http.post<Odrzavanje[]>(`${this.uri}/dohvatiNaCekanju`,data);
  }

  promeniStatus(idO:number, status: string){
    const data = {
      idO: idO,
      status: status
    }
    return this.http.post<Odrzavanje>(`${this.uri}/changeStatus`,data);
  }

  postaviDatumVreme(idO:number, datumZavrsetka: string, vremeZavrsetka: string) {
    const data = {
      idO: idO,
      vremeZavrsetka: vremeZavrsetka,
      datumZavrsetka: datumZavrsetka
    }
    return this.http.post<Odrzavanje>(`${this.uri}/postaviDatumVreme`,data);
  }

  dohvatiPrihvacenoInaCekanju(idZ: number){
    const data = {
      idZ: idZ
    }
    return this.http.post<Odrzavanje>(`${this.uri}/getPrihvacenoInaCekanju`,data);
  }

  dodajOdrzavanje(idZ: number, idF: number){
    const data = {
      idZ: idZ,
      idF: idF
    }
    return this.http.post<Odrzavanje>(`${this.uri}/addOdrzavanje`,data);
  }

  dohvatiNaCekanjuZahtev(idZ: number){
    const data = {
      idZ: idZ,
    }
    return this.http.post<Odrzavanje>(`${this.uri}/dohvatiNaCekanjuZahtev`,data);
  }

  dohvatiZahtev(idZ: number){
    const data ={
      idZ: idZ
    }
    return this.http.post<Odrzavanje>(`${this.uri}/dohvatiOdrzavanjeZahtev`,data);
  }

  dohvatiPrihvaceneZaRadnika(dekorater: string){
    const data = {
      dekorater: dekorater
    }
    return this.http.post<Odrzavanje[]>(`${this.uri}/dohvatiPrihvaceneZaRadnika`,data);
  }

  dohvatiPrihvaceneZaFirmu(idF: number){
    const data = {
      idF: idF
    }
    return this.http.post<Odrzavanje[]>(`${this.uri}/dohvatiPrihvaceneZaFirmu`,data);
  }
}
