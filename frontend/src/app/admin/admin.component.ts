import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ZahtevService } from '../services/zahtev.service';
import { Zahtev } from '../models/zahtev';
import { UserService } from '../services/user.service';
import { Korisnik } from '../models/user';
import { Firma } from '../models/firma';
import { FirmaService } from '../services/firma.service';
import { MapService } from '../services/map.service';
import { Usluga } from '../models/usluga';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private zahtevService: ZahtevService, private userService: UserService, private firmaService: FirmaService,
    private mapService: MapService,private router: Router
  ) {}


  ngOnInit(): void {
    this.zahtevService.dohvatiNaCekanju().subscribe((z: Zahtev[]) => {
      this.zahtevi = z;
    })
    this.userService.dohvatiSveVlasnike().subscribe((k: Korisnik[]) => {
      this.sviVlasnici = k;
    })
    this.userService.dohvatiSveDekoratere().subscribe((k: Korisnik[]) => {
      this.sviDekorateri = k;
    })
    this.firmaService.dohvatiSveFirme().subscribe((f: Firma[]) => {
      this.sveFirme = f;
      /*this.sveFirme.forEach((firma: Firma) => {
        console.log('Firma', firma);
        console.log('GodisnjiPocetak:',firma.godisnji_odmor[0].pocetak)
        console.log('GodisnjiKraj:',firma.godisnji_odmor[0].kraj)
      })*/
    })

    this.coordinates = this.mapService.getCoordinates();

  }

  zahtevi: Zahtev[] = [];
  sviVlasnici: Korisnik[] = [];
  sviDekorateri: Korisnik[] = [];
  sveFirme: Firma[] = [];

  //azuriranje korisnika
  kor_ime: string = '';
  ime: string = '';
  prezime: string = "" ;
  tip: string = "";
  mejl: string = "";
  pol: string = "";
  adresa: string = "";
  kontakt: string = "";
  selectedFile: File | null = null;

  poruka: string = "";    //azurirajKorisnika()
  porukaMejl: string = "";
  porukaKontakt:string = "";

  poruka1: string = "";   //findUserMessage()

  prikaziFormuZaAzuriranje: boolean = false;
  korisnikAzuriranje: Korisnik = new Korisnik();
  prikaziTabelu: boolean = false

  //dodavanje firme
  nazivFirme: string = '';
  adresaFirme: string = '';
  kontaktFirme: string = "";

  porukaKontaktF: string = '';
  porukaF: string = "";
  //usluge:
   usluge: Usluga[] = [];
   porukaU: string = "";
   //mapa lokacija
   lokacija: {latituda: number, longituda: number} = {latituda: 0, longituda: 0}
  porukaLokacije: string = "";
  coordinates: { lat: number; lng: number } | null = null;

  //dodaj radnika u firmu
  imeRadnika: string = "";
  prezimeRadnika: string = "";
  firmaZaRadnika: string = '';
  firmaGodisnji: string = "";
  porukaR: string = "";

  //dodaj godisnji
  pocetakGodisnji: string = '';
  krajGodisnji: string = '';

  porukaG: string = '';



  //dodaj zaposlenog
  kor_ime_reg: string = "";
  lozinka_reg: string = "";
  ime_reg: string = "";
  prezime_reg: string = "";
  pol_reg: string = "";
  adresa_reg: string = "";
  kontakt_reg: string = "";
  mejl_reg: string = "";
  kartica_reg: string = "";
  cardType: string = "";
  selectedFileZaposleni: File | null = null;
  errorMessage: string= '';

  porukaReg: string = "";
  porukaLozinkaZ: string = "";
  porukaMejlZ: string = "";
  porukaKontaktZ: string = "";

  odjaviSe(){
    localStorage.removeItem('ulogovan');
    this.router.navigate(['adminLogin'])
  }

 /*----------------------------------------- zahtevi -------------------------------- */
  prihvati(z: Zahtev){
    this.zahtevService.prihvatiZahtev(z.idZ).subscribe((zahtev: Zahtev) => {
      if(zahtev != null){
        alert('Uspesno prihvacen zahtev!');
        this.userService.dodajKorisnika(zahtev.ime,zahtev.prezime ,zahtev.kor_ime ,zahtev.lozinka ,zahtev.adresa,zahtev.tip,zahtev.mejl,zahtev.pol,zahtev.kontakt,
          zahtev.brKartice,zahtev.profilna
        ).subscribe((k: Korisnik) => {
          if(k != null){
            alert('Uspesno dodat korisnik!');
          }
        })
        this.ngOnInit();
      }
    })
  }

  odbij(z:Zahtev){
    this.zahtevService.odbijZahtev(z.idZ).subscribe((zahtev: Zahtev)=>{
      if(zahtev != null){
        alert('Uspesno odbijen zahtev!');
        this.ngOnInit();
      }
    })
  }

  /* ----------------------------Azuriranje info o korisnicima ------------------------------ */

  findUser(){
    if(this.kor_ime == ""){
      this.poruka1 = "Niste uneli nijedan podatak.";
      return;
    }
    this.userService.dohvatiKorIme(this.kor_ime).subscribe((k: Korisnik) => {
      if(k != null){
        this.korisnikAzuriranje = k;
        this.prikaziTabelu = true;
        this.poruka1 = "";
      } else {
        this.poruka1 = "Korisnik sa ovim korisnickim imenom ne postoji."
        this.prikaziTabelu = false;
        this.prikaziFormuZaAzuriranje = false;
      }
    })
  }

    //kontakt moze imati 9 ili 10 cifata
    formatKontaktCheck(kontakt: string): boolean {
      let f =  /^[0-9]{9,10}$/;
      if(f.test(kontakt) == true){
        if(kontakt == this.kontakt){
          this.porukaKontakt = "";
        } else if(kontakt == this.kontaktFirme){
          this.porukaKontaktF = ""
        } else  if(kontakt == this.kontakt_reg){
          this.porukaKontaktZ = "";
        }
        return true;

      } else {
        if(kontakt == this.kontakt){
          this.porukaKontakt = "Unesite ispravan broj telefona!";
        } else if(kontakt == this.kontaktFirme){
          this.porukaKontaktF = "Unesite ispravan broj telefona!"
        } else  if(kontakt == this.kontakt_reg){
          this.porukaKontaktZ = "Unesite ispravan broj telefona!";
        }
        return false;
      }
    }

    //ime_korisnika@primer.com
   formatMejlCheck(mejl: string): boolean{
    let f = /^\w{3,}\@[a-zA-Z_]+\.[a-zA-Z]+$/;
    if(f.test(mejl) == true){
      if(mejl == this.mejl){
        this.porukaMejl = "";
      }  else  if(mejl == this.mejl_reg){
        this.porukaMejlZ = "";
      }
      return true;

    } else {
      if(mejl == this.mejl){
        this.porukaMejl = "Email mora biti u formatu kor_ime@primer.com, pokusajte ponovo!";
      }  else  if(mejl == this.mejl_reg){
        this.porukaMejlZ = "Email mora biti u formatu kor_ime@primer.com, pokusajte ponovo!";
      }
      return false;
    }
  }

  formatLozinkaCheck(lozinka : string): boolean {
    let f = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z][A-Za-z\d!@#$%^&*]{5,9}$/;
    if(f.test(lozinka) == true ){
      if(lozinka == this.lozinka_reg){
        this.porukaLozinkaZ = "";
      }
      return true;
    } else {
      if(lozinka == this.lozinka_reg){
        this.porukaLozinkaZ = "Lozinka mora imati 1 veliko slovo,3 mala i specijalan karakter. Minimum 6 i max 10 karaktera. Mora poceti slovom. Unesite ponovo!";
      }
      return false;
    }
  }




  selectFile(event: any){
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);

    if(this.selectedFile){
 
        const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['jpg', 'png'];
        if (!validExtensions.includes(fileExtension ?? '')) {
          this.poruka = "Nepravilan format slike! Dozvoljeni formati su JPG i PNG.";
          return;
        }
    }

    //provera dimenzija slike
    const reader = new FileReader();
    reader.onload = (e : any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
       //console.log('Image loaded:', img); // Provera da li je slika ucitana
        console.log('Image dimensions:', img.width, img.height);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if(ctx){
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          if (canvas.width < 100 || canvas.height < 100 || canvas.width > 300 || canvas.height > 300) {
            this.poruka = "Slika mora biti izmedju 100x100 i 300x300 piksela.";
          } else {
            this.poruka = "";
          }
        } else {
          this.poruka = "Neuspesno dobijanje 2D konteksta za canvas.";
        }

      }
      img.onerror = () => {
        console.error('Error loading image.'); // Prikazivanje greske ako slika ne moze da se ucita
      };
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error); // Prikazivanje greske ako fileReader ne moze da procita fajl
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }

  }

  azuriraj(){
    if(this.ime == "" && this.prezime == ""  && this.tip == ""  && this.mejl ==""  &&
      this.pol == ""  && this.adresa == ""  && this.kontakt == ""  && this.selectedFile == null
    ) {
      this.poruka = "Niste uneli nijedan podatak"
      return;
    } else {
      this.poruka = "";
      if((this.mejl != "" && this.formatMejlCheck(this.mejl) ==false)  || (this.kontakt != "" && this.formatKontaktCheck(this.kontakt)==false)){
        if(this.mejl == ""){this.porukaMejl = ""}
        if(this.kontakt == ""){ this.porukaKontakt = ""}
        return;
      }
      this.poruka = "";
      this.userService.dohvatiMejl(this.mejl).subscribe((k: Korisnik) =>{
        this.zahtevService.dohvatiMejl(this.mejl).subscribe((z:Zahtev) => {
          if( k!= null || z!= null){
            this.poruka = "Nalog sa ovom majl adresom vec postoji!";
            return;
          }
        })
      })
      this.poruka = "";


      this.userService.azurirajPodatke(this.korisnikAzuriranje.kor_ime,this.ime,this.prezime,this.mejl,this.kontakt,this.adresa,this.pol)
      .subscribe((u: Korisnik) => {
        if(u != null){

          this.korisnikAzuriranje = u;
          this.ngOnInit();
          alert('Podaci su izmenjeni!');

          if(this.selectedFile != null){
            this.userService.azurirajProfilnu(this.korisnikAzuriranje.kor_ime,this.selectedFile).subscribe((user: Korisnik) => {
              if(user != null){
                this.korisnikAzuriranje = user;
                this.ngOnInit();
                this.toggleAzuriranjePodataka();
                this.selectedFile = null;
                alert('Podaci su izmenjeni i izmenjena fotografija');
              } else {
                alert('GRESKA pri izmeni fotografije.')
              }
            })
          } else {
            this.toggleAzuriranjePodataka();
          }


        } else {
          alert("Podaci nisu izmenjeni, greska");
        }
      })



    }

  }

  toggleAzuriranjePodataka(){
    this.prikaziFormuZaAzuriranje = !this.prikaziFormuZaAzuriranje;
    this.ime ="";
    this.prezime ="";
    this.mejl ="";
    this.adresa ="";
    this.kontakt ="";
    this.pol ="";
  }


