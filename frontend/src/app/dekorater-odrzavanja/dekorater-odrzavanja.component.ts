import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/user';
import { Odrzavanje } from '../models/odrzavanje';
import { Firma } from '../models/firma';
import { FirmaService } from '../services/firma.service';
import { OdrzavanjeService } from '../services/odrzavanje.service';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Zakazivanje } from '../models/zakazivanje';

@Component({
  selector: 'app-dekorater-odrzavanja',
  templateUrl: './dekorater-odrzavanja.component.html',
  styleUrls: ['./dekorater-odrzavanja.component.css']
})
export class DekoraterOdrzavanjaComponent implements OnInit{

  constructor(private firmaService: FirmaService,private odrzavanjeService: OdrzavanjeService, private zakazivanjeService: ZakazivanjeService){}

  ngOnInit(): void {
    let u = localStorage.getItem('ulogovan')
    if(u != null){
      this.ulogovan = JSON.parse(u);
    }

    this.firmaService.dohvatiFirmuZaDekoratera(this.ulogovan.kor_ime).subscribe((f: Firma)=>{
      if(f != null){
        this.mojaFirma = f;

        this.odrzavanjeService.dohvatiNaCekanju(f.idF).subscribe((o: Odrzavanje[]) => {
          if(o != null){
            this.naCekanju = o;
            this.naCekanju.forEach((odrzavanje: Odrzavanje) => {

             this.zakazivanjeService.dohvatiZakazivanje(odrzavanje.idZ).subscribe((zak: Zakazivanje) => {
              const z = Array.isArray(zak)? zak[0] :zak;
              if(z != null ){
                odrzavanje.tipBaste = z.tipBaste;
                odrzavanje.kvBazen = z.kvBazen;
                odrzavanje.kvFontana = z.kvFontana;
                console.log('Tip promenljive z:', typeof z);

              } else {
                alert('greska')
              }
             })
            })

          } else {
            this.poruka1 = "Nema odrzavanja koji su na cekanju."
          }
        })


      } else {
        alert('Ovaj dekorater nije zaposlen ni u jednoj firmi.')
      }
    })
  }

  ulogovan: Korisnik = new Korisnik();
  naCekanju: Odrzavanje[] = [];
  mojaFirma: Firma = new Firma();

  poruka1: string = '';

  prikaziFormuVreme: boolean = false;
  idOFormaVreme: number = 0;
  datum: string = '';
  vreme: string = '';
  porukaDV: string = "";

  odbij(idO: number){
    this.odrzavanjeService.promeniStatus(idO,"odbijeno").subscribe((o: Odrzavanje) => {
      if(o!= null){
        alert('Uspesno odbijeno!')
        this.ngOnInit();
      }
    })
  }

  prihvati(idO: number){
    this.odrzavanjeService.promeniStatus(idO,"prihvaceno").subscribe((o: Odrzavanje) => {
      if(o!= null){
        alert('Uspesno prihvaceno!')
        this.prikaziFormuVreme = true;
        this.idOFormaVreme = idO;
      }
    })
  }

  prosledi(){
    if(this.datum == "" || this.vreme == ""){
      this.porukaDV = "Niste uneli sve potrebne podatke."
      return
    }
    this.porukaDV = "";
    this.odrzavanjeService.postaviDatumVreme(this.idOFormaVreme,this.datum,this.vreme).subscribe((o: Odrzavanje) => {
      if(o != null){
        alert('Uspesno ste postavili vreme zavrsetka!')
        this.ngOnInit();
        this.prikaziFormuVreme = false;
      }
    })
  }
}
