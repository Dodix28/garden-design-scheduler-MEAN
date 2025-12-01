import { Component, OnInit } from '@angular/core';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Korisnik } from '../models/user';
import { Zakazivanje } from '../models/zakazivanje';
import { RasporedService } from '../services/raspored.service';
import { Raspored } from '../models/raspored';
import { Odrzavanje } from '../models/odrzavanje';
import { OdrzavanjeService } from '../services/odrzavanje.service';

@Component({
  selector: 'app-vlasnik-odrzavanje',
  templateUrl: './vlasnik-odrzavanje.component.html',
  styleUrls: ['./vlasnik-odrzavanje.component.css']
})
export class VlasnikOdrzavanjeComponent implements OnInit {

  constructor(private zakazivanjeService: ZakazivanjeService, private rasporedService: RasporedService,
    private odrzavanjeService: OdrzavanjeService){}

  ngOnInit(): void {
    let k = localStorage.getItem('ulogovan')
    if(k != null){
      this.ulogovan = JSON.parse(k);
    }
    this.zakazivanjeService.dohvatiZavrsenaZakazivanjaZaVlasnika(this.ulogovan.kor_ime).subscribe((z: Zakazivanje[]) => {
      if(z != null){
        this.zavrsenaZakazivanja = z;
        this.zavrsenaZakazivanja.forEach((zakazivanje: Zakazivanje) => {
          if(zakazivanje.idRaspored != 0){
            this.rasporedService.getRaspored(zakazivanje.idRaspored).subscribe((r:Raspored) => {
              const rasp = Array.isArray(r)? r[0] : r;
              if(rasp != null){
                zakazivanje.brBazena = rasp.bazeni.length;
                zakazivanje.brFontana = rasp.fontane.length;
              }
            })
          }
        })
      } else {
        this.poruka = "Nema zavrsenih poslova."
      }
    })

    this.zakazivanjeService.dohvatiZavrsenaZakazivanjaZaVlasnika(this.ulogovan.kor_ime).subscribe((z: Zakazivanje[]) =>{
      if(z != null){
        z.forEach((zakazivanje: Zakazivanje) => {
          this.odrzavanjeService.dohvatiPrihvacenoInaCekanju(zakazivanje.idZ).subscribe((o: Odrzavanje) =>{
            //pronadjen posao koji se odrzava -prihvaceno/na cekanju
            if(o != null){
              const posao = Array.isArray(o)? o[0] : o;
              const noviPosao: Odrzavanje = new Odrzavanje();
              noviPosao.idO = posao.idO;
              noviPosao.idF = posao.idF;
              noviPosao.idZ = posao.idZ;
              noviPosao.status= posao.status;
              noviPosao.vremeZavrsetka = posao.vremeZavrsetka;
              noviPosao.datumZavrsetka= posao.datumZavrsetka;
              noviPosao.dekorater = posao.dekorater;

              noviPosao.idRaspored = zakazivanje.idRaspored;
              noviPosao.tipBaste = zakazivanje.tipBaste;
              noviPosao.kvBazen = zakazivanje.kvBazen;
              noviPosao.kvFontana = zakazivanje.kvFontana;
              noviPosao.brBazena = zakazivanje.brBazena;
              noviPosao.brFontana = zakazivanje.brFontana;
              noviPosao.nazivFirme = zakazivanje.nazivFirme;

              this.prihvacenaInaCekanju.push(noviPosao);
              console.log("NoviPosao",noviPosao)
              console.log("StariPosao",posao)

              this.prihvacenaInaCekanju.forEach((odrzavanje: Odrzavanje) => {
                console.log('odrzavanje za raspored' , odrzavanje)
                if(odrzavanje.idRaspored != 0){
                  this.rasporedService.getRaspored(odrzavanje.idRaspored).subscribe((r: Raspored) => {
                    const rasp = Array.isArray(r)? r[0] : r;
                    console.log('Odrzavanje.idRaspored', odrzavanje.idRaspored)
                    if(rasp != null){
                      odrzavanje.brBazena = rasp.bazeni.length;
                      odrzavanje.brFontana = rasp.fontane.length;
                    }
                  })
                }
              })

            }
          })
        })

      } else {
        this.poruka = "Nema vodenih povrsina u procesu odrzavanja niti na cekanju"
      }
    })




  }

  ulogovan: Korisnik = new Korisnik();
  zavrsenaZakazivanja: Zakazivanje[] = [];
  poruka: string = '';
  prihvacenaInaCekanju: Odrzavanje[] = [];

  zakazi(idZ: number, idF: number){
    this.odrzavanjeService.dodajOdrzavanje(idZ,idF).subscribe((o: Odrzavanje) => {
      if(o != null){
        alert('Uspesno ste zakazali odrzavanje.')
        this.ngOnInit();
      } else {
        alert('greska pri zakaivanju');
      }
    })
  }


  isThreeDaysPassed(dateString: string): boolean {
    const endDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - endDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 3;
  }

  vecZakazao(idZ: number): boolean{
    this.odrzavanjeService.dohvatiNaCekanjuZahtev(idZ).subscribe((o: Odrzavanje) => {
      if(o != null){
        return false;
      } else {
        return true;
      }
    })
    return false;
  }
  isSixMonthsPassed(dateString: string): boolean {
    const endDate = new Date(dateString);
    const currentDate = new Date();
    const sixMonthsLater = new Date(endDate.setMonth(endDate.getMonth() + 6));
    return currentDate > sixMonthsLater;
  }

  poslednjeOdrzavanje(idZ: number): boolean{
    this.odrzavanjeService.dohvatiZahtev(idZ).subscribe((o: Odrzavanje) => {
      if(o != null){
        return this.isSixMonthsPassed(o.datumZavrsetka);
      } else {
        return false;
      }
    })
    return false;
  }

}