/* --------------------------------------- Dodavanje firme ---------------------------------- */
dodajUslugu() {
  const isValid = this.usluge.every(usluga => usluga.naziv.trim() !== '' && usluga.cena > 0);
  if (isValid) {
    this.usluge.push(new Usluga());
    this.porukaU = '';
  } else {
    this.porukaU = 'Naziv i cena moraju biti popunjeni i cena mora biti veća od nule.';
  }
}
 // Metoda za proveru validnosti usluga
 areAllServicesValid(): boolean {
  return this.usluge.every(usluga => usluga.naziv.trim() !== '' && usluga.cena > 0);
}

dodajFirmu() {
  if(this.nazivFirme == "" || this.adresaFirme == "" || this.kontaktFirme == "" || this.usluge.length == 0 ){
    this.porukaF = "Niste uneli sve podatke";
    return;
  }
  if(this.kontaktFirme && this.formatKontaktCheck(this.kontaktFirme)){
    this.porukaF = "";
    this.firmaService.dohvatiFirmuPoNazivu(this.nazivFirme).subscribe((firma:Firma) => {
      if(firma != null){
        this.porukaF = "Firma sa ovim nazivom vec postoji.";
        return;
      } else {
        this.coordinates = this.mapService.getCoordinates();
        if(this.coordinates == null){
          this.porukaLokacije = "Niste uneli lokaciju firme.";
          return;
        } else {
          this.porukaLokacije = "";
          console.log('LATITUDA',this.coordinates?.lat)
          console.log('LONGITUDA',this.coordinates?.lng)
          this.lokacija.latituda = this.coordinates?.lat;
          this.lokacija.longituda =this.coordinates?.lng;
          this.firmaService.dodajFirmu(this.nazivFirme,this.adresaFirme,this.kontaktFirme,this.usluge,this.lokacija).subscribe((f: Firma) => {
            if(f != null){
              alert('Uspesno ste dodali firmu')
              console.log("usluge", this.usluge);
            } else {
              alert('GRESKA pri dodavanju firme')
            }
          })
        }

      }
    })

  }

}

