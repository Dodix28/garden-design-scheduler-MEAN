import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/user';
import { Zakazivanje } from '../models/zakazivanje';
import { UserService } from '../services/user.service';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { FirmaService } from '../services/firma.service';
import { Firma } from '../models/firma';

@Component({
  selector: 'app-vlasnik-zakazivanj',
  templateUrl: './vlasnik-zakazivanj.component.html',
  styleUrls: ['./vlasnik-zakazivanj.component.css']
})
export class VlasnikZakazivanjComponent implements OnInit{

  constructor(private userService: UserService, private zakazivanjeService: ZakazivanjeService,private firmaService: FirmaService){}

  ngOnInit(): void {
    let k = localStorage.getItem('ulogovan');
    if(k != null){
      this.ulogovan = JSON.parse(k);
    }
    this.zakazivanjeService.dohvatiZakazivanjaVlasnik(this.ulogovan.kor_ime).subscribe((z: Zakazivanje[]) => {
      if(z != null) {
        this.mojaZakazivanja = z;
        this.mojaZakazivanja.forEach((zak: Zakazivanje) => {
          this.firmaService.dohvatiFirmu(zak.idF).subscribe((f: Firma) => {
            zak.nazivFirme = f.naziv;
          })
        })
      } else {
        this.poruka = "Nemate nijedno aktuelno zakazivanje."
      }
    })

  }

  ulogovan: Korisnik = new Korisnik();
  mojaZakazivanja: Zakazivanje[] = [];

  poruka: string = '';

}
