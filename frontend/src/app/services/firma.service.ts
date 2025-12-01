import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firma } from '../models/firma';
import { Usluga } from '../models/usluga';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

  uri = 'http://localhost:4000/firme';

  constructor(private http: HttpClient) { }

  dohvatiSveFirme(){
    return this.http.get<Firma[]>(`${this.uri}/dohvatiSveFirme`);
  }

  dohvatiFirmu(idF: number){
    const data = {
      idF: idF,
    }
    return this.http.post<Firma>(`${this.uri}/dohvatiFirmu`,data);
  }

  dohvatiFirmuPoNazivu(naziv: string){
    const data = {
      naziv: naziv,
    }
    return this.http.post<Firma>(`${this.uri}/dohvatiFirmuPoNazivu`,data);
  }

  dohvatiFirmuZaDekoratera(kor_ime: string){
    const data = {
      kor_ime: kor_ime
    }
    return this.http.post<Firma>(`${this.uri}/dohvatiDekoratera`,data);
  }

  dodajFirmu(naziv: string,adresa: string, kontakt: string, usluge: Array<Usluga>, lokacija: {latituda: number, longituda: number}){
    const data = {
      naziv: naziv,
      adresa: adresa,
      kontakt: kontakt,
      usluge: usluge,
      lokacija: lokacija
    }
    return this.http.post<Firma>(`${this.uri}/addFirm`,data);
  }

  dodajDekoratera(kor_ime: string,ime:string, prezime: string, idF: number){
    const data = {
      kor_ime: kor_ime,
      ime: ime,
      prezime: prezime,
      idF: idF
    }
    return this.http.post<Firma>(`${this.uri}/addDekorator`,data);
  }

  dodajGodisnji(idF: number, pocetak: string, kraj:string){
    const data = {
      idF: idF,
      pocetak: pocetak,
      kraj: kraj
    }
    return this.http.post<Firma>(`${this.uri}/addGodisnji`,data);
  }


}