prvoSlovo(word: string): string {
  if (!word) return word; // Ako je string prazan, vrati isti string
  return word.charAt(0).toUpperCase() + word.slice(1);
}

dodajRadnika(){
  if(this.imeRadnika == "" || this.prezimeRadnika == "" || this.firmaZaRadnika == ""){
    this.porukaR = "Niste uneli sve podatke."
    return;
  }
  this.userService.dohvatiKorisnikaPoImenu(this.prvoSlovo(this.imeRadnika),this.prvoSlovo(this.prezimeRadnika)).subscribe((k: Korisnik) => {
    if(k != null){

      this.firmaService.dohvatiFirmuPoNazivu(this.prvoSlovo(this.firmaZaRadnika)).subscribe((f: Firma) => {
        if(f != null){

          this.firmaService.dohvatiFirmuZaDekoratera(k.kor_ime).subscribe((firma: Firma) => {
            if(firma != null){
              this.porukaR = "Korisnik je vec zaposlen u firmi " + firma.naziv;
            } else {

              this.firmaService.dodajDekoratera(k.kor_ime,k.ime,k.prezime,f.idF).subscribe((r: Firma) => {
                if(r != null){
                  alert('Uspesno ste dodali radnika');
                  this.clearZaposliRadnika();
                } else {
                  alert('GRESKA pri dodavanju radnika');
                }
              })
            }
          })

        } else {
          this.porukaR = "Ova firma ne postoji u sistemu."
          return;
        }
      })
    } else {
      this.porukaR = "Ovakav radnik ne postoji u sistemu "
      return;
    }
  })
}
/*------------------------------dodaj godisnji ---------------------------- */
dodajGodisnji(){
  if(this.firmaGodisnji == "" || this.pocetakGodisnji == "" || this.krajGodisnji == ""){
    this.porukaG = "Niste uneli sve podatke";
    return;
  }
  if( (new Date(this.pocetakGodisnji))  > (new Date(this.krajGodisnji))){
    this.porukaG = "Unesite ispravne datume."
    return;
  }
  this.porukaG = "";
  this.firmaService.dohvatiFirmuPoNazivu(this.firmaGodisnji).subscribe((f: Firma) => {
    if(f != null){
      this.firmaService.dodajGodisnji(f.idF,this.pocetakGodisnji,this.krajGodisnji).subscribe((fir: Firma) => {
        if(fir != null){
          alert('uspesno ste dodali godisnji odmor')
        } else{
          alert('greska pri dodavanju godisnjeg')
        }
      })
    } else {
      this.porukaG = "Ovakva firma ne postoji."
    }
  })
}
/**-----------------------------------dodaj zaposlenog u sistem -------------------------------------- */



