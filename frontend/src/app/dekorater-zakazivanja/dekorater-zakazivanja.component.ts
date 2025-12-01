import { Component, OnInit } from '@angular/core';
import { FirmaService } from '../services/firma.service';
import { Korisnik } from '../models/user';
import { Zakazivanje } from '../models/zakazivanje';
import { Firma } from '../models/firma';
import { ZakazivanjeService } from '../services/zakazivanje.service';

@Component({
  selector: 'app-dekorater-zakazivanja',
  templateUrl: './dekorater-zakazivanja.component.html',
  styleUrls: ['./dekorater-zakazivanja.component.css']
})
export class DekoraterZakazivanjaComponent implements OnInit {

  constructor(private firmaService: FirmaService, private zakazivanjaService: ZakazivanjeService){}

  ngOnInit(): void {
    let k = localStorage.getItem('ulogovan');
    if(k != null){
      this.ulogovan = JSON.parse(k);
    }
    this.firmaService.dohvatiFirmuZaDekoratera(this.ulogovan.kor_ime).subscribe((f: Firma) => {
      if(f != null){
        this.firma = f;
      }
      this.zakazivanjaService.dohvatiNaCekanju(this.firma.idF).subscribe((z: Zakazivanje[]) => {
        if(z != null){
          this.zakazivanjaNaCekanju = z;
          this.sortiraj();
        } else {
          this.poruka = "Nema zakazivanja na cekanju."
        }
      })
    })


  }

  ulogovan: Korisnik = new Korisnik();
  zakazivanjaNaCekanju: Zakazivanje[] = [];
  sortiranaZakazivanja: Zakazivanje[] = [];
  firma: Firma = new Firma();
  poruka: string = "";


  sortiraj(){
    this.zakazivanjaNaCekanju.sort((a,b) => {
      if(a.datumZakazivanja<b.datumZakazivanja){
        return 1;
      } else if(a.datumZakazivanja>b.datumZakazivanja){
        return -1
      } else return 0;
    })
  }

  potvrdiTermin(idZ: number){
    this.zakazivanjaService.prihvatiNaCekanju(idZ,this.ulogovan.kor_ime).subscribe((z: Zakazivanje) => {
      if(z != null){
        alert("Uspesno ste prihvatili rezervaciju!")

        this.zakazivanjaService.dohvatiNaCekanju(this.firma.idF).subscribe((zak: Zakazivanje[]) => {
          this.zakazivanjaNaCekanju = zak;
          this.sortiraj();
        })
      } else {
        alert("GRESKA pri prihvatanju rezervacije")
      }
    })
  }

  odbijTermin(z: Zakazivanje){
    if(z.komentar == "") {
      this.poruka = "Morate uneti komentar!"
      return;
    }

    this.poruka = ""
    this.zakazivanjaService.odbijNaCekanju(z.idZ,z.komentar,this.ulogovan.kor_ime).subscribe((z: Zakazivanje) => {
      if(z != null){
        alert("Uspesno ste odbili rezervaciju!")
        this.ngOnInit();
      } else {
        alert("GRESKA pri odbijanju rezervacije")
      }
    })
  }
}