selectFileZaposleni(event: any){
  this.selectedFileZaposleni = event.target.files[0];
  console.log('Selected file:', this.selectedFileZaposleni);

  if(this.selectedFile){
      const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'png'];
      if (!validExtensions.includes(fileExtension ?? '')) {
        this.porukaReg = "Nepravilan format slike! Dozvoljeni formati su JPG i PNG.";
        return;
      }
  }

  //provera dimenzija slike
  const reader = new FileReader();
  reader.onload = (e : any) => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
     //console.log('Image loaded:', img); // Provera da li je slika ucitana
      console.log('Image dimensions:', img.width, img.height);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if(ctx){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (canvas.width < 100 || canvas.height < 100 || canvas.width > 300 || canvas.height > 300) {
          this.porukaReg = "Slika mora biti izmedju 100x100 i 300x300 piksela.";
        } else {
          this.porukaReg = "";
        }
      } else {
        this.porukaReg = "Neuspesno dobijanje 2D konteksta za canvas.";
      }

    }
    img.onerror = () => {
      console.error('Error loading image.'); // Prikazivanje greske ako slika ne moze da se ucita
    };
  }
  reader.onerror = (error) => {
    console.error('Error reading file:', error); // Prikazivanje greske ako fileReader ne moze da procita fajl
  };
  if (this.selectedFile) {
    reader.readAsDataURL(this.selectedFile);
  }

}
clearDodajRadnika(){
  this.kor_ime_reg = "";
  this.ime_reg = "";
  this.prezime_reg = "";
  this.adresa_reg = "";
  this.kontakt_reg = "";
  this.mejl_reg = "";
  this.lozinka_reg = "";
  this.pol_reg = "";
  this.selectedFile = null;
}

clearZaposliRadnika(){
  this.imeRadnika = "";
  this.prezimeRadnika = "";
  this.firmaZaRadnika = "";
}

dodajZaposlenog(){
  this.porukaReg = '';
  this.porukaLozinkaZ = '';
  this.porukaMejlZ = '';
  this.porukaKontaktZ = '';
  if(this.kor_ime_reg == "" || this.lozinka_reg == "" || this.ime_reg == "" || this.prezime_reg =="" || this.pol_reg ==""
    || this.adresa_reg == "" || this.kontakt_reg == "" || this.mejl_reg ==""){
    this.porukaReg = "Niste uneli sve podatke!";
    return;
  }

  this.userService.dohvatiKorIme(this.kor_ime_reg).subscribe((k: Korisnik) => {
    this.zahtevService.dohvatiKorIme(this.kor_ime_reg).subscribe((z: Zahtev) => {
      if(k != null || z != null){
        this.porukaReg = "Korisnicko ime je zauzeto!"
        return;
      } else {
        this.userService.dohvatiMejl(this.mejl_reg).subscribe((kor: Korisnik) => {
          this.zahtevService.dohvatiMejl(this.mejl_reg).subscribe((zah: Zahtev) => {
            if(kor != null || zah != null){
              this.porukaReg = "Vec postoji nalog sa ovom email adresom!"
              return
            } else {
              this.porukaReg = "";
              if( this.formatKontaktCheck(this.kontakt_reg) && this.formatLozinkaCheck(this.lozinka_reg) && this.formatMejlCheck(this.mejl_reg)){
                this.userService.dodajKorisnika(this.ime_reg,this.prezime_reg,this.kor_ime_reg,this.lozinka_reg,this.adresa_reg,"dekorater",this.mejl_reg,
                  this.pol_reg,this.kontakt_reg,"","default.png"
                )
                .subscribe((r: Korisnik) => {
                  if(r != null) {

                    if(this.selectedFileZaposleni != null) {
                      this.userService.azurirajProfilnu(this.kor_ime_reg,this.selectedFileZaposleni).subscribe((korisnik: Korisnik) => {
                        if(korisnik != null) {
                          alert("Uspesno se uploadovali fotografiju.")
                        } else {
                          alert("GRESKA pri uploadu fotografije!")
                        }
                      })
                    }
                    alert("Uspesno ste dodali radnika.")
                    this.clearDodajRadnika();
                  } else {
                    alert("GRESKA pri dodavanju radnika.")
                  }
                })
              }
            }
          })
        })
      }
    })
  })
}


}














